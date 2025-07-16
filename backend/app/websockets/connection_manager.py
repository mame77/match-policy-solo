from fastapi import WebSocket
from typing import Dict, List

class ConnectionManager:
    def __init__(self):
        # 接続中のユーザーIDとWebSocketオブジェクトのマッピング
        self.active_connections: Dict[int, List[WebSocket]] = {}

    # クライアント接続時,記録
    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        print(f"✅ User {user_id} connected. Total: {len(self.active_connections[user_id])}")
    
    # クライアント切断時,記録削除
    def disconnect(self, user_id: int, websocket: WebSocket):
        self.active_connections[user_id].remove(websocket)
        if not self.active_connections[user_id]:
            del self.active_connections[user_id]
        print(f"❌ User {user_id} disconnected.")

    # ユーザーが接続中,メッセージ送信
    async def send_personal_message(self, user_id: int, message: dict):
        if user_id in self.active_connections:
            for ws in self.active_connections[user_id]:
                await ws.send_json(message)
                print(f"📨 Sent to {user_id}: {message}")

manager = ConnectionManager()
