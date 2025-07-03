from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse

router = APIRouter()

@router.post("/profiles/setup")
async def setup_profile(
    bio: str = Form(...),
    userId: str = Form(...),
    image: UploadFile = File(...)
):
    # 仮保存（画像ファイルの情報確認）
    contents = await image.read()
    print(f"受け取ったファイル名: {image.filename}")
    print(f"バイト数: {len(contents)}")
    print(f"ユーザーID: {userId}, 自己紹介: {bio}")

    return JSONResponse(
        content={"message": "受け取り成功", "filename": image.filename}
    )
