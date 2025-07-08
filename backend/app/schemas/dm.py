#schemas/dm.py
from pydantic import BaseModel
from typing import List,Optional, Literal
class MessageOut(BaseModel):
    id: int
    sender: Literal["me", "partner"]  # または str でも可（型チェック時に安心）
    content: str
    class Config:
        from_attributes = True

class DmUser(BaseModel):
    id: int
    name: str
    lastMessage: str
    avatarUrl: Optional[str] = None
