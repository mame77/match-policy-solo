from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from app.api.routers import auth,posts,ws,profiles,matching,dm
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(auth.router)
app.include_router(ws.ws_router)
app.include_router(dm.router)
app.include_router(posts.router)
app.include_router(matching.router)
app.include_router(profiles.router)

#ミドルウェア
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
