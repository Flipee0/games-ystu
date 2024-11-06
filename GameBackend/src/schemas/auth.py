import re
from datetime import date

from pydantic import BaseModel, EmailStr, field_validator

from src.utils.scheme_constraints import conbytestr


class CreateUser(BaseModel):
    login: conbytestr(64)
    email: EmailStr
    password: str
    birth_date: date

    @field_validator("login")
    @classmethod
    def validate_login(cls, value):
        if "@" in value:
            raise ValueError("Incorrect login")
        return value

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):
        if (len(value) <= 8) or \
                (re.search(r'\d+', value) is None) or \
                (re.search(r'[`~+=\\/.,<>#$%^&*()!?]+', value) is None) or \
                (re.search(r'[A-ZА-Я]+', value) is None) or \
                (re.search(r'[a-zа-я]+', value) is None):
            raise ValueError("Weak password")
        return value


class BaseToken(BaseModel):
    access_token: str
    token_type: str
