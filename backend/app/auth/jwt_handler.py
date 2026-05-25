"""
app/auth/jwt_handler.py
JWT creation, verification, and the FastAPI dependency that
extracts the current authenticated user from an Authorization header.
"""
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db

settings = get_settings()
bearer_scheme = HTTPBearer()

# ── Token blocklist (in-memory; swap for Redis in production) ─────────────────
_revoked_tokens: set[str] = set()


# ── Token helpers ─────────────────────────────────────────────────────────────

def create_access_token(user_id: int, username: str) -> tuple[str, int]:
    """
    Create a signed JWT.
    Returns (token_string, expires_in_seconds).
    """
    expire_minutes = settings.jwt_access_token_expire_minutes
    expire_at = datetime.now(timezone.utc) + timedelta(minutes=expire_minutes)

    payload = {
        "sub": str(user_id),
        "username": username,
        "iat": datetime.now(timezone.utc),
        "exp": expire_at,
    }
    token = jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )
    return token, expire_minutes * 60


def decode_token(token: str) -> dict:
    """Decode and validate a JWT. Raises HTTPException on failure."""
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm],
        )
        return payload
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc


def revoke_token(token: str) -> None:
    """Add a token JTI / raw token to the blocklist."""
    _revoked_tokens.add(token)


def is_token_revoked(token: str) -> bool:
    return token in _revoked_tokens


# ── FastAPI dependency ────────────────────────────────────────────────────────

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    """
    Dependency that validates the Bearer token and returns the User ORM object.
    Import and use as: current_user: User = Depends(get_current_user)
    """
    from app.models import User  # local import avoids circular dependency

    token = credentials.credentials

    if is_token_revoked(token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_token(token)
    user_id: Optional[str] = payload.get("sub")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == int(user_id)).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated.",
        )

    return user
