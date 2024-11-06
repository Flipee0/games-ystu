from sqlalchemy import select

from database import session_maker
from src.models import Review


def get_review(user_id: int, game_id: int):
    with session_maker() as session:
        query = select(Review).filter((Review.user_id == user_id) and (Review.game_id == game_id))
        result = session.execute(query)
        review = result.scalars().first()
        return False if review is None else review
