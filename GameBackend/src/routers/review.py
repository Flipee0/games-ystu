from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, aliased
from datetime import datetime

from database import get_session
from src.dependencies import get_authorized_user, get_moder_user
from src.models import User, Review, Role
from src.schemas.review import ReviewScheme
from src.schemas.user import UserInReview
from src.utils.review import get_review

router = APIRouter()


@router.get("/get-my-review", response_model=ReviewScheme.ExistingObject)
def get_current_user_review(
        game_id: int,
        session: Session = Depends(get_session),
        user: User = Depends(get_authorized_user)
):
    query = select(Review)\
        .join(aliased(User, name="user"), Review.user, isouter=True)\
        .join(aliased(Role, name="role"), User.role)\
        .join(aliased(User, name="updated_by"), Review.updated_by, isouter=True)\
        .filter((Review.user_id == user.id) & (Review.game_id == game_id))
    result = session.execute(query)
    selected_review = result.scalars().first()

    if selected_review is None:
        raise HTTPException(404, "Review from this user not exists")

    review = ReviewScheme.ExistingObject(
        id=selected_review.id,
        rating=selected_review.rating,
        text=selected_review.text,
        date=selected_review.date,
        user=UserInReview(
            id=selected_review.user.id,
            login=selected_review.user.login,
            role=selected_review.user.role.name,
            avatar=selected_review.user.avatar,
        ),
        updated_at=selected_review.updated_at,
        update_reason=selected_review.update_reason,
    )
    if selected_review.updated_by is not None:
        review.updated_by = UserInReview(
                id=selected_review.updated_by.id,
                login=selected_review.updated_by.login,
                role=selected_review.updated_by.role.name,
                avatar=selected_review.updated_by.avatar,
            )
    return review


@router.get("/get-game-reviews", response_model=list[ReviewScheme.ExistingObject])
def get_game_reviews(
        game_id: int,
        limit: int | None = None, offset: int | None = None,
        rating_filter: int | None = None,
        session: Session = Depends(get_session)
):
    query = select(Review).order_by(Review.date) \
        .join(aliased(User, name="user"), Review.user, isouter=True) \
        .join(aliased(User, name="updated_by"), Review.updated_by, isouter=True) \
        .filter((Review.game_id == game_id) & (True if rating_filter is None else Review.rating == rating_filter))\
        .offset(offset).fetch(limit)
    result = session.execute(query)
    selected_reviews = result.scalars().all()
    reviews = []
    for selected_review in selected_reviews:
        review = ReviewScheme.ExistingObject(
            id=selected_review.id,
            rating=selected_review.rating,
            text=selected_review.text,
            date=selected_review.date,
            user=UserInReview(
                id=selected_review.user.id,
                login=selected_review.user.login,
                role=selected_review.user.role.name,
                avatar=selected_review.user.avatar,
            ),
            updated_at=selected_review.updated_at,
            update_reason=selected_review.update_reason,
        )
        if selected_review.updated_by is not None:
            review.updated_by = UserInReview(
                    id=selected_review.updated_by.id,
                    login=selected_review.updated_by.login,
                    role=selected_review.updated_by.role.name,
                    avatar=selected_review.updated_by.avatar,
                )
        reviews.append(review)
    return reviews


@router.post("/add")
def add_review(
        game_id: int,
        data: ReviewScheme.NewObject,
        session: Session = Depends(get_session),
        user: User = Depends(get_authorized_user)
):
    if get_review(user.id, game_id):
        raise HTTPException(400, "Review from this user already exists")

    review = Review(
        rating=data.rating,
        text=data.text,
        game_id=game_id,
        user_id=user.id
    )

    session.add(review)
    session.commit()
    return None


@router.post("/edit_my_review")
def edit_current_user_review(
        game_id: int,
        data: ReviewScheme.NewObject,
        session: Session = Depends(get_session),
        user: User = Depends(get_authorized_user)
):
    selected_review = session.query(Review).where((Review.user_id == user.id) & (Review.game_id == game_id)).first()
    if selected_review is None:
        raise HTTPException(400, "Review not found")

    selected_review.rating = data.rating
    selected_review.text = data.text
    selected_review.updated_at = datetime.now()
    selected_review.updated_by_id = user.id

    session.commit()


@router.post("/edit_any_review")
def edit_any_review(
        data: ReviewScheme.UpdateAny,
        session: Session = Depends(get_session),
        user: User = Depends(get_moder_user)
):
    selected_review = session.query(Review).where(Review.id == data.id).first()
    if selected_review is None:
        raise HTTPException(400, "Review not found")

    selected_review.text = data.text
    selected_review.updated_at = datetime.now()
    selected_review.updated_by_id = user.id
    selected_review.update_reason = data.update_reason

    session.commit()


@router.post("/delete_my_review")
def delete_current_user_review(
        game_id: int,
        session: Session = Depends(get_session),
        user: User = Depends(get_authorized_user)
):
    if not (selected_review := get_review(user.id, game_id)):
        raise HTTPException(400, "Review not found")

    session.delete(selected_review)
    session.commit()

    return None


@router.post("/delete_any_review")
def delete_any_review(
        review_id: int,
        session: Session = Depends(get_session),
        user: User = Depends(get_moder_user)
):
    selected_review = session.query(Review).where(Review.id == review_id).first()
    if selected_review is None:
        raise HTTPException(400, "Review not found")

    session.delete(selected_review)
    session.commit()
