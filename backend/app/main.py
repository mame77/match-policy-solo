from fastapi import FastAPI
from app.api.routers import auth
from app.api.routers import posts
from starlette.middleware.cors import CORSMiddleware
from app.db.base import Base, engine
from app.models import user
from dotenv import load_dotenv
from app.api.routers import router

app = FastAPI()
app.include_router(auth.router)
app.include_router(posts.router, prefix="/api")

load_dotenv()
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)