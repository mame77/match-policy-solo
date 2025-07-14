
from fastapi import HTTPException
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.core.security import hash_password, verify_password, create_access_token
from app.db.db import get_connection

# サインアップ
def register_user_service(payload: RegisterRequest) -> TokenResponse:
    conn = get_connection()
    cur = conn.cursor()

    # ユーザー名の重複チェック
    cur.execute("""
                SELECT id FROM users
                WHERE username = %s
                """,
                (payload.username,))

    if cur.fetchone():
        cur.close()
        conn.close()
        raise HTTPException(status_code=400, detail="ユーザーネームはすでに使用されています")

    # パスワードをハッシュ化
    hashed_pw = hash_password(payload.password)

    # ユーザー作成
    cur.execute(
        """
        INSERT INTO users (username, hashed_password)
        VALUES (%s, %s)
        RETURNING id, username
        """,
        (payload.username, hashed_pw)
    )
    new_user = cur.fetchone()

    conn.commit()
    cur.close()
    conn.close()

    # トークン作成
    token = create_access_token(data={"sub": str(new_user[0])})
    return TokenResponse(access_token=token, token_type="bearer")


# ログイン
def login_user_service(payload: LoginRequest) -> TokenResponse:
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
                SELECT id, username, hashed_password
                FROM users
                WHERE username = %s
                """,
                (payload.username,))
    user = cur.fetchone()

    cur.close()
    conn.close()

    if not user or not verify_password(payload.password, user[2]):
        raise HTTPException(status_code=401, detail="ユーザー名またはパスワードが間違っています")

    user_id = user[0]
    token = create_access_token(data={"sub": str(user_id)})
    return TokenResponse(access_token=token, token_type="bearer")
