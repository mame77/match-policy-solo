# 例: app/db/init_db.py
from app.db.session import engine
from app.db.models.user import User
from app.db.base import Base
from app.models.post import Post  # ← これを追加！
def init_db():
    Base.metadata.create_all(bind=engine)
