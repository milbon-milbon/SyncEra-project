"""add created_at column to resposes table

Revision ID: 522040829833
Revises: 1d0f37b042cd
Create Date: 2024-08-07 05:48:46.623910

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '522040829833'
down_revision: Union[str, None] = '1d0f37b042cd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('responses', sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('responses', 'created_at')
    # ### end Alembic commands ###
