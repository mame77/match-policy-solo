from pydantic import BaseModel
from datetime import datetime


class PostCreate(BaseModel):
    content: str

class PostResponse(BaseModel):
    id: int
    username: str
    content: str
    created_at: datetime
