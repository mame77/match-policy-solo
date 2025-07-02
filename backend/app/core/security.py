#認証系のロジック
import bcrypt
from datetime import datetime, timedelta
from jose import jwt
import os
from dotenv import load_dotenv

# パスワードのハッシュ化
def hash_password(plain_password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(plain_password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

# JWT トークン生成
load_dotenv()


#.envからそれぞれを引き出している 
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

#JWTトークンを作成している
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()

#subがなかったらusernameをsubにする
    if "sub" not in to_encode and "username" in to_encode:
        to_encode["sub"] = to_encode["username"]

#有効期限をexpに追加
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# パスワードの検証（ログイン時に使う）
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
