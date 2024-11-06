from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Table, func, \
    CheckConstraint, Date, Index
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    pass


GameGenre = Table('game_genre', Base.metadata,
                  Column("id", Integer, primary_key=True),
                  Column('game_id', Integer(), ForeignKey("games.id"), nullable=False),
                  Column('genre_id', Integer(), ForeignKey("genres.id"), nullable=False)
                  )

GameDeveloper = Table('game_developer', Base.metadata,
                      Column("id", Integer, primary_key=True),
                      Column('game_id', Integer(), ForeignKey("games.id"), nullable=False),
                      Column('developer_id', Integer(), ForeignKey("companies.id"), nullable=False)
                      )

GameDistributor = Table('game_distributor', Base.metadata,
                        Column("id", Integer, primary_key=True),
                        Column('game_id', Integer(), ForeignKey("games.id"), nullable=False),
                        Column('distributor_id', Integer(), ForeignKey("companies.id"), nullable=False)
                        )

GameLocale = Table('game_locale', Base.metadata,
                   Column("id", Integer, primary_key=True),
                   Column('game_id', Integer(), ForeignKey("games.id"), nullable=False),
                   Column('locale_id', Integer(), ForeignKey("locales.id"), nullable=False)
                   )

GamePlatform = Table('game_platform', Base.metadata,
                     Column("id", Integer, primary_key=True),
                     Column('game_id', Integer(), ForeignKey("games.id"), nullable=False),
                     Column('platform_id', Integer(), ForeignKey("platforms.id"), nullable=False)
                     )


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True)
    name = Column(String(length=64), nullable=False)

    users = relationship("User", back_populates="role")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String(length=64), nullable=False)
    login = Column(String(length=64), nullable=False)
    hashed_password = Column(String(length=128), nullable=False)
    registration_date = Column(DateTime, server_default=func.now(), nullable=False)
    birth_date = Column(Date, nullable=False)
    avatar = Column(String(length=128), nullable=True)

    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)

    role = relationship("Role", back_populates="users", uselist=False)

    reviews = relationship("Review", back_populates="user", foreign_keys="[Review.user_id]")
    updated_reviews = relationship("Review", back_populates="updated_by", foreign_keys="[Review.updated_by_id]")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True)
    rating = Column(Integer, nullable=False)
    text = Column(String(length=4000), nullable=True)
    date = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, nullable=True)
    update_reason = Column(String(length=64), nullable=True)

    updated_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    game_id = Column(Integer, ForeignKey("games.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    game = relationship("Game", back_populates="reviews")
    user = relationship("User", back_populates="reviews", uselist=False, foreign_keys="[Review.user_id]")
    updated_by = relationship("User", back_populates="updated_reviews", uselist=False,
                              foreign_keys="[Review.updated_by_id]")

    __table_args__ = (
        CheckConstraint('(rating >= 0) and (rating <= 10)', name="rating_range"),
        {'implicit_returning': False}
    )


class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True)
    name = Column(String(length=64), nullable=False)
    release_date = Column(Date, nullable=False)
    description = Column(String, nullable=False)
    logo = Column(String(length=128), nullable=False)
    rating = Column(Integer, nullable=True)
    age_rating = Column(Integer, nullable=True)

    series_id = Column(Integer, ForeignKey("series.id", ondelete='SET NULL'), nullable=True)

    series = relationship("Series", back_populates="games")

    reviews = relationship("Review", back_populates="game")

    genres = relationship("Genre", secondary=GameGenre, back_populates="games")
    developers = relationship("Company", secondary=GameDeveloper, back_populates="developed_games")
    distributors = relationship("Company", secondary=GameDistributor, back_populates="distributed_games")
    locales = relationship("Locale", secondary=GameLocale, back_populates="games")
    platforms = relationship("Platform", secondary=GamePlatform, back_populates="games")

    name_index = Index("name_index", name)


class Series(Base):
    __tablename__ = "series"

    id = Column(Integer, primary_key=True)
    name = Column(String(length=64), nullable=False)
    description = Column(String, nullable=False)
    logo = Column(String(length=128), nullable=False)

    games = relationship("Game", back_populates="series")


class Genre(Base):
    __tablename__ = "genres"

    id = Column(Integer, primary_key=True)
    name = Column(String(length=64), nullable=False)
    description = Column(String, nullable=False)

    games = relationship("Game", secondary=GameGenre, back_populates="genres")


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True)
    name = Column(String(length=64), nullable=False)
    logo = Column(String(length=128), nullable=False)
    country = Column(String(length=64), nullable=False)
    description = Column(String, nullable=False)

    developed_games = relationship("Game", secondary=GameDeveloper, back_populates="developers")
    distributed_games = relationship("Game", secondary=GameDistributor, back_populates="distributors")


class Locale(Base):
    __tablename__ = "locales"

    id = Column(Integer, primary_key=True)
    language = Column(String(length=64), nullable=False)

    games = relationship("Game", secondary=GameLocale, back_populates="locales")


class Platform(Base):
    __tablename__ = "platforms"

    id = Column(Integer, primary_key=True)
    name = Column(String(length=64), nullable=False)

    games = relationship("Game", secondary=GamePlatform, back_populates="platforms")


metadata = Base.metadata
