"""2023-11-13-1

Revision ID: 8080799ed64d
Revises: 2c7272754862
Create Date: 2023-11-13 10:05:40.976329

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8080799ed64d'
down_revision = '2c7272754862'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('FK__games__developer__47DBAE45', 'games', type_='foreignkey')
    op.drop_constraint('FK__games__platform___4BAC3F29', 'games', type_='foreignkey')
    op.drop_constraint('FK__games__locale_id__4AB81AF0', 'games', type_='foreignkey')
    op.drop_constraint('FK__games__distribut__48CFD27E', 'games', type_='foreignkey')
    op.drop_constraint('FK__games__genre_id__49C3F6B7', 'games', type_='foreignkey')
    op.drop_column('games', 'genre_id')
    op.drop_column('games', 'locale_id')
    op.drop_column('games', 'developer_id')
    op.drop_column('games', 'distributor_id')
    op.drop_column('games', 'platform_id')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('games', sa.Column('platform_id', sa.INTEGER(), autoincrement=False, nullable=False))
    op.add_column('games', sa.Column('distributor_id', sa.INTEGER(), autoincrement=False, nullable=False))
    op.add_column('games', sa.Column('developer_id', sa.INTEGER(), autoincrement=False, nullable=False))
    op.add_column('games', sa.Column('locale_id', sa.INTEGER(), autoincrement=False, nullable=False))
    op.add_column('games', sa.Column('genre_id', sa.INTEGER(), autoincrement=False, nullable=False))
    op.create_foreign_key('FK__games__genre_id__49C3F6B7', 'games', 'genres', ['genre_id'], ['id'])
    op.create_foreign_key('FK__games__distribut__48CFD27E', 'games', 'companies', ['distributor_id'], ['id'])
    op.create_foreign_key('FK__games__locale_id__4AB81AF0', 'games', 'locales', ['locale_id'], ['id'])
    op.create_foreign_key('FK__games__platform___4BAC3F29', 'games', 'platforms', ['platform_id'], ['id'])
    op.create_foreign_key('FK__games__developer__47DBAE45', 'games', 'companies', ['developer_id'], ['id'])
    # ### end Alembic commands ###
