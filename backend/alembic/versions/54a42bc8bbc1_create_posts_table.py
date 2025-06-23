"""create posts table

Revision ID: 54a42bc8bbc1
Revises: 934a2d52e1b4
Create Date: 2025-06-21 00:23:20.346127

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '54a42bc8bbc1'
down_revision: Union[str, Sequence[str], None] = '934a2d52e1b4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'posts',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('content', sa.String(), nullable=False),
    )


def downgrade() -> None:
    """Downgrade schema."""
    pass
