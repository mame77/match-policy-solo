from fastapi import APIRouter
from typing import List
from app.schemas.post import Post

router = APIRouter()

@router.get("/api/matching", response_model=List[Post])
def get_posts():
    # 仮データを返す（DB接続なし）
    return [
        {"id": 1, "username": "さくら", "content": "こんにちは！"},
        {"id": 2, "username": "たけし", "content": "よろしく！"}
    ]