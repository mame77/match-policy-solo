
from fastapi import HTTPException
from app.schemas.post import PostCreate, PostResponse
from app.schemas.user import User
from app.db.db import get_connection

#投稿作成処理
def create_post_service(post: PostCreate, current_user: User) -> PostResponse:
    #空は無効
    if not post.content.strip():
        raise HTTPException(status_code=400, detail="投稿内容を入力してください")

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        INSERT INTO posts (content, username)
        VALUES (%s, %s)
        RETURNING id, content, username, created_at
        """,
        (post.content, current_user.username)
    )
    new_post = cur.fetchone()

    conn.commit()
    cur.close()
    conn.close()

    #スキーマに変換して返す
    return PostResponse(
        id=new_post[0],
        content=new_post[1],
        username=new_post[2],
        created_at=new_post[3]
    )
