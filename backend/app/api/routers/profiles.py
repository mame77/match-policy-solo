#新規プロフィール作成(setup)
from fastapi import APIRouter, Form, File, UploadFile

router = APIRouter()

@router.post("/profiles/setup")
async def setup_profile(
    name: str = Form(...),
    age: int = Form(...),
    bio: str = Form(...),
    image: UploadFile = File(...)
):
    return {"message": "受け取り成功"}