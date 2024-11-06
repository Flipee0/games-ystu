"""2023-10-23-1

Revision ID: 2c7272754862
Revises: 
Create Date: 2023-10-23 09:08:30.362226

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2c7272754862'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('age_ratings',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('age', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('companies',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=64), nullable=False),
    sa.Column('logo', sa.String(length=128), nullable=False),
    sa.Column('country', sa.String(length=64), nullable=False),
    sa.Column('description', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('genres',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=64), nullable=False),
    sa.Column('description', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('locales',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('language', sa.String(length=64), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('platforms',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=64), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('roles',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=64), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('series',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=64), nullable=False),
    sa.Column('description', sa.String(), nullable=False),
    sa.Column('logo', sa.String(length=128), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('games',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=64), nullable=False),
    sa.Column('release_date', sa.Date(), nullable=False),
    sa.Column('description', sa.String(), nullable=False),
    sa.Column('logo', sa.String(length=128), nullable=False),
    sa.Column('rating', sa.Integer(), nullable=True),
    sa.Column('age_rating_id', sa.Integer(), nullable=False),
    sa.Column('series_id', sa.Integer(), nullable=True),
    sa.Column('genre_id', sa.Integer(), nullable=False),
    sa.Column('developer_id', sa.Integer(), nullable=False),
    sa.Column('distributor_id', sa.Integer(), nullable=False),
    sa.Column('locale_id', sa.Integer(), nullable=False),
    sa.Column('platform_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['age_rating_id'], ['age_ratings.id'], ),
    sa.ForeignKeyConstraint(['developer_id'], ['companies.id'], ),
    sa.ForeignKeyConstraint(['distributor_id'], ['companies.id'], ),
    sa.ForeignKeyConstraint(['genre_id'], ['genres.id'], ),
    sa.ForeignKeyConstraint(['locale_id'], ['locales.id'], ),
    sa.ForeignKeyConstraint(['platform_id'], ['platforms.id'], ),
    sa.ForeignKeyConstraint(['series_id'], ['series.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=64), nullable=False),
    sa.Column('login', sa.String(length=64), nullable=False),
    sa.Column('hashed_password', sa.String(length=128), nullable=False),
    sa.Column('registration_date', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
    sa.Column('birth_date', sa.Date(), nullable=False),
    sa.Column('role_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['role_id'], ['roles.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('game_developer',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('game_id', sa.Integer(), nullable=False),
    sa.Column('developer_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['developer_id'], ['companies.id'], ),
    sa.ForeignKeyConstraint(['game_id'], ['games.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('game_distributor',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('game_id', sa.Integer(), nullable=False),
    sa.Column('distributor_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['distributor_id'], ['companies.id'], ),
    sa.ForeignKeyConstraint(['game_id'], ['games.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('game_genre',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('game_id', sa.Integer(), nullable=False),
    sa.Column('genre_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['game_id'], ['games.id'], ),
    sa.ForeignKeyConstraint(['genre_id'], ['genres.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('game_locale',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('game_id', sa.Integer(), nullable=False),
    sa.Column('locale_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['game_id'], ['games.id'], ),
    sa.ForeignKeyConstraint(['locale_id'], ['locales.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('game_platform',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('game_id', sa.Integer(), nullable=False),
    sa.Column('platform_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['game_id'], ['games.id'], ),
    sa.ForeignKeyConstraint(['platform_id'], ['platforms.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('reviews',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('rating', sa.Integer(), nullable=False),
    sa.Column('text', sa.String(length=4000), nullable=True),
    sa.Column('date', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
    sa.Column('game_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.CheckConstraint('(rating >= 0) and (rating <= 10)', name='rating_range'),
    sa.ForeignKeyConstraint(['game_id'], ['games.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('reviews')
    op.drop_table('game_platform')
    op.drop_table('game_locale')
    op.drop_table('game_genre')
    op.drop_table('game_distributor')
    op.drop_table('game_developer')
    op.drop_table('users')
    op.drop_table('games')
    op.drop_table('series')
    op.drop_table('roles')
    op.drop_table('platforms')
    op.drop_table('locales')
    op.drop_table('genres')
    op.drop_table('companies')
    op.drop_table('age_ratings')
    # ### end Alembic commands ###