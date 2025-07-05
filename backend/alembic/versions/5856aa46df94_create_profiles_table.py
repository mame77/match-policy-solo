"""create profiles table

Revision ID: 5856aa46df94
Revises: dbdb41cc4596
Create Date: 2025-07-04 10:43:00.612473

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5856aa46df94'
down_revision: Union[str, Sequence[str], None] = 'dbdb41cc4596'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'profiles',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.String(), nullable=False, unique=True, index=True),
        sa.Column('bio', sa.String()),
        sa.Column('image_url', sa.String()),
    )


def downgrade() -> None:
    op.drop_table('profiles')
