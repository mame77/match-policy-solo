"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {

  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const token = localStorage.getItem("access_token");
console.log("🔥 token = ", token);

if (!token) {
  setError("ログイン情報がありません");
  return;
}


  try {
    const res = await fetch("http://localhost:8000/api/posts", {
  method: "POST",
  headers: {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`  // ← ここでnullなら無効
},

  body: JSON.stringify({ content }),
});


console.log("status:", res.status);
console.log("res text:", await res.text());


    if (res.ok) {
      router.push("/posts");
    } else {
      setError("投稿に失敗しました");
    }
  } catch {
    setError("サーバーエラーが発生しました");
  }
};

  return (
    <div
      style={{
        // 【変更】スマホ向けに左右のpaddingを調整し、画面端のスペースを確保
        padding: "2rem 1rem",
        maxWidth: "600px",
        margin: "auto",
        // 【追加】paddingがwidthに含まれるようにし、レイアウト崩れを防ぐ
        boxSizing: "border-box",
      }}
    >
      {/* 【追加】見出しを中央に配置し、下に余白を追加してバランスを調整 */}
      <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}>
        新規投稿
      </h2>

      {/* 【変更】エラーメッセージの視認性を向上 */}
      {error && (
        <p
          style={{
            color: "#D32F2F", // 少し落ち着いた赤色に変更
            backgroundColor: "#FFEBEE", // 薄い赤の背景色を追加
            padding: "1rem", // 内側の余白を追加
            borderRadius: "8px", // 角を丸くして柔らかい印象に
            textAlign: "center",
            marginBottom: "1rem", // 下のフォームとの余白
          }}
        >
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        
        {/* 【変更】要素間の余白を少し広げて見やすく */}
        <div style={{ marginTop: "1.5rem" }}>
          {/* 【追加】ラベルを見やすくするためにスタイルを調整 */}
          <label style={{ fontWeight: "bold", color: "#555" }}>本文</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            // 【変更】入力エリアを少し広げる
            rows={8}
            style={{
              width: "100%",
              // 【変更】タップしやすいようにpaddingを大きくする
              padding: "0.8rem",
              marginTop: "0.5rem",
              // 【追加】読みやすいフォントサイズを指定
              fontSize: "1rem",
              // 【追加】入力欄の境界を明確にする
              border: "1px solid #ccc",
              // 【追加】角を少し丸くする
              borderRadius: "4px",
              // 【追加】paddingを含んだ幅計算にする
              boxSizing: "border-box",
              // 【追加】リサイズを縦方向のみに許可
              resize: "vertical",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            // 【変更】ボタンを目立たせ、押しやすくする
            marginTop: "2rem", // 上の要素との余白を広げる
            width: "100%", // 横幅いっぱいに広げる
            padding: "1rem", // 内側の余白を大きくする
            fontSize: "1rem", // フォントサイズを調整
            fontWeight: "bold", // 文字を太くする
            color: "white", // 文字色を白に
            backgroundColor: "#007AFF", // 背景色をiOS風の青に
            border: "none", // 枠線をなくす
            borderRadius: "8px", // 角を丸くする
            cursor: "pointer", // PCでの操作時にカーソルをポインターに
          }}
        >
          投稿する
        </button>
      </form>
    </div>
  );
}