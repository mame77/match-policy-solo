
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.post import PostCreate, PostResponse
from app.schemas.user import User
from app.api.deps import get_current_user
from app.services.posts import create_post_service

router = APIRouter()

@router.post("/posts", response_model=PostResponse)
def create_new_post_sql(
    post: PostCreate,
    current_user: User = Depends(get_current_user)
):
    return create_post_service(post, current_user)
