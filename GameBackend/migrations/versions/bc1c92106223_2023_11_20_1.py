"""2023-11-20-1

Revision ID: bc1c92106223
Revises: 8080799ed64d
Create Date: 2023-11-20 08:51:33.893236

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bc1c92106223'
down_revision = '8080799ed64d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('FK__games__age_ratin__46E78A0C', 'games', type_='foreignkey')
    op.drop_table('age_ratings')
    op.drop_column('games', 'age_rating_id')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('games', sa.Column('age_rating_id', sa.INTEGER(), autoincrement=False, nullable=False))
    op.create_foreign_key('FK__games__age_ratin__46E78A0C', 'games', 'age_ratings', ['age_rating_id'], ['id'])
    op.create_table('age_ratings',
    sa.Column('id', sa.INTEGER(), sa.Identity(always=False, start=1, increment=1), autoincrement=True, nullable=False),
    sa.Column('age', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('id', name='PK__age_rati__3213E83F861E4A97')
    )
    # ### end Alembic commands ###
