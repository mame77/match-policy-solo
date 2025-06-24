from sqlalchemy import Column, Integer, String
from app.db.base import Base
#posts テーブルの設計
class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    content = Column(String)



#modelsが二つあるから一つ消さないといけない
#また今度しよう