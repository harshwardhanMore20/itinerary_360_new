"""Add full_name and phone_number columns to users table

Revision ID: 002_add_fullname_phone_to_users
Revises: 001_create_users
Create Date: 2026-05-25 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = "002_add_fullname_phone_to_users"
down_revision = "001_create_users"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("users", sa.Column("full_name", sa.String(255), nullable=True))
    op.add_column("users", sa.Column("phone_number", sa.String(30), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "phone_number")
    op.drop_column("users", "full_name")
