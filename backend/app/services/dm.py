import asyncio
from app.db.db import get_connection
from app.schemas.dm import DmUser, MessageOut
from app.websockets.connection_manager import manager
from app.services.profiles import _MINIO_PUBLIC, MINIO_BUCKET

#dm一覧表示
def fetch_dm_users(current_user_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    query = """
    SELECT
        u.id,
        u.username AS name,
        p.avatar_url,
        (
            SELECT content
            FROM dms
            WHERE
                (sender_id = u.id AND receiver_id = %s)
                OR (sender_id = %s AND receiver_id = u.id)
            ORDER BY created_at DESC
            LIMIT 1
        ) AS last_message
    FROM users u
    LEFT JOIN profiles p ON u.id = p.user_id
    WHERE u.id != %s;
    """

    #各ユーザーの最新のメッセージを取得
    cursor.execute(query, (current_user_id, current_user_id, current_user_id))
    rows = cursor.fetchall()
    conn.close()
    #スキーマにマッピングして返却
    return [
        DmUser(
            id=row[0],
            name=row[1],
            avatarUrl=f"{_MINIO_PUBLIC}/{MINIO_BUCKET}/{row[2].lstrip('/')}" if row[2] else None,
            lastMessage=row[3] or ""
        )
        for row in rows
    ]

#メッセージ履歴を取得
def fetch_messages(current_user_id: int, user_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    query = """
    SELECT id, sender_id, receiver_id, content
    FROM dms
    WHERE
        (sender_id = %s AND receiver_id = %s)
        OR (sender_id = %s AND receiver_id = %s)
    ORDER BY created_at ASC;
    """
    cursor.execute(query, (current_user_id, user_id, user_id, current_user_id))
    rows = cursor.fetchall()
    conn.close()
    return [
        MessageOut(id=row[0], sender="me" if row[1] == current_user_id else "partner", content=row[3])
        for row in rows
    ]


#メッセージをDBに保存
async def store_message(current_user_id: int, user_id: int, body: dict):
    content = body.get("content")
    if not content:
        return {"error": "content is required"}

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO dms (sender_id, receiver_id, content)
        VALUES (%s, %s, %s)
        RETURNING id;
        """,
        (current_user_id, user_id, content)
    )
    message_id = cursor.fetchone()[0]
    conn.commit()
    conn.close()

    # webSocketで通知
    try:

        sender_message_data = {
            "id": str(message_id),
            "sender": "me",
            "content": content
        }
        await manager.send_personal_message(current_user_id, sender_message_data) # <-- await を追加

        receiver_message_data = {
            "id": str(message_id),
            "sender": "partner",
            "content": content
        }
        await manager.send_personal_message(user_id, receiver_message_data) # <-- await を追加

    except Exception as e:
        print("WebSocket送信エラー:", e)

    return {"status": "ok"}
