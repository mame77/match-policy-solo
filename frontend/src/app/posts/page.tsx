"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Post = {
  id: number;
  username: string;
  content: string;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/matching")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("投稿の取得に失敗しました", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={styles.loading}>読み込み中...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>投稿一覧 / マッチング</h1>
      {posts.map((post) => (
        <Link href={`/profile/${post.username}`} key={post.id}>
          <div style={styles.card}>
            <h2 style={styles.username}>{post.username}</h2>
            <p style={styles.content}>{post.content}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    fontFamily: "'Helvetica Neue', sans-serif",
    padding: "0 16px",
  },
  title: {
    textAlign: "center",
    fontSize: "28px",
    marginBottom: "24px",
    fontWeight: 600,
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    padding: "16px",
    marginBottom: "16px",
    transition: "transform 0.2s ease",
    cursor: "pointer",
  },
  username: {
    fontSize: "20px",
    fontWeight: 500,
    marginBottom: "8px",
  },
  content: {
    fontSize: "16px",
    color: "#444",
  },
  loading: {
    textAlign: "center",
    marginTop: "100px",
    fontSize: "18px",
    color: "#666",
  },
};
