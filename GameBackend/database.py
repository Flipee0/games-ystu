from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from config import DB_USER, DB_PASS, DB_PORT, DB_NAME, DB_HOST


DATABASE_URL = f"mssql+pyodbc://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}?driver=ODBC+Driver+18+for+SQL+Server&Encrypt=no"

engine = create_engine(DATABASE_URL)


session_maker = sessionmaker(autoflush=False, bind=engine)


def get_session():
    db: Session = session_maker()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
    finally:
        db.close()
