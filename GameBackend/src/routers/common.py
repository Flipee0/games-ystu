from src.dependencies import get_authorized_user, get_admin_user, get_visitor_placeholder, get_moder_user
from src.schemas.common import *
from src.schemas.entity import Entity, Constraints
from src.models import Company, Genre, Locale, Platform, Series
from src.utils.router_creator import create_crud_router


VISITOR = get_visitor_placeholder
AUTHORIZED_USER = get_authorized_user
MODERATOR = get_moder_user
ADMIN = get_admin_user


company_router = create_crud_router(
    Entity(Company, CompanyScheme, Constraints(
        create=ADMIN,
        read=VISITOR,
        update=ADMIN,
        delete=ADMIN
    )))

genre_router = create_crud_router(
    Entity(Genre, GenreScheme, Constraints(
        create=ADMIN,
        read=VISITOR,
        update=ADMIN,
        delete=ADMIN
    )))

locale_router = create_crud_router(
    Entity(Locale, LocaleScheme, Constraints(
        create=ADMIN,
        read=VISITOR,
        update=ADMIN,
        delete=ADMIN
    )))

platform_router = create_crud_router(
    Entity(Platform, PlatformScheme, Constraints(
        create=ADMIN,
        read=VISITOR,
        update=ADMIN,
        delete=ADMIN
    )))

series_router = create_crud_router(
    Entity(Series, SeriesScheme, Constraints(
        create=ADMIN,
        read=VISITOR,
        update=ADMIN,
        delete=ADMIN
    )))
