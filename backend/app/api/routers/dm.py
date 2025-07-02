from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.schemas.dm import DmUser, MessageOut
from typing import List

router = APIRouter()

# ダミーDM一覧を返す（リストページ用）
@router.get("/users", response_model=List[DmUser])
def get_dm_users():
    return [
        DmUser(id=1, name="さくら", lastMessage="こんにちは！", avatarUrl="/avatar1.jpg"),
        DmUser(id=2, name="たけし", lastMessage="またね！", avatarUrl="/avatar2.jpg"),
    ]

# ダミーメッセージ履歴を返す（チャット画面用）
@router.get("/messages/{user_id}", response_model=List[MessageOut])
def get_messages(user_id: int):
    return [
        MessageOut(id=1, sender="partner", content="こんにちは！"),
        MessageOut(id=2, sender="me", content="やっほー！元気？"),
        MessageOut(id=3, sender="partner", content="最近どう？"),
    ]
