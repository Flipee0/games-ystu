from typing import Annotated

from fastapi import Depends, HTTPException, status
from jose import jwt, JWTError
from database import session_maker

from config import SECRET_AUTH_KEY, ALGORITHM, ADMIN_ROLE_ID, MODER_ROLE_ID
from src.utils.auth import oauth2_scheme
from src.models import User


def get_visitor_placeholder():
    pass


def get_authorized_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_AUTH_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("id")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    with session_maker() as session:
        user = session.query(User).where(User.id == user_id)
        if user is None:
            raise credentials_exception
    return user.first()


def get_admin_user(user: User = Depends(get_authorized_user)):
    forbid_exception = HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Access denied"
    )
    if user.role_id != ADMIN_ROLE_ID:
        raise forbid_exception
    return user


def get_moder_user(user: User = Depends(get_authorized_user)):
    forbid_exception = HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Access denied"
    )
    if user.role_id not in (MODER_ROLE_ID, ADMIN_ROLE_ID):
        raise forbid_exception
    return user
