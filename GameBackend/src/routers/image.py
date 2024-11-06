import os.path
from io import BytesIO
from os import path, mkdir, sep
from uuid import uuid4
from datetime import datetime

from fastapi import APIRouter, UploadFile, Depends, HTTPException
from fastapi.responses import FileResponse

from src.dependencies import get_authorized_user, get_admin_user
from src.models import User

from config import AVAILABLE_IMAGE_CONTENT_TYPES, FILES_PATH
from PIL import Image, ImageOps

router = APIRouter()


async def save_file(file: UploadFile, width: int, height: int):
    if file.content_type not in AVAILABLE_IMAGE_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="Incorrect file extension")
    if file.size > 1024 * 1024 * 4:
        raise HTTPException(status_code=400, detail="Excess file size limit")
    request_object_content = await file.read()
    img = Image.open(BytesIO(request_object_content))
    img = ImageOps.pad(img, (width, height), method=Image.LANCZOS)
    image_path = path.join(FILES_PATH, "Images/", datetime.today().strftime('%Y-%m-%d'))
    if not path.exists(image_path):
        mkdir(image_path)
    file = path.join(image_path, str(uuid4()) + ".png")
    img.save(file)
    return path.relpath(file, start=FILES_PATH).replace(sep, '/')


@router.post("/upload/logo")
async def upload_logo(file: UploadFile, current_user: User = Depends(get_admin_user)):
    return await save_file(file, 800, 450)


@router.post("/upload/avatar")
async def upload_logo(file: UploadFile, current_user: User = Depends(get_authorized_user)):
    return await save_file(file, 300, 300)


@router.get("/get")
def get_image(file_path: str):
    if os.path.isfile(image_path := os.path.join(FILES_PATH, file_path)):
        return FileResponse(path=image_path, media_type='multipart/form-data')
    else:
        raise HTTPException(status_code=400, detail="File not exists")
