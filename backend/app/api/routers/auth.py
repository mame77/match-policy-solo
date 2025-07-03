#認証関連
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db #DB関連の設定
from app.db.models.user import User  #userテーブルの作成
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse #バリデーション
from app.core.security import hash_password,verify_password,create_access_token #token,パスワード関連
from app.services.auth_service import register_user_service
 
router = APIRouter()

@router.post("/auth/signup", response_model=TokenResponse)
async def register_user(payload: RegisterRequest, db: Session = Depends(get_db)):
    token = register_user_service(payload, db)
    return {
        "message": "登録成功",
        "access_token": token,
        "token_type": "bearer"
    }
#login
@router.post("/auth/login", response_model=TokenResponse)

#バリテーション
async def login_user(payload: LoginRequest, db: Session = Depends(get_db)):

    #ユーザーネームとパスワードを照合
    user = db.query(User).filter(User.username == payload.username).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="ユーザー名またはパスワードが間違っています")

    #tokenを発行
    token = create_access_token(data={"sub": user.username})


    return {
        "access_token": token,
        "token_type": "bearer"
    }
