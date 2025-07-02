"""initial tables

Revision ID: 8ebaacdb5641
Revises: 010bec2318fa
Create Date: 2025-06-26 00:35:12.532333

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8ebaacdb5641'
down_revision: Union[str, Sequence[str], None] = '010bec2318fa'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("username", sa.String, nullable=False, unique=True),
        sa.Column("hashed_password", sa.String, nullable=False),
    )


def downgrade() -> None:
    """Downgrade schema."""
    pass
