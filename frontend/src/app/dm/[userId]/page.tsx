"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

type Message = {
  id: number;
  sender: "me" | "partner";
  content: string;
};

export default function DMPage() {
    const userId = (useParams() as { userId: string }).userId;

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "partner", content: "こんにちは！" },
    { id: 2, sender: "me", content: "やっほー！元気？" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        sender: "me",
        content: newMessage,
      },
    ]);
    setNewMessage("");
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2>ユーザー {userId} とチャット中</h2>
      <div style={{ border: "1px solid #ccc", padding: "1rem", height: "300px", overflowY: "auto" }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              textAlign: msg.sender === "me" ? "right" : "left",
              margin: "0.5rem 0",
            }}
          >
            <span
              style={{
                background: msg.sender === "me" ? "#dcf8c6" : "#f1f0f0",
                padding: "0.5rem 1rem",
                borderRadius: "1rem",
                display: "inline-block",
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "1rem", display: "flex" }}>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
          placeholder="メッセージを入力"
        />
        <button onClick={sendMessage} style={{ marginLeft: "0.5rem" }}>
          送信
        </button>
      </div>
    </div>
  );
}
