"use client";

import Link from "next/link";
import { useState } from "react";

type User = {
  id: number;
  name: string;
  age: number;
  bio: string;
};

const dummyUsers: User[] = [
  { id: 1, name: "さくら", age: 22, bio: "女の子ってなんで感情ベースではなすんだろ" },
  { id: 2, name: "たくや", age: 25, bio: "議員の為に税金収めたくねー" },
  { id: 3, name: "ゆい", age: 21, bio: "右翼左翼とかしょうみどっちでもいい" },
];

export default function MatchingPage() {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<number[]>([]);

  const handleLike = () => {
    setLiked([...liked, dummyUsers[index].id]);
    nextUser();
  };

  const handleSkip = () => {
    nextUser();
  };

  const nextUser = () => {
    if (index < dummyUsers.length - 1) {
      setIndex(index + 1);
    } else {
      alert("マッチング候補がありません！");
    }
  };

  const user = dummyUsers[index];

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>マッチング画面</h1>
      <div style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem auto", maxWidth: 400 }}>
        <h2>{user.name}（{user.age}歳）</h2>
        <p>{user.bio}</p>
      </div>
      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleSkip} style={{ marginRight: "1rem" }}>スキップ</button>
        <button onClick={handleLike}>いいね</button>
        
      </div>
      <Link href={`/dm/${user.id}`}>メッセージする</Link>

    </div>
  );
}

