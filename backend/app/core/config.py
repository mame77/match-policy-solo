from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:mysecretpassword@localhost:5432/mydatabase"

settings = Settings()
