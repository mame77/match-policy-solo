from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.schemas.auth import RegisterRequest
from app.core.security import hash_password, create_access_token
from app.repositories.user_repository import get_user_by_username, create_user

def register_user_service(payload: RegisterRequest, db: Session) -> str:
    existing_user = get_user_by_username(db, payload.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="ユーザー名は既に存在します")

    hashed_pw = hash_password(payload.password)
    create_user(db, payload.username, hashed_pw)
    token = create_access_token(data={"sub": payload.username})
    return token
