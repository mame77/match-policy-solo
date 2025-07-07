# app/api/routers/dm.py
from app.schemas.dm import DmUser, MessageOut  # ✅ 追加
from fastapi import APIRouter,Path, Body, Depends
from typing import List
from app.db.db import get_connection

router = APIRouter()

@router.get("/users", response_model=List[DmUser])
def get_dm_users():
    user_id = 1  # 仮のログインユーザー（あとでJWTと連携予定）

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

    cursor.execute(query, (user_id, user_id, user_id))
    rows = cursor.fetchall()

    conn.close()

    return [
        DmUser(
            id=row[0],
            name=row[1],
            avatarUrl=row[2],
            lastMessage=row[3] or ""
        )
        for row in rows
    ]

@router.get("/messages/{user_id}", response_model=list[MessageOut])
def get_messages(user_id: int = Path(...)):
    current_user_id = 1  # ← 仮のログインユーザー

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

    result = []
    for row in rows:
        sender_id = row[1]
        sender = "me" if sender_id == current_user_id else "partner"
        result.append(
            MessageOut(
                id=row[0],
                sender=sender,
                content=row[3]
            )
        )
    return result
