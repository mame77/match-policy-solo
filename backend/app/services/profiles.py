import os
from fastapi import HTTPException
from datetime import timedelta
from minio import Minio
from minio.error import S3Error

from app.schemas.profile import ProfileCreate, ProfileResponse, UploadUrlResponse
from app.db.db import get_connection


def _parse_minio_endpoint(raw: str):
    """
    raw: e.g. 'http://localhost:9000' or 'localhost:9000'
    returns (endpoint_without_scheme, secure: bool, public_endpoint: str)
    """
    if raw.startswith("https://"):
        return raw[len("https://"):], True, raw.rstrip('/')
    if raw.startswith("http://"):
        return raw[len("http://"):], False, raw.rstrip('/')
    # no scheme
    return raw, False, f"http://{raw.rstrip('/')}"


# 環境変数キー
MINIO_RAW_ENDPOINT = os.getenv("MINIO_ENDPOINT", "http://localhost:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY")
MINIO_BUCKET = os.getenv("MINIO_BUCKET", "profiles")

# 解析
_MINIO_ENDPOINT, _MINIO_SECURE, _MINIO_PUBLIC = _parse_minio_endpoint(MINIO_RAW_ENDPOINT)


def get_upload_url(
    key: str,
    current_user_id: int,
) -> UploadUrlResponse:
    """
    MinIO への PUT 用プリサインドURLを発行 (有効期限15分)。
    """
    client = Minio(
        endpoint=_MINIO_ENDPOINT,
        access_key=MINIO_ACCESS_KEY,
        secret_key=MINIO_SECRET_KEY,
        secure=_MINIO_SECURE,
    )
    bucket = MINIO_BUCKET

    try:
        if not client.bucket_exists(bucket):
            client.make_bucket(bucket)
    except S3Error as e:
        raise RuntimeError(f"MinIO バケットエラー: {e}")

    try:
        url = client.presigned_put_object(bucket, key, expires=timedelta(minutes=15))
    except S3Error as e:
        raise RuntimeError(f"Presign URL 発行エラー: {e}")

    return UploadUrlResponse(uploadUrl=url, objectKey=key)


def setup_profile(
    payload: ProfileCreate,
    current_user_id: int,
) -> ProfileResponse:
    """
    objectKey と bio を profiles テーブルに保存。
    UPSERT (ON CONFLICT) と users テーブルから username 取得。
    """
    conn = get_connection()
    cursor = conn.cursor()

    upsert_sql = """
        INSERT INTO profiles (user_id, avatar_url, bio)
        VALUES (%s, %s, %s)
        ON CONFLICT (user_id) DO UPDATE
          SET avatar_url = EXCLUDED.avatar_url,
              bio        = EXCLUDED.bio
        RETURNING user_id, avatar_url, bio;
    """
    cursor.execute(upsert_sql, (current_user_id, payload.objectKey, payload.bio))
    user_id, avatar_key, bio = cursor.fetchone()

    cursor.execute("SELECT username FROM users WHERE id = %s", (current_user_id,))
    row = cursor.fetchone()
    username = row[0] if row else None

    conn.commit()
    conn.close()

    return ProfileResponse(
        user_id=user_id,
        username=username,
        avatar_url=avatar_key,
        bio=bio,
    )


def read_my_profile(
    current_user_id: int,
) -> ProfileResponse:
    """
    self-profile SELECT と公開用 URL 組み立て。
    """
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT avatar_url, bio FROM profiles WHERE user_id = %s",
        (current_user_id,)
    )
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise RuntimeError("プロフィールが存在しません")
    avatar_key, bio = row

    cursor.execute("SELECT username FROM users WHERE id = %s", (current_user_id,))
    row2 = cursor.fetchone()
    username = row2[0] if row2 else None

    conn.close()

    # 公開用 URL
    full_url = f"{_MINIO_PUBLIC}/{MINIO_BUCKET}/{avatar_key.lstrip('/')}"

    return ProfileResponse(
        user_id=current_user_id,
        username=username,
        avatar_url=full_url,
        bio=bio,
    )

def read_profile_by_username(username: str) -> ProfileResponse:
    """
    username からプロフィールを取得。
    なければ HTTP 404 を投げる。
    """
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT u.id AS user_id, u.username, p.avatar_url, p.bio
          FROM users u
          INNER JOIN profiles p ON p.user_id = u.id
         WHERE u.username = %s
        """,
        (username,),
    )
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="プロフィールが存在しません")

    user_id, uname, avatar_key, bio = row
    full_url = f"{_MINIO_PUBLIC}/{MINIO_BUCKET}/{avatar_key.lstrip('/')}" if avatar_key else None

    return ProfileResponse(
        user_id=user_id,
        username=uname,
        avatar_url=full_url,
        bio=bio,
    )