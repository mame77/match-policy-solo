
# app/api/routers/profile.py
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
from app.services.profiles import upload_profile_image_and_bio

router = APIRouter()

@router.post("/profiles")
async def setup_profile(
    bio: str = Form(...),
    user_id: str = Form(...),
    avatar: UploadFile = File(...)
):
    result = await upload_profile_image_and_bio(user_id, bio, avatar)
    return JSONResponse(content=result)
