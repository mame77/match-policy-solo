'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

type Message = {
  id: number;
  sender: 'me' | 'partner';
  content: string;
};

export default function DMPage() {
  const userId = (useParams() as { userId: string }).userId;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetch(`http://localhost:8000/api/messages/${userId}`)
      .then((res) => res.json())
      .then((data: Message[]) => setMessages(data))
      .catch((err) => console.error('メッセージ取得失敗:', err));
  }, [userId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        sender: 'me',
        content: newMessage,
      },
    ]);
    setNewMessage('');
  };

  return (
    <div className="chat-container">
      <h2 className="chat-title">ユーザー {userId} とチャット中</h2>
      <div className="chat-box">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.sender === 'me' ? 'me' : 'partner'}`}
          >
            <span className="chat-bubble">{msg.content}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="メッセージを入力"
        />
        <button onClick={sendMessage}>送信</button>
      </div>

      <style>{`
        .chat-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 1rem;
          font-family: 'Segoe UI', sans-serif;
        }

        .chat-title {
          text-align: center;
          font-size: 22px;
          margin-bottom: 1rem;
        }

        .chat-box {
          border: 1px solid #ddd;
          border-radius: 12px;
          padding: 1rem;
          height: 360px;
          overflow-y: auto;
          background: #f9f9f9;
        }

        .chat-message {
          display: flex;
          margin: 0.5rem 0;
        }

        .chat-message.me {
          justify-content: flex-end;
        }

        .chat-message.partner {
          justify-content: flex-start;
        }

        .chat-bubble {
          padding: 0.6rem 1rem;
          border-radius: 20px;
          max-width: 75%;
          display: inline-block;
          background-color: #e0f7da; /* me */
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }

        .chat-message.partner .chat-bubble {
          background-color: #eaeaea;
        }

        .chat-input {
          display: flex;
          margin-top: 1rem;
          gap: 0.5rem;
        }

        .chat-input input {
          flex: 1;
          padding: 0.6rem;
          border: 1px solid #ccc;
          border-radius: 8px;
        }

        .chat-input button {
          padding: 0.6rem 1rem;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .chat-input button:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
}
