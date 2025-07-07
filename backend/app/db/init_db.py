# app/db/init_db.py
from app.db.db import get_connection

def init_db():
    conn = get_connection()
    cur = conn.cursor()

    with open("app/db/sql/schema.sql", "r") as f:
        cur.execute(f.read())

    conn.commit()
    cur.close()
    conn.close()

