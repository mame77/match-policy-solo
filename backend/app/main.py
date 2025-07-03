from fastapi import FastAPI
from app.api.routers import auth
from app.api.routers import posts
from starlette.middleware.cors import CORSMiddleware
from app.db.base import Base, engine
from app.db.models import user
from dotenv import load_dotenv
from app.api.routers import matching
from app.api.routers import router,dm

app = FastAPI()
app.include_router(auth.router)
app.include_router(posts.router, prefix="/api")
app.include_router(matching.router)
app.include_router(router, prefix="/api")

import os
load_dotenv()
os.getenv("DATABASE_URL")

#ミドルウェア
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
