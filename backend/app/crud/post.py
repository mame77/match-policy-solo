from sqlalchemy.orm import Session
from app.db.models import Post

def create_post(db: Session, content: str, username: str):
    db_post = Post(content=content, username=username)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post