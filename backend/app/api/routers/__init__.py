from fastapi import APIRouter
from app.api.routers.posts import router as posts_router
from app.api.routers.auth import router as auth_router

router = APIRouter()
router.include_router(posts_router, prefix="/posts")
router.include_router(auth_router, prefix="/auth")
