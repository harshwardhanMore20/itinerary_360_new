"""
app/routes/auth.py
Authentication endpoints: POST /signup, POST /login, POST /logout
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import UserSignup, UserLogin, AuthResponse, MessageResponse, TokenResponse, UserResponse
from app.services import create_user, authenticate_user
from app.auth import create_access_token, revoke_token, get_current_user
from app.models import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/signup",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account",
)
def signup(payload: UserSignup, db: Session = Depends(get_db)):
    """
    Create a new user account.

    - Validates username format and uniqueness
    - Validates email format and uniqueness
    - Hashes password with bcrypt before storage
    - Returns a JWT token ready to use
    """
    user = create_user(db, payload)
    token, expires_in = create_access_token(user.id, user.username)

    return AuthResponse(
        message="Account created successfully. Welcome to Itinerary 360!",
        user=UserResponse.model_validate(user),
        token=TokenResponse(access_token=token, expires_in=expires_in),
    )


@router.post(
    "/login",
    response_model=AuthResponse,
    status_code=status.HTTP_200_OK,
    summary="Log in with username/email and password",
)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate a user and return a JWT access token.

    - `identifier` can be the username **or** email
    - Timing-safe password comparison to prevent user enumeration
    """
    user = authenticate_user(db, payload.identifier, payload.password)
    token, expires_in = create_access_token(user.id, user.username)

    return AuthResponse(
        message=f"Welcome back, {user.username}!",
        user=UserResponse.model_validate(user),
        token=TokenResponse(access_token=token, expires_in=expires_in),
    )


@router.post(
    "/logout",
    response_model=MessageResponse,
    status_code=status.HTTP_200_OK,
    summary="Log out and invalidate the current token",
)
def logout(
    current_user: User = Depends(get_current_user),
    # We need raw credentials to revoke the specific token
    credentials=Depends(__import__("fastapi.security", fromlist=["HTTPBearer"]).HTTPBearer()),
):
    """
    Revoke the current JWT so it can no longer be used.
    User data is never deleted — only the session is ended.
    """
    revoke_token(credentials.credentials)
    return MessageResponse(message="Logged out successfully.")
