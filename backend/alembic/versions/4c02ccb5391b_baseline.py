"""baseline

Revision ID: 4c02ccb5391b
Revises: 5856aa46df94
Create Date: 2025-07-04 10:56:31.020100

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4c02ccb5391b'
down_revision: Union[str, Sequence[str], None] = '5856aa46df94'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
