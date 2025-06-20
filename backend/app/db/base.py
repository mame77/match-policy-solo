from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# PostgreSQL の接続URL
# ユーザー名・パスワード・DB名などは適宜変更してください
DATABASE_URL = "postgresql://postgres:mysecretpassword@localhost:5432/mydatabase"

# エンジン作成（PostgreSQLなので connect_args は不要）
engine = create_engine(DATABASE_URL)

# セッションローカルクラス（DB操作用）
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# モデル用の基底クラス
Base = declarative_base()
