from fastapi import FastAPI
from app.api.routers import auth
from starlette.middleware.cors import CORSMiddleware
app = FastAPI()
app.include_router(auth.router)

# main.py

from app.db.base import Base, engine
from app.models import user  # ← 必ず import しておく

Base.metadata.create_all(bind=engine)  # ← 起動時に1回だけ実行




# CORSを回避するために追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,   # 追記により追加
    allow_methods=["*"],      # 追記により追加
    allow_headers=["*"]       # 追記により追加
)

