"""
app/main.py
FastAPI application factory — configure CORS, mount routers,
add global exception handlers.
"""
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError

from app.config import get_settings
from app.database import engine, Base
from app.routes import auth_router, profile_router

# ── Import models so Alembic and create_all can discover them ─────────────────
import app.models  # noqa: F401

settings = get_settings()

# ── App instance ──────────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.app_name,
    description=(
        "Production-ready authentication API for Itinerary 360.\n\n"
        "Built with FastAPI · SQLAlchemy · MySQL · JWT · bcrypt"
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(profile_router)


# ── Global exception handlers ─────────────────────────────────────────────────

@app.exception_handler(ValidationError)
async def pydantic_validation_handler(request: Request, exc: ValidationError):
    """Surface Pydantic validation errors as clean 422 responses."""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()},
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """
    Catch-all — prevents internal tracebacks leaking to clients.
    In development you'll still see the traceback in server logs.
    """
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected error occurred. Please try again."},
    )


# ── Health check ──────────────────────────────────────────────────────────────

@app.get("/health", tags=["Health"], summary="Health check")
def health():
    return {"status": "ok", "app": settings.app_name}


# ── Dev: auto-create tables (use Alembic in production) ───────────────────────
@app.on_event("startup")
def on_startup():
    if settings.app_env == "development":
        Base.metadata.create_all(bind=engine)
