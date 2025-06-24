from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.post import PostCreate, PostResponse
from app.crud.post import create_post
from app.utils.auth import get_current_user
from app.schemas.user import User  # 認証済ユーザー型


router = APIRouter()
#new-post
@router.post("/posts", response_model=PostResponse)
def create_new_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not post.content.strip():
        #投稿内容が空かspaceの場合
        raise HTTPException(status_code=400, detail="投稿内容を入力してください")
#DBに保存
    db_post = create_post(db=db, content=post.content, username=current_user.username)
    return db_post
