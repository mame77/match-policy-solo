from sqlalchemy import Column, Integer, String, DateTime
from app.db.base import Base
from sqlalchemy.sql import func
#posts テーブルの設計
class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    content = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

