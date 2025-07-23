
from fastapi import APIRouter
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.services.auth import register_user_service, login_user_service

router = APIRouter()

# サインアップ
@router.post("/auth/signup", response_model=TokenResponse)
async def register_user(payload: RegisterRequest):
    return register_user_service(payload)

# ログイン
@router.post("/auth/login", response_model=TokenResponse)
async def login_user(payload: LoginRequest):
    return login_user_service(payload)
