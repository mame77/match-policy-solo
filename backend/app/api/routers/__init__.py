#routerを集約している
from fastapi import APIRouter
from app.api.routers.posts import router as posts_router
from app.api.routers.auth import router as auth_router
from app.api.routers.matching import router as matching_router
from app.api.routers.dm import router as dm_router
from app.api.routers.profiles import router as profiles_router

#routerの登録
router = APIRouter()
router.include_router(posts_router, prefix="/posts")
router.include_router(auth_router, prefix="/auth")
router.include_router(matching_router, prefix="/api")
router.include_router(dm_router, prefix="/dm")
router.include_router(profiles_router, prefix="/api/profiles")
