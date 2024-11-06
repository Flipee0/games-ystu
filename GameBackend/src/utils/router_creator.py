import sqlalchemy.exc
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import insert, update, desc, select
from sqlalchemy.orm import Session

from database import get_session
from src.models import User
from src.schemas.entity import Entity


def create_crud_router(entity: Entity):
    router = APIRouter()
    model = entity.model

    @router.get("/read-object", response_model=entity.scheme.ExistingObject)
    def read_single_object(
            object_id: int,
            session: Session = Depends(get_session),
            user: User = Depends(entity.constraints.read)
    ):
        result = session.query(model).where(model.id == object_id).first()
        if result is None:
            raise HTTPException(404, "Not found result")
        return result

    @router.get("/read-objects", response_model=list[entity.scheme.ExistingObject])
    def read_multiple_objects(
            limit: int | None = None, offset: int | None = None,
            order_by: str = "id", descending: bool = False,
            filter_field: str | None = None, filter_value: str | None = None,
            session: Session = Depends(get_session),
            user: User = Depends(entity.constraints.read)
    ):
        if not ((filter_field is None) == (filter_value is None)):
            raise HTTPException(400, "Only one filtering parameter is passed")
        if isFilterSet := (filter_field is not None):
            if not (filter_field in model.__table__.columns):
                raise HTTPException(400, "Incorrect 'filter_field' parameter")
        if not (order_by in model.__table__.columns):
            raise HTTPException(400, "Incorrect 'order_by' parameter")
        order_by_attribute = model.__table__.columns[order_by]
        query = select(model).order_by(desc(order_by_attribute) if descending else order_by_attribute).distinct() \
            .filter(model.__table__.columns[filter_field].like(f"%{filter_value}%") if isFilterSet else True)\
            .offset(offset).fetch(limit)
        result = session.execute(query)
        if result is None:
            raise HTTPException(404, "Not found result")

        return result.scalars().all()

    @router.post("/create")
    def create_object(
            scheme: entity.scheme.NewObject,
            session: Session = Depends(get_session),
            user: User = Depends(entity.constraints.create)
    ):
        stmt = insert(entity.model).values(scheme.dict())
        try:
            session.execute(stmt)
        except sqlalchemy.exc.IntegrityError:
            raise HTTPException(status_code=400, detail="Incorrect data")

    @router.post("/update")
    def update_object(
            object_id: int,
            scheme: entity.scheme.NewObject,
            session: Session = Depends(get_session),
            user: User = Depends(entity.constraints.update)
    ):
        stmt = update(entity.model).values(scheme.dict()).where(entity.model.id == object_id)
        session.execute(stmt)

    @router.post("/delete")
    def delete_object(
            object_id: int,
            session: Session = Depends(get_session),
            user: User = Depends(entity.constraints.delete)
    ):
        session.delete(session.query(model).where(entity.model.id == object_id).first())

    return router
