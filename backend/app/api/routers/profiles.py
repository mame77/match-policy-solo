import boto3
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
import uuid
import os

router = APIRouter()

# 環境変数から設定取得
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "http://localhost:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")
MINIO_BUCKET = os.getenv("MINIO_BUCKET", "mybucket")

# S3クライアント（MinIO用）
s3_client = boto3.client(
    "s3",
    endpoint_url=MINIO_ENDPOINT,
    aws_access_key_id=MINIO_ACCESS_KEY,
    aws_secret_access_key=MINIO_SECRET_KEY,
    region_name="us-east-1",  # 任意でOK（MinIOには影響なし）
)

@router.post("/profiles")
async def setup_profile(
    bio: str = Form(...),
    user_id: str = Form(...),
    avatar: UploadFile = File(...)
):
    contents = await avatar.read()
    ext = avatar.filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"

    # MinIOへアップロード
    s3_client.put_object(
        Bucket=MINIO_BUCKET,
        Key=f"avatars/{filename}",
        Body=contents,
        ContentType=avatar.content_type,
    )

    # 公開URLを作成（MinIOの仕様に合わせる）
    image_url = f"{MINIO_ENDPOINT}/{MINIO_BUCKET}/avatars/{filename}"

    return JSONResponse(
        content={
            "message": "アップロード成功",
            "image_url": image_url,
            "bio": bio,
            "user_id": user_id
        }
    )
