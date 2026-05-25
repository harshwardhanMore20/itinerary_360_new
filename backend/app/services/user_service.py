"""
app/services/user_service.py
Business logic layer for user operations.
All database queries live here — routes stay thin.
"""
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models import User
from app.schemas import UserSignup, UserUpdate
from app.utils import hash_password, verify_password


# ── Read helpers ──────────────────────────────────────────────────────────────

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email.lower()).first()


def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.query(User).filter(User.username == username).first()


def get_user_by_identifier(db: Session, identifier: str) -> Optional[User]:
    """Look up a user by email or username."""
    identifier = identifier.strip()
    if "@" in identifier:
        return get_user_by_email(db, identifier)
    return get_user_by_username(db, identifier)


# ── Write helpers ─────────────────────────────────────────────────────────────

def create_user(db: Session, data: UserSignup) -> User:
    """
    Create a new user after uniqueness checks.
    Raises 409 Conflict if username or email already exists.
    """
    if get_user_by_email(db, data.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )
    if get_user_by_username(db, data.username):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This username is already taken.",
        )

    user = User(
        username=data.username,
        email=data.email.lower(),
        password_hash=hash_password(data.password),
        location=data.location,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, identifier: str, password: str) -> User:
    """
    Validate credentials and return the User object.
    Raises 401 for any invalid combination (never reveals which field is wrong).
    """
    user = get_user_by_identifier(db, identifier)

    # Use constant-time comparison even when user is None
    dummy_hash = "$2b$12$invalidhashplaceholderXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    stored_hash = user.password_hash if user else dummy_hash

    if not verify_password(password, stored_hash) or user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username/email or password.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated.",
        )

    return user


def update_user(db: Session, user: User, data: UserUpdate) -> User:
    """
    Partially update a user profile.
    Only provided (non-None) fields are updated.
    """
    if data.email is not None:
        email = data.email.lower()
        existing = get_user_by_email(db, email)
        if existing and existing.id != user.id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This email is already in use.",
            )
        user.email = email

    if data.username is not None:
        existing = get_user_by_username(db, data.username)
        if existing and existing.id != user.id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This username is already taken.",
            )
        user.username = data.username

    if data.location is not None:
        user.location = data.location.strip() or None

    if data.password is not None:
        user.password_hash = hash_password(data.password)

    db.commit()
    db.refresh(user)
    return user
