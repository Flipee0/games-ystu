from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from src.routers.common import locale_router, platform_router, company_router, genre_router, series_router

from src.routers.game import router as game_router
from src.routers.auth import router as auth_router
from src.routers.user import router as user_router
from src.routers.image import router as image_router
from src.routers.review import router as review_router


app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(user_router, prefix="/user", tags=["user"])

app.include_router(locale_router, prefix="/locale", tags=["locale"])
app.include_router(platform_router, prefix="/platform", tags=["platform"])
app.include_router(company_router, prefix="/company", tags=["company"])
app.include_router(genre_router, prefix="/genre", tags=["genre"])
app.include_router(game_router, prefix="/game", tags=["game"])
app.include_router(series_router, prefix="/series", tags=["series"])
app.include_router(review_router, prefix="/review", tags=["review"])

app.include_router(image_router, prefix="/image", tags=["image"])


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}


