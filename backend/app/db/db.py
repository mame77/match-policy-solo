
# app/db/db.py
import os
# import psycopg2
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    # return psycopg2.connect(os.getenv("DATABASE_URL"))
    # Temporary mock for dependency resolution
    class MockConnection:
        def cursor(self):
            return MockCursor()
        def commit(self):
            pass
        def close(self):
            pass

    class MockCursor:
        def execute(self, query, params=None):
            pass
        def fetchone(self):
            return None
        def fetchall(self):
            return []
        def close(self):
            pass

    return MockConnection()
