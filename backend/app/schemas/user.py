"""
app/schemas/user.py
Pydantic v2 schemas for request validation and response serialisation.
"""
import re
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator, model_validator, ConfigDict


# ── Shared ────────────────────────────────────────────────────────────────────

USERNAME_RE = re.compile(r"^[a-zA-Z0-9_.-]{3,50}$")
PASSWORD_MIN_LENGTH = 8


# ── Signup ────────────────────────────────────────────────────────────────────

class UserSignup(BaseModel):
    username: str
    email: EmailStr
    password: str
    location: Optional[str] = None

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        v = v.strip()
        if not USERNAME_RE.match(v):
            raise ValueError(
                "Username must be 3–50 characters and contain only letters, "
                "numbers, underscores, hyphens, or dots."
            )
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < PASSWORD_MIN_LENGTH:
            raise ValueError(f"Password must be at least {PASSWORD_MIN_LENGTH} characters.")
        if not re.search(r"[A-Za-z]", v):
            raise ValueError("Password must contain at least one letter.")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one digit.")
        return v

    @field_validator("location")
    @classmethod
    def validate_location(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            if len(v) > 255:
                raise ValueError("Location must be under 255 characters.")
            return v or None
        return None


# ── Login ─────────────────────────────────────────────────────────────────────

class UserLogin(BaseModel):
    """Accept either username or email in the `identifier` field."""
    identifier: str   # username OR email
    password: str

    @field_validator("identifier")
    @classmethod
    def validate_identifier(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Username or email is required.")
        return v


# ── Profile update ────────────────────────────────────────────────────────────

class UserUpdate(BaseModel):
    username:  Optional[str] = None
    email:     Optional[EmailStr] = None
    location:  Optional[str] = None
    password:  Optional[str] = None

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            if not USERNAME_RE.match(v):
                raise ValueError("Invalid username format.")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and len(v) < PASSWORD_MIN_LENGTH:
            raise ValueError(f"Password must be at least {PASSWORD_MIN_LENGTH} characters.")
        return v


# ── Responses ─────────────────────────────────────────────────────────────────

class UserResponse(BaseModel):
    """Safe user object — never includes password_hash."""
    model_config = ConfigDict(from_attributes=True)

    id:         int
    username:   str
    email:      str
    location:   Optional[str]
    is_active:  bool
    created_at: datetime
    updated_at: datetime


class TokenResponse(BaseModel):
    access_token:  str
    token_type:    str = "bearer"
    expires_in:    int  # seconds


class AuthResponse(BaseModel):
    message: str
    user:    UserResponse
    token:   TokenResponse


class MessageResponse(BaseModel):
    message: str
