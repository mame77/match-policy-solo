# app/api/routers/profile.py
from fastapi import APIRouter, Depends, Query, HTTPException
from typing import List

from app.schemas.profile import ProfileCreate, ProfileResponse, UploadUrlResponse
from app.services.profiles import get_upload_url, setup_profile, read_my_profile, read_profile_by_username
from app.api.deps import get_current_user_id

router = APIRouter()


# プリサインド URL 発行
@router.get(
    "/profiles/upload-url",
    response_model=UploadUrlResponse,
)
async def upload_url(
    key: str = Query(..., description="保存先オブジェクトキー (例: avatars/uuid.jpg)"),
    current_user_id: int = Depends(get_current_user_id),
) -> UploadUrlResponse:
    return get_upload_url(key, current_user_id)


# プロフィール作成／更新
@router.post(
    "/profiles/setup",
    response_model=ProfileResponse,
)
def setup(
    payload: ProfileCreate,
    current_user_id: int = Depends(get_current_user_id),
) -> ProfileResponse:
    return setup_profile(payload, current_user_id)


# 自分のプロフィール取得
@router.get(
    "/profiles/me",
    response_model=ProfileResponse,
)
def read_me(
    current_user_id: int = Depends(get_current_user_id),
) -> ProfileResponse:
    return read_my_profile(current_user_id)

# 相手のプロフィール取得
@router.get("/profiles/{username}", response_model=ProfileResponse)
def read_by_username(username: str) -> ProfileResponse:
    return read_profile_by_username(username)