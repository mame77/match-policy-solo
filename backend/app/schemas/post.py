from pydantic import BaseModel
from datetime import datetime


class PostCreate(BaseModel):
    content: str

class PostResponseWithUsername(BaseModel):
    id: int
    content: str
    user_id: int
    username: str
    created_at: datetime
