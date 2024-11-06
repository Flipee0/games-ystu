from datetime import date
from typing import Optional

from pydantic import BaseModel

from src.schemas.common import GenreScheme, CompanyScheme, LocaleScheme, PlatformScheme, SeriesScheme
from src.schemas.id import IdScheme
from src.utils.scheme_constraints import conbytestr


class GameScheme:
    class BASE(BaseModel):
        name: conbytestr(64)
        release_date: date
        description: str
        logo: conbytestr(128)
        age_rating: int

    class NewObject(BASE):
        series_id: Optional[int] = None
        genres_ids: list[int]
        developers_ids: list[int]
        distributors_ids: list[int]
        locales_ids: list[int]
        platforms_ids: list[int]

    class ExistingObject(BASE, IdScheme):
        series: Optional[SeriesScheme.ExistingObject] = None
        rating: Optional[int] = None
        genres: list[GenreScheme.ExistingObject]
        developers: list[CompanyScheme.ExistingObject]
        distributors: list[CompanyScheme.ExistingObject]
        locales: list[LocaleScheme.ExistingObject]
        platforms: list[PlatformScheme.ExistingObject]

    class Filter(BaseModel):
        genres_ids: list[int] = []
        platforms_ids: list[int] = []
        locales_ids: list[int] = []
        developers_ids: list[int] = []
        distributors_ids: list[int] = []
