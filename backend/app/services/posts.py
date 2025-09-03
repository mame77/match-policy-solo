from app.db.db import get_connection
from app.schemas.post import PostCreate, PostResponseWithUsername
from app.schemas.user import User
from fastapi import HTTPException
from typing import List

def create_post_service(post: PostCreate, current_user: User) -> PostResponseWithUsername:
    if not post.content.strip():
        raise HTTPException(status_code=400, detail="投稿内容を入力してください")

    conn = get_connection()
    cur = conn.cursor()

    # 投稿を作成して id を取得
    cur.execute(
        """
        INSERT INTO posts (content, user_id)
        VALUES (%s, %s)
        RETURNING id
        """,
        (post.content, current_user.id)
    )
    new_post_id = cur.fetchone()[0]

    # JOIN で username を含めた投稿情報を取得
    cur.execute(
        """
        SELECT posts.id, posts.content, posts.user_id, users.username, posts.created_at
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE posts.id = %s
        """,
        (new_post_id,)
    )
    new_post = cur.fetchone()

    conn.commit()
    cur.close()
    conn.close()

    return PostResponseWithUsername(
        id=new_post[0],
        content=new_post[1],
        user_id=new_post[2],
        username=new_post[3],
        created_at=new_post[4]
    )


def get_posts_by_user_id(user_id: int):
    """
    指定された user_id の全ての投稿を、作成日時の新しい順に取得します。
    """
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT posts.id, posts.content, posts.user_id, users.username, posts.created_at
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE posts.user_id = %s
        ORDER BY posts.created_at DESC
        """,
        (user_id,)
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    # PostResponseWithUsername の形式に合わせて辞書に変換
    return [
        {
            "id": row[0],
            "content": row[1],
            "user_id": row[2],
            "username": row[3],
            "created_at": row[4]
        }
        for row in rows
    ]

def read_posts_by_username(username: str) -> List[PostResponseWithUsername]:
    conn = get_connection()
    cur = conn.cursor()

    # username -> user_id を解決
    cur.execute("SELECT id FROM users WHERE username = %s", (username,))
    row = cur.fetchone()
    if not row:
        cur.close(); conn.close()
        raise HTTPException(status_code=404, detail="ユーザーが存在しません")
    user_id = row[0]

    # 投稿を取得 (JOIN して username も含める)
    cur.execute(
        """
        SELECT p.id, p.content, p.user_id, u.username, p.created_at
        FROM posts p
        JOIN users u ON u.id = p.user_id
        WHERE p.user_id = %s
        ORDER BY p.created_at DESC
        """,
        (user_id,),
    )
    rows = cur.fetchall()
    cur.close(); conn.close()

    if not rows:
        raise HTTPException(status_code=404, detail="投稿が存在しません")

    return [
        PostResponseWithUsername(
            id=r[0],
            content=r[1],
            user_id=r[2],
            username=r[3],
            created_at=r[4],
        )
        for r in rows
    ]