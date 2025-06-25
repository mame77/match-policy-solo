from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
# PostgreSQL の接続URL
# ユーザー名・パスワード・DB名などは適宜変更してください

load_dotenv()
DATABASE_URL =os.getenv("DATABASE_URL")

# エンジン作成（PostgreSQLなので connect_args は不要）
engine = create_engine(DATABASE_URL)

# セッションローカルクラス（DB操作用）
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# モデル用の基底クラス
Base = declarative_base()
