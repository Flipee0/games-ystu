from typing import Optional

from pydantic import BaseModel, Field
from datetime import datetime

from src.schemas.id import IdScheme
from src.schemas.user import UserInReview
from src.utils.scheme_constraints import conbytestr


class ReviewScheme:
    class BASE(BaseModel):
        rating: int = Field(ge=0, le=10)
        text: conbytestr(4000)

    class NewObject(BASE):
        pass

    class UpdateAny(BaseModel):
        id: int
        text: conbytestr(4000)
        update_reason: Optional[conbytestr(64)] = None

    class ExistingObject(BASE, IdScheme):
        user: UserInReview
        date: datetime
        updated_by: Optional[UserInReview] = None
        updated_at: Optional[datetime] = None
        update_reason: Optional[conbytestr(64)] = None

