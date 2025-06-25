#api関わる共通作業
from sqlalchemy.orm import Session
from app.db.session import SessionLocal

#dbを接続して自動で閉じる
def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()