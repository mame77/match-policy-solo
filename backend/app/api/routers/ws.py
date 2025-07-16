# api/routers/ws.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.websockets.connection_manager import manager
ws_router = APIRouter()

#dm用websocket接続用エンドポイント
@ws_router.websocket("/ws/dm/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await manager.connect(user_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(user_id,websocket)
