from pydantic import BaseModel

class PostCreate(BaseModel):
    content: str

class PostResponse(BaseModel):
    id: int
    username: str
    content: str

    class Config:
         from_attributes = True
