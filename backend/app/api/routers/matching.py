
from fastapi import APIRouter
from app.services.matching import get_matching_posts_service

router = APIRouter()

@router.get("/api/matching")
def get_matching_posts():
    return get_matching_posts_service()
