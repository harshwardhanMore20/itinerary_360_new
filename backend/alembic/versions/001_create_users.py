"""Initial migration — create users table

Revision ID: 001_create_users
Revises:
Create Date: 2026-01-01 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = "001_create_users"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id",            sa.Integer(),      nullable=False, autoincrement=True),
        sa.Column("username",      sa.String(50),     nullable=False),
        sa.Column("email",         sa.String(255),    nullable=False),
        sa.Column("password_hash", sa.String(255),    nullable=False),
        sa.Column("location",      sa.String(255),    nullable=True),
        sa.Column("is_active",     sa.Boolean(),      nullable=False, server_default="1"),
        sa.Column("created_at",    sa.DateTime(timezone=True), nullable=False,
                  server_default=sa.text("NOW()")),
        sa.Column("updated_at",    sa.DateTime(timezone=True), nullable=False,
                  server_default=sa.text("NOW()"),
                  onupdate=sa.text("NOW()")),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("username", name="uq_users_username"),
        sa.UniqueConstraint("email",    name="uq_users_email"),
    )
    op.create_index("ix_users_id",       "users", ["id"],       unique=False)
    op.create_index("ix_users_username", "users", ["username"], unique=True)
    op.create_index("ix_users_email",    "users", ["email"],    unique=True)


def downgrade() -> None:
    op.drop_index("ix_users_email",    table_name="users")
    op.drop_index("ix_users_username", table_name="users")
    op.drop_index("ix_users_id",       table_name="users")
    op.drop_table("users")
