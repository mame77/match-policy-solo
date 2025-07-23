
from fastapi import APIRouter
from app.services.matching import get_matching_posts_service

router = APIRouter()

#投稿一覧の取得
@router.get("/api/matching")
def get_matching_posts():
    return get_matching_posts_service()
