from dotenv import load_dotenv
import os

load_dotenv()
DB_HOST = os.environ.get("DB_HOST")
DB_PORT = os.environ.get("DB_PORT")
DB_NAME = os.environ.get("DB_NAME")
DB_USER = os.environ.get("DB_USER")
DB_PASS = os.environ.get("DB_PASS")

SECRET_AUTH_KEY = os.environ.get("SECRET_AUTH_KEY")
ALGORITHM = os.environ.get("ALGORITHM")

ACCESS_TOKEN_EXPIRE_MINUTES = 30

ADMIN_ROLE_ID = 1
MODER_ROLE_ID = 2
USER_ROLE_ID = 3

AVAILABLE_IMAGE_CONTENT_TYPES = ["image/jpeg", "image/png"]

FILES_PATH = "C:/Users/dokwe/OneDrive/Рабочий стол/Лабы/СУБД/Курсач/Files/"

