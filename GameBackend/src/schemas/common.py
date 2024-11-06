from pydantic import BaseModel

from src.schemas.id import IdScheme
from src.utils.scheme_constraints import conbytestr


class CompanyScheme(BaseModel):
    class NewObject(BaseModel):
        name: conbytestr(64)
        logo: conbytestr(128)
        country: conbytestr(64)
        description: str

    class ExistingObject(NewObject, IdScheme):
        pass


class GenreScheme(BaseModel):
    class NewObject(BaseModel):
        name: conbytestr(64)
        description: str

    class ExistingObject(NewObject, IdScheme):
        pass


class LocaleScheme(BaseModel):
    class NewObject(BaseModel):
        language: conbytestr(64)

    class ExistingObject(NewObject, IdScheme):
        pass


class PlatformScheme(BaseModel):
    class NewObject(BaseModel):
        name: conbytestr(64)

    class ExistingObject(NewObject, IdScheme):
        pass


class SeriesScheme(BaseModel):
    class NewObject(BaseModel):
        name: conbytestr(64)
        description: str
        logo: conbytestr(128)

    class ExistingObject(NewObject, IdScheme):
        pass
