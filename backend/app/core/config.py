#環境設定ファイル
from pydantic_settings import BaseSettings
#DBを紐付ける
class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:mysecretpassword@localhost:5432/mydatabase"

settings = Settings()
