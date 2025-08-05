from app.db.db import get_connection
from app.services.profiles import _MINIO_PUBLIC, MINIO_BUCKET

# 投稿順に上から一覧取得
def get_matching_posts_service():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT 
            posts.id,
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
            "username": row[1],
            "avatar_url": f"{_MINIO_PUBLIC}/{MINIO_BUCKET}/{row[2].lstrip('/')}" if row[2] else None,
            "content": row[3],
            "created_at": row[4]
        }
        for row in rows
    ]
