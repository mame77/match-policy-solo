# api/routers/ws.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.deps.auth import get_current_user_id
from app.services.ws import manager
ws_router = APIRouter()

@ws_router.websocket("/ws/dm/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await manager.connect(user_id, websocket)
    try:
        while True:
            await websocket.receive_text()  # ← 一応保持
    except WebSocketDisconnect:
        manager.disconnect(user_id)
