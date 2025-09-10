CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  hashed_password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS profiles (
    user_id INTEGER PRIMARY KEY NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- DMメッセージテーブル
CREATE TABLE IF NOT EXISTS dms (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE posts (
  id          SERIAL PRIMARY KEY,
  user_id     INT NOT NULL
               REFERENCES users(id)
               ON DELETE CASCADE,
  content     TEXT    NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
