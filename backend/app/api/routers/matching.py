#matching(投稿一覧)
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.db.models import Post

router = APIRouter()

@router.get("/api/matching")
def get_matching_posts(db: Session = Depends(get_db)):
    posts = db.query(Post).order_by(Post.created_at.desc()).all()
    return [
        {
            "id": post.id,
            "username": post.username,
            "content": post.content,
            "created_at": post.created_at
        } for post in posts
    ]
