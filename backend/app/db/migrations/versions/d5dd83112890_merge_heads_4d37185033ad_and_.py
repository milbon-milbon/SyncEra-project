"""Merge heads 4d37185033ad and e7839dcae4f3

Revision ID: d5dd83112890
Revises: 4d37185033ad, e7839dcae4f3
Create Date: 2024-08-08 10:53:24.368843

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd5dd83112890'
down_revision: Union[str, None] = ('4d37185033ad', 'e7839dcae4f3')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
