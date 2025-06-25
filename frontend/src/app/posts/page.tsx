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
    // 🧪 ダミーデータをここに直接書く
    const dummyData: Post[] = [
      { id: 1, username: "sakura", content: "こんにちは！" },
      { id: 2, username: "takeshi", content: "はじめまして！" },
    ];

    setTimeout(() => {
      setPosts(dummyData);
      setLoading(false);
    }, 500); // 疑似遅延でリアルっぽく
  }, []);

  if (loading) return <p>読み込み中...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", fontSize: "24px", marginBottom: "20px" }}>投稿一覧 / マッチング</h1>
      {posts.map((post) => (
        <Link href={`/profile/${post.username}`} key={post.id}>
          <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            <h2>{post.username}</h2>
            <p>{post.content}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
