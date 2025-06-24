"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Post = {
  id: number;
  username: string;
  content: string;
};

export default function MatchingPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/posts")
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

  const handleLike = () => {
    setLiked([...liked, posts[index].id]);
    nextUser();
  };

  const handleSkip = () => {
    nextUser();
  };

  const nextUser = () => {
    if (index < posts.length - 1) {
      setIndex(index + 1);
    } else {
      alert("マッチング候補がありません！");
    }
  };

  const user = posts[index];

  if (loading || !user) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>ロード中...</div>;
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>マッチング画面</h1>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          margin: "1rem auto",
          maxWidth: 400,
        }}
      >
        <h2>{user.username}</h2>
        <p>{user.content}</p>
      </div>
      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleSkip} style={{ marginRight: "1rem" }}>
          スキップ
        </button>
        <button onClick={handleLike}>いいね</button>
      </div>
      <Link href={`/dm/${user.id}`}>メッセージする</Link>
    </div>
  );
}
