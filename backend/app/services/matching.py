from app.db.db import get_connection


#投稿順に上から一覧取得
def get_matching_posts_service():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
                SELECT id, username, content, created_at
                FROM posts
                ORDER BY created_at DESC
                """)
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return [
        {
            "id": row[0],
            "username": row[1],
            "content": row[2],
            "created_at": row[3]
        }
        for row in rows
    ]

