from app.db.db import get_connection
from app.schemas.dm import DmUser, MessageOut
from app.services.ws import manager  # ✅ 追加

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
    cursor.execute(query, (current_user_id, current_user_id, current_user_id))
    rows = cursor.fetchall()
    conn.close()
    return [
        DmUser(id=row[0], name=row[1], avatarUrl=row[2], lastMessage=row[3] or "")
        for row in rows
    ]

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

def store_message(current_user_id: int, user_id: int, body: dict):
    content = body.get("content")
    if not content:
        return {"error": "content is required"}
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO dms (sender_id, receiver_id, content)
        VALUES (%s, %s, %s);
        """,
        (current_user_id, user_id, content)
    )
    conn.commit()
    conn.close()

    try:
        asyncio.create_task(manager.send_personal_message(content, user_id))
    except Exception as e:
        print("WebSocket送信エラー:", e)


    return {"status": "ok"}

