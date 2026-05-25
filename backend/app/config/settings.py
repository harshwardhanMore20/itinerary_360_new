"""
app/config/settings.py
Centralised configuration — reads from .env file.
"""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ── App ──────────────────────────────────────────────────
    app_name: str = "Itinerary 360 API"
    app_env: str = "development"
    app_debug: bool = True
    allowed_origins: str = "http://localhost:5500,http://127.0.0.1:5500"

    # ── Database ─────────────────────────────────────────────
    db_host: str = "localhost"
    db_port: int = 3306
    db_name: str = "itinerary360"
    db_user: str = "root"
    db_password: str = ""

    # ── JWT ──────────────────────────────────────────────────
    jwt_secret_key: str = "change-this-in-production"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60
    jwt_refresh_token_expire_days: int = 30

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
