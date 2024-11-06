from typing import Annotated

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm

from src.schemas.auth import CreateUser, BaseToken
from src.utils.auth import create_user, get_user, verify_password, create_access_token

router = APIRouter()


@router.post("/sign-up")
def register(user: CreateUser):
    db_user_with_email = get_user(login=user.email)
    db_user_with_login = get_user(login=user.login)
    if db_user_with_email is not None:
        raise HTTPException(status_code=400, detail="Email already registered")
    if db_user_with_login is not None:
        raise HTTPException(status_code=400, detail="Login already registered")
    return create_user(user=user)


@router.post("/sign-in", response_model=BaseToken)
def authorize(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = get_user(login=form_data.username)

    if not user:
        raise HTTPException(status_code=400, detail="Incorrect login or password")

    if not verify_password(
        plain_password=form_data.password, hashed_password=user.hashed_password
    ):
        raise HTTPException(status_code=400, detail="Incorrect login or password")
    token = create_access_token(user_id=user.id)
    return {"access_token": token.access_token, "token_type": token.token_type}



