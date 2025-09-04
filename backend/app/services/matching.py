from app.db.db import get_connection
from app.services.profiles import _MINIO_PUBLIC, MINIO_BUCKET

# 投稿順に上から一覧取得
def get_matching_posts_service():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT 
            posts.id,
            posts.user_id, 
            users.username,
            profiles.avatar_url,
            posts.content,
            posts.created_at
        FROM posts
        JOIN users ON posts.user_id = users.id
        LEFT JOIN profiles ON users.id = profiles.user_id
        ORDER BY posts.created_at DESC
    """)
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return [
        {
            "id": row[0],
            "user_id" :row[1],
            "username": row[2],
            "avatar_url": f"{_MINIO_PUBLIC}/{MINIO_BUCKET}/{row[3].lstrip('/')}" if row[3] else None,
            "content": row[4],
            "created_at": row[5]
        }
        for row in rows
    ]
