
from fastapi import APIRouter, HTTPException
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.core.security import hash_password, verify_password, create_access_token
from app.db.db import get_connection

router = APIRouter()

# サインアップ
@router.post("/auth/signup", response_model=TokenResponse)
async def register_user(payload: RegisterRequest):
    conn = get_connection()
    cur = conn.cursor()

    # ユーザー名の重複チェック
    cur.execute("SELECT id FROM users WHERE username = %s", (payload.username,))
    if cur.fetchone():
        cur.close()
        conn.close()
        raise HTTPException(status_code=400, detail="ユーザー名は既に使用されています")

    # ユーザー作成
    hashed_pw = hash_password(payload.password)
    cur.execute(
        "INSERT INTO users (username, hashed_password) VALUES (%s, %s) RETURNING id, username",
        (payload.username, hashed_pw)
    )
    new_user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    token = create_access_token(data={"sub": new_user[1]})
    return {"access_token": token, "token_type": "bearer"}


# ログイン
@router.post("/auth/login", response_model=TokenResponse)
async def login_user(payload: LoginRequest):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT username, hashed_password FROM users WHERE username = %s", (payload.username,))
    user = cur.fetchone()
    cur.close()
    conn.close()

    if not user or not verify_password(payload.password, user[1]):
        raise HTTPException(status_code=401, detail="ユーザー名またはパスワードが間違っています")

    token = create_access_token(data={"sub": user[0]})
    return {"access_token": token, "token_type": "bearer"}
