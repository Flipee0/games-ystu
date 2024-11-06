from datetime import timedelta, datetime

from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy import insert

from database import session_maker
from src.models import User, Role
from config import SECRET_AUTH_KEY, ALGORITHM

from src.schemas.auth import CreateUser, BaseToken

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/sign-in")


def get_password_hash(password):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_user(login: str):
    with session_maker() as session:
        user = session.query(User).where((User.login == login) | (User.email == login))
        if user is None:
            return None
        return user.first()


def create_user(user: CreateUser):
    hashed_password = get_password_hash(user.password)
    with session_maker() as session:
        stmt = insert(User).values(
            email=user.email, login=user.login, hashed_password=hashed_password, birth_date=user.birth_date, role_id=3
        )
        session.execute(stmt)
        session.commit()


def create_access_token(user_id: int, expires_delta: timedelta | None = None):
    to_encode = {"id": user_id}
    with session_maker() as session:
        role = session.query(Role.name).select_from(User)\
            .join(Role, User.role_id == Role.id)\
            .where((User.id == user_id)).first()
        to_encode.update({"role": role.name})
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_AUTH_KEY, algorithm=ALGORITHM)
    token = BaseToken(access_token=encoded_jwt, token_type='Bearer')
    return token
