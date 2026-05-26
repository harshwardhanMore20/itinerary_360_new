"""
app/routes/profile.py
Protected profile endpoints: GET /profile, PATCH /profile
Requires a valid Bearer token (JWT).
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import UserResponse, UserUpdate, MessageResponse
from app.auth import get_current_user
from app.services import update_user
from app.models import User

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get(
    "",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get the currently logged-in user's profile",
)
def get_profile(current_user: User = Depends(get_current_user)):
    """
    Return the authenticated user's public profile data.
    Password hash is never exposed.
    """
    return UserResponse.model_validate(current_user)


@router.patch(
    "",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Update the currently logged-in user's profile",
)
def update_profile(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Partially update profile fields. All fields are optional.
    Changing the password invalidates existing tokens and forces a fresh login.
    """
    updated = update_user(db, current_user, payload)
    return UserResponse.model_validate(updated)
