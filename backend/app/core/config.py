from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    DATABASE_URL: str = Field(..., env="DATABASE_URL")

    # MinIO
    MINIO_ENDPOINT: str = Field(..., env="MINIO_ENDPOINT")
    MINIO_ROOT_USER: str = Field(..., env="MINIO_ROOT_USER")
    MINIO_ROOT_PASSWORD: str = Field(..., env="MINIO_ROOT_PASSWORD")
    MINIO_SECURE: bool = Field(False, env="MINIO_SECURE")
    BUCKET_NAME: str = Field("profiles", env="BUCKET_NAME")

    # JWT 設定
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    ALGORITHM: str = Field("HS256", env="ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(1440, env="ACCESS_TOKEN_EXPIRE_MINUTES")

    class Config:
        env_file = ".env"

settings = Settings()
