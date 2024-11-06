from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import insert, desc, select
from sqlalchemy.orm import Session, joinedload, aliased

from database import get_session
from src.dependencies import get_admin_user
from src.models import Company, Game, Genre, Locale, Platform, User, GameGenre, GameDeveloper, \
    GameDistributor, GameLocale, GamePlatform
from src.schemas.game import GameScheme

router = APIRouter()


@router.get("/read-object", response_model=GameScheme.ExistingObject)
def read_object(
        object_id: int,
        session: Session = Depends(get_session),
):
    result = session.query(Game).options(joinedload(Game.genres), joinedload(Game.developers),
                                         joinedload(Game.distributors), joinedload(Game.locales),
                                         joinedload(Game.platforms), joinedload(Game.series)) \
        .where(Game.id == object_id).first()
    if result is None:
        raise HTTPException(404, "Not found result")
    return result


@router.post("/read-objects", response_model=list[GameScheme.ExistingObject])
def get_games_with_filters(
        series_id: int = None,
        order_by: str = "id", descending: bool = False,
        filters: GameScheme.Filter | None = None,
        limit: int | None = None, offset: int | None = None,
        filter_field: str | None = None, filter_value: str | None = None,
        session: Session = Depends(get_session),
):
    if not ((filter_field is None) == (filter_value is None)):
        raise HTTPException(400, "Only one filtering parameter is passed")
    if isFilterSet := (filter_field is not None):
        if not (filter_field in Game.__table__.columns):
            raise HTTPException(400, "Incorrect 'filter_field' parameter")
    if not (order_by in Game.__table__.columns):
        raise HTTPException(400, "Incorrect 'order_by' parameter")
    order_by_attribute = Game.__table__.columns[order_by]
    query = select(Game).join(Game.genres, isouter=True) \
        .join(aliased(Company, name="developers"), Game.developers, isouter=True) \
        .join(aliased(Company, name="distributors"), Game.distributors, isouter=True) \
        .join(Game.locales, isouter=True) \
        .join(Game.platforms, isouter=True) \
        .join(Game.series, isouter=True) \
        .order_by(desc(order_by_attribute) if descending else order_by_attribute).distinct() \
        .filter(Game.__table__.columns[filter_field].like(f"%{filter_value}%") if isFilterSet else True)

    if series_id is not None:
        query = query.filter(Game.series_id == series_id)

    if filters is not None:
        if filters.genres_ids:
            query = query.filter(Game.genres.any(Genre.id.in_(filters.genres_ids)))
        if filters.platforms_ids:
            query = query.filter(Game.platforms.any(Platform.id.in_(filters.platforms_ids)))
        if filters.locales_ids:
            query = query.filter(Game.locales.any(Locale.id.in_(filters.locales_ids)))
        if filters.developers_ids:
            query = query.filter(Game.developers.any(Company.id.in_(filters.developers_ids)))
        if filters.distributors_ids:
            query = query.filter(Game.distributors.any(Company.id.in_(filters.distributors_ids)))

    query = query.offset(offset).fetch(limit)
    result = session.execute(query)
    if result is None:
        raise HTTPException(404, "Not found result")

    return result.scalars().all()


@router.post("/create")
def create_object(
        game: GameScheme.NewObject,
        session: Session = Depends(get_session),
        user: User = Depends(get_admin_user)
):
    game_to_insert = Game(
        name=game.name, release_date=game.release_date, description=game.description, logo=game.logo,
        age_rating=game.age_rating, series_id=game.series_id, rating=None
    )

    session.add(game_to_insert)
    session.commit()

    id = game_to_insert.id
    for genre in game.genres_ids:
        session.execute(insert(GameGenre).values(game_id=id, genre_id=genre))
    for developer in game.developers_ids:
        session.execute(insert(GameDeveloper).values(game_id=id, developer_id=developer))
    for distributor in game.distributors_ids:
        session.execute(insert(GameDistributor).values(game_id=id, distributor_id=distributor))
    for locale in game.locales_ids:
        session.execute(insert(GameLocale).values(game_id=id, locale_id=locale))
    for platform in game.platforms_ids:
        session.execute(insert(GamePlatform).values(game_id=id, platform_id=platform))
    session.commit()


@router.post("/update")
def update_object(
        object_id: int,
        game: GameScheme.NewObject,
        session: Session = Depends(get_session),
        user: User = Depends(get_admin_user)
):
    selected_game = session.query(Game).options(joinedload(Game.genres), joinedload(Game.developers),
                                                joinedload(Game.distributors), joinedload(Game.locales),
                                                joinedload(Game.platforms)).where(Game.id == object_id).first()
    if selected_game is None:
        raise HTTPException(400, "Game not found")
    selected_game.name = game.name
    selected_game.release_date = game.release_date
    selected_game.description = game.description
    selected_game.logo = game.logo
    selected_game.series_id = game.series_id
    selected_game.age_rating = game.age_rating

    selected_game.genres = session.query(Genre).where(Genre.id.in_(game.genres_ids)).all()
    selected_game.developers = session.query(Company).where(Company.id.in_(game.developers_ids)).all()
    selected_game.distributors = session.query(Company).where(Company.id.in_(game.distributors_ids)).all()
    selected_game.locales = session.query(Locale).where(Locale.id.in_(game.locales_ids)).all()
    selected_game.platforms = session.query(Platform).where(Platform.id.in_(game.platforms_ids)).all()


@router.post("/delete")
def delete_object(
        object_id: int,
        session: Session = Depends(get_session),
        user: User = Depends(get_admin_user)
):
    session.delete(session.query(Game).where(Game.id == object_id).first())
    return None
