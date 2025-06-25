"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type DmUser = {
  id: number;
  name: string;
  lastMessage: string;
  avatarUrl?: string;
};

export default function DmListPage() {
  const router = useRouter();
  const [dmUsers, setDmUsers] = useState<DmUser[]>([]);

  useEffect(() => {
    // 仮のデータ（後でAPI連携に差し替え）
    setDmUsers([
      { id: 1, name: "さくら", lastMessage: "こんにちは", avatarUrl: "/avatar1.jpg" },
      { id: 2, name: "たけし", lastMessage: "またね", avatarUrl: "/avatar2.jpg" },
    ]);
  }, []);

  const handleClick = (userId: number) => {
    router.push(`/dm/${userId}`);
  };

  return (
    <div className="container">
      <h1 className="title">DM一覧</h1>
      <ul className="dm-list">
        {dmUsers.map((user) => (
          <li key={user.id} className="dm-item" onClick={() => handleClick(user.id)}>
            <img src={user.avatarUrl || "/default-avatar.png"} className="avatar" />
            <div className="dm-content">
              <p className="dm-name">{user.name}</p>
              <p className="dm-last">{user.lastMessage}</p>
            </div>
          </li>
        ))}
      </ul>

      <style>{`
        .container {
          max-width: 400px;
          margin: 40px auto;
          padding: 16px;
          font-family: sans-serif;
        }

        .title {
          text-align: center;
          font-size: 24px;
          margin-bottom: 20px;
        }

        .dm-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .dm-item {
          display: flex;
          align-items: center;
          padding: 12px;
          border-bottom: 1px solid #ddd;
          cursor: pointer;
        }

        .dm-item:hover {
          background-color: #f5f5f5;
        }

        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          margin-right: 12px;
          object-fit: cover;
        }

        .dm-content {
          flex-grow: 1;
        }

        .dm-name {
          font-weight: bold;
          margin: 0;
        }

        .dm-last {
          margin: 4px 0 0;
          color: #666;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
