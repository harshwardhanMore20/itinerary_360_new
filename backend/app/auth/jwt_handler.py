"""
app/auth/jwt_handler.py
JWT creation, verification, and the FastAPI dependency that
extracts the current authenticated user from an Authorization header.
"""
from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import uuid4

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from redis import Redis
from redis.exceptions import RedisError
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db

settings = get_settings()
bearer_scheme = HTTPBearer()

redis_client: Optional[Redis] = None
if settings.redis_url:
    try:
        redis_client = Redis.from_url(settings.redis_url, decode_responses=True)
        redis_client.ping()
    except RedisError:
        redis_client = None

# ── Token blocklist helpers ─────────────────────────────────────────────────
_revoked_tokens: set[str] = set()

def _revoked_token_key(token: str) -> str:
    return f"revoked:{token}"


def _token_ttl(token: str) -> Optional[int]:
    try:
        payload = jwt.get_unverified_claims(token)
        exp = payload.get("exp")
        if exp is None:
            return None
        ttl = int(exp) - int(datetime.now(timezone.utc).timestamp())
        return ttl if ttl > 0 else 0
    except Exception:
        return None


# ── Token helpers ─────────────────────────────────────────────────────────────

def create_access_token(user_id: int, username: str, token_version: int = 0) -> tuple[str, int]:
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
        "jti": str(uuid4()),
        "token_version": token_version,
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
    """Add a token to the revocation store."""
    if redis_client is not None:
        ttl = _token_ttl(token)
        key = _revoked_token_key(token)
        if ttl is not None and ttl > 0:
            redis_client.set(key, "1", ex=ttl)
        else:
            redis_client.set(key, "1")
    else:
        _revoked_tokens.add(token)


def is_token_revoked(token: str) -> bool:
    if redis_client is not None:
        return redis_client.exists(_revoked_token_key(token)) == 1
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
    token_version: Optional[int] = payload.get("token_version")

    if user_id is None or token_version is None:
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

    if user.token_version != int(token_version):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is no longer valid. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated.",
        )

    return user
