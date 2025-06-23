"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // エラーをリセット

    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
  const data = await res.json();  // トークンを受け取る
  console.log("🎫 トークン:", data.access_token);
  localStorage.setItem("access_token", data.access_token);  // 🔑 保存！
  router.push("/matching");
}else {
        setError("ログインに失敗しました");
      }
    } catch (err) {
      console.error("ログイン中にエラー発生:", err);   
      setError("サーバーエラーが発生しました");
    }
  };

  return (
    // 【追加】フォーム全体をスマホ画面で見やすくするための中央寄せと余白設定
    <div
      style={{
        padding: "2rem 1rem",
        maxWidth: "600px",
        margin: "auto",
        boxSizing: "border-box",
      }}
    >
      {/* 【変更】見出しを中央に配置し、下に余白を追加してバランスを調整 */}
      <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}>
        ログイン
      </h2>

      {/* 【変更】エラーメッセージの視認性を向上 */}
      {error && (
        <p
          style={{
            color: "#D32F2F",
            backgroundColor: "#FFEBEE",
            padding: "1rem",
            borderRadius: "8px",
            textAlign: "center",
            marginBottom: "1rem",
          }}
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          {/* 【追加】ラベルを見やすくするためにスタイルを調整 */}
          <label htmlFor="username" style={{ fontWeight: "bold", color: "#555" }}>
            ユーザー名
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            // 【追加】スマホで入力しやすいようにスタイルを統一
            style={{
              width: "100%",
              padding: "0.8rem",
              marginTop: "0.5rem",
              fontSize: "1rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* 【追加】要素間の余白を調整 */}
        <div style={{ marginTop: "1.5rem" }}>
          {/* 【追加】ラベルを見やすくするためにスタイルを調整 */}
          <label htmlFor="password" style={{ fontWeight: "bold", color: "#555" }}>
            パスワード
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // 【追加】スマホで入力しやすいようにスタイルを統一
            style={{
              width: "100%",
              padding: "0.8rem",
              marginTop: "0.5rem",
              fontSize: "1rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* 【変更】ボタンを目立たせ、押しやすくする */}
        <button
          type="submit"
          style={{
            marginTop: "2rem",
            width: "100%",
            padding: "1rem",
            fontSize: "1rem",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "#007AFF",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          ログイン
        </button>
      </form>

      {/* 【変更】下部の案内リンクを整理 */}
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <p style={{ color: "#555", marginBottom: '1.5rem' }}>
          アカウントがありませんか？{" "}
          <Link href="/signup" style={{ color: "#007AFF", fontWeight: "bold" }}>
            サインアップ
          </Link>
        </p>
        <p style={{ color: "#555", marginBottom: '1.5rem'  }}>
          マッチングはこちら{" "}
          <Link href="/matching" style={{ color: "#007AFF", fontWeight: "bold" }}>
            ここをタップ
          </Link>
        </p>
        <p style={{ color: "#555", marginBottom: '1.5rem'  }}>
          診断はこちら{" "}
          <Link href="/diagnosis" style={{ color: "#007AFF", fontWeight: "bold" }}>
            ここをタップ
          </Link>
        </p>
        <p style={{ color: "#555" }}>
          <Link href="/posts/new" style={{ color: "#007AFF", fontWeight: "bold" }}>
            新規投稿はこちら
          </Link>
        </p>
      </div>
    </div>
  );
}