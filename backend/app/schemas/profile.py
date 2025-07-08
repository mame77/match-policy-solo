from pydantic import BaseModel

class UploadUrlResponse(BaseModel):
    uploadUrl: str
    objectKey: str

class ProfileCreate(BaseModel):
    objectKey: str
    bio: str

class ProfileResponse(BaseModel):
    id: int
    user_id: int
    avatar_url: str
    bio: str

    model_config = {
        "from_attributes": True
    }
