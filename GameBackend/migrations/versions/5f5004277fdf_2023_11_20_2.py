"""2023-11-20-2

Revision ID: 5f5004277fdf
Revises: bc1c92106223
Create Date: 2023-11-20 08:54:00.756475

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5f5004277fdf'
down_revision = 'bc1c92106223'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('games', sa.Column('age_rating', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('games', 'age_rating')
    # ### end Alembic commands ###
