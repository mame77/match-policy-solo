from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.base import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True, nullable=False)
    bio = Column(String)
    image_url = Column(String)
