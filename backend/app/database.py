"""
app/database.py
SQLAlchemy engine, session factory, and Base model.
"""
from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy.pool import QueuePool

from app.config import get_settings

settings = get_settings()

# ── Engine ────────────────────────────────────────────────────────────────────
engine = create_engine(
    settings.database_url,
    poolclass=QueuePool,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,          # detect stale connections
    pool_recycle=3600,           # recycle connections after 1 hour
    echo=settings.app_debug,     # log SQL in development
)

# ── Session Factory ───────────────────────────────────────────────────────────
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)

# ── Declarative Base ──────────────────────────────────────────────────────────
Base = declarative_base()


# ── Dependency — FastAPI route dependency injection ───────────────────────────
def get_db():
    """Yield a database session, guaranteed to close after request."""
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
