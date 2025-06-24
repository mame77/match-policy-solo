# app/dependencies/auth.py など

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.schemas.user import User
from app.core.security import ALGORITHM
import os
#クライアントから送られたJWTを検証する


#ヘッダーからtokenを自動抽出
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

#ユーザー情報を取得していく
def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    try:
        #デーコード
        secret_key = os.getenv("SECRET_KEY")
        payload = jwt.decode(token, secret_key, algorithms=[ALGORITHM])
        username: str = payload.get("sub")

        #デーコード後の処理
        if username is None:
            raise HTTPException(status_code=401, detail="認証情報が無効です")
        return User(username=username)
    except JWTError:
        raise HTTPException(status_code=401, detail="認証情報が無効です")

