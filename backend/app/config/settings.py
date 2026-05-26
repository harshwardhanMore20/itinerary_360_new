"""
app/config/settings.py
Centralised configuration — reads from .env file.
"""
from functools import lru_cache
from typing import Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ── App ──────────────────────────────────────────────────
    app_name: str = "Itinerary 360 API"
    app_env: str = "development"
    app_debug: bool = True
    allowed_origins: str = "http://localhost:5500,http://127.0.0.1:5500"

    # ── Database ──────────────────────────────────────────────────
    db_host: str = "localhost"
    db_port: int = 3306
    db_name: str = "itinerary360"
    db_user: str = "root"
    db_password: str = ""

    # ── Redis (optional) ───────────────────────────────────────────
    redis_url: Optional[str] = None

    # ── JWT ──────────────────────────────────────────────────
    jwt_secret_key: str = "change-this-in-production"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60
    jwt_refresh_token_expire_days: int = 30

    @field_validator("jwt_secret_key")
    @classmethod
    def validate_jwt_secret_key(cls, value: str) -> str:
        if not value or value.startswith("change-this") or len(value) < 32:
            raise ValueError(
                "JWT_SECRET_KEY must be set to a long, random value in production."
            )
        return value

    @property
    def database_url(self) -> str:
        return (
            f"mysql+pymysql://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    """Return a cached singleton Settings instance."""
    return Settings()
