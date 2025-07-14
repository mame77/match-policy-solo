
from fastapi import APIRouter, Depends, Path, Body
from typing import List
from app.schemas.dm import DmUser, MessageOut
from app.services.dm import (
    fetch_dm_users,
    fetch_messages,
    store_message,
)
from app.api.deps import get_current_user_id

router = APIRouter()

@router.get("/dm/users", response_model=List[DmUser])
def get_dm_users(current_user_id: int = Depends(get_current_user_id)):
    return fetch_dm_users(current_user_id)

@router.get("/dm/messages/{user_id}", response_model=List[MessageOut])
def get_messages(user_id: int = Path(...), current_user_id: int = Depends(get_current_user_id)):
    return fetch_messages(current_user_id, user_id)

@router.post("/dm/messages/{user_id}")
def send_message(user_id: int = Path(...), body: dict = Body(...), current_user_id: int = Depends(get_current_user_id)):
    return store_message(current_user_id, user_id, body)

