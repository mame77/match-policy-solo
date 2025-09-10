from pydantic import BaseModel

class UploadUrlResponse(BaseModel):
    uploadUrl: str
    objectKey: str

class ProfileCreate(BaseModel):
    objectKey: str
    bio: str

class ProfileResponse(BaseModel):
    user_id: int
    username:   str
    avatar_url: str
    bio: str

    model_config = {
        "from_attributes": True
    }
