"""
app/utils/security.py
Password hashing helpers using bcrypt via passlib.
"""
from passlib.context import CryptContext

# bcrypt with automatic salt generation — industry standard
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    """Return a bcrypt hash of the given password."""
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Return True if plain_password matches the stored hash."""
    return pwd_context.verify(plain_password, hashed_password)
