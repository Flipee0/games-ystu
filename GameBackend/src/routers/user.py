from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select

from sqlalchemy.orm import Session

from database import get_session
from src.dependencies import get_authorized_user, get_admin_user
from src.schemas.user import BaseUser, BaseRole, UpdateUser, UsersPublic
from src.models import User, Role
from src.utils.auth import get_user

from config import ADMIN_ROLE_ID

router = APIRouter()


@router.get("/me", response_model=BaseUser)
def read_users_me(current_user: User = Depends(get_authorized_user), session: Session = Depends(get_session)):
    user = BaseUser(
        id=current_user.id,
        login=current_user.login,
        email=current_user.email,
        registration_date=current_user.registration_date,
        birth_date=current_user.birth_date,
        role=BaseRole(
            id=current_user.role_id,
            name=current_user.role.name
        ),
        avatar=current_user.avatar,
    )
    return user


@router.post("/update")
def update_current_user(
        data: UpdateUser,
        current_user: User = Depends(get_authorized_user),
        session: Session = Depends(get_session),
):
    query = select(User).filter(User.id == current_user.id)
    result = session.execute(query)
    user: User = result.scalars().first()

    if current_user.login != data.login:
        db_user_with_login = get_user(login=data.login)
        if db_user_with_login is not None:
            raise HTTPException(status_code=400, detail="Login already registered")
    if current_user.email != data.email:
        db_user_with_email = get_user(login=data.email)
        if db_user_with_email is not None:
            raise HTTPException(status_code=400, detail="Email already registered")

    user.login = data.login
    user.email = data.email
    user.birth_date = data.birth_date
    user.avatar = data.avatar
    return None


@router.get("/get-users", response_model=list[UsersPublic])
def get_users(
        limit: int | None = None, offset: int | None = None,
        login: str | None = None,
        role: str | None = None,
        current_user: User = Depends(get_admin_user),
        session: Session = Depends(get_session),
):
    query = select(User).join(User.role) \
        .order_by(User.id).distinct() \


    if login is not None:
        query = query.filter(User.login.like(f"%{login}%"))

    if role is not None:
        query = query.filter(User.role.has(Role.name == role))

    query = query.offset(offset).fetch(limit)
    result = session.execute(query)
    if result is None:
        raise HTTPException(404, "Not found result")

    result = result.scalars().all()
    users = []
    for user in result:
        review = UsersPublic(
            id=user.id,
            login=user.login,
            avatar=user.avatar,
            registration_date=user.registration_date,
            role=user.role.name,
        )
        users.append(review)

    return users


@router.post("/grant-role")
def grant_role(
        role_name: str,
        user_id: int,
        current_user: User = Depends(get_admin_user),
        session: Session = Depends(get_session),
):
    role_query = select(Role).filter(Role.name == role_name)
    role = session.execute(role_query).scalars().first()

    if role is None:
        raise HTTPException(status_code=400, detail="Invalid role name")

    role_id = role.id
    if role_id == ADMIN_ROLE_ID:
        raise HTTPException(status_code=400, detail="Can`t grant admin role")

    user_query = select(User).filter(User.id == user_id)
    user = session.execute(user_query).scalars().first()
    if user is None:
        raise HTTPException(status_code=400, detail="Invalid user id")

    user.role_id = role_id
    session.commit()
