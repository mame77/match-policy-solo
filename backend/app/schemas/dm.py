#schemas/dm.py
from pydantic import BaseModel
from typing import List

class MessageOut(BaseModel):
    id: int
    sender: str
    content: str

    class Config:
        from_attributes = True

class DmUser(BaseModel):
    id: int
    name: str
    lastMessage: str
    avatarUrl: str
