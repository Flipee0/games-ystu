from datetime import datetime, date
from typing import Optional

from pydantic import BaseModel, EmailStr, field_validator

from src.utils.scheme_constraints import conbytestr


class BaseRole(BaseModel):
    id: int
    name: str


class BaseUser(BaseModel):
    id: int
    login: str
    email: EmailStr
    registration_date: datetime
    birth_date: date
    role: BaseRole
    avatar: Optional[str] = None


class UserInReview(BaseModel):
    id: int
    login: str
    role: str
    avatar: Optional[str] = None


class UpdateUser(BaseModel):
    login: conbytestr(64)
    email: EmailStr
    avatar: Optional[conbytestr(64)] = None
    birth_date: date

    @field_validator("login")
    @classmethod
    def validate_login(cls, value):
        if "@" in value:
            raise ValueError("Incorrect login")
        return value


class UsersPublic(BaseModel):
    id: int
    login: str
    avatar: Optional[str] = None
    registration_date: datetime
    role: str
