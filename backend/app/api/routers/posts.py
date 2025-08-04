# app/api/routers/posts.py

from fastapi import APIRouter, Depends
from typing import List
from app.schemas.post import PostCreate, PostResponseWithUsername
from app.schemas.user import User
from app.api.deps import get_current_user
from app.services.posts import create_post_service, get_posts_by_user_id


router = APIRouter()

@router.post("/posts", response_model=PostResponseWithUsername)
def create_new_post_sql(
    post: PostCreate,
    current_user: User = Depends(get_current_user)
):
    return create_post_service(post, current_user)

@router.get("/posts/me", response_model=List[PostResponseWithUsername])
def read_my_posts(
    current_user: User = Depends(get_current_user)
):
    """
    現在のログインユーザーの投稿をすべて取得します。
    新しい順にソートされます。
    """
    return get_posts_by_user_id(current_user.id)