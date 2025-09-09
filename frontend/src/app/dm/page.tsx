'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchDmUsers, DmUser } from '@/lib/api/dm';
import { useGlobalWebSocket } from '@/components/WebSocketProvider';

export default function DmListPage() {
  const router = useRouter();
  const [dmUsers, setDmUsers] = useState<DmUser[]>([]);
  const { lastMessage } = useGlobalWebSocket();

  // ユーザークリックでDMページへ遷移
  const handleClick = (userId: number) => {
    router.push(`/dm/${userId}`);
  };

  // 初回にユーザー一覧を取得
  useEffect(() => {
    fetchDmUsers()
      .then(setDmUsers)
      .catch((err) => console.error('取得失敗:', err));
  }, []);

  // WebSocketで新着メッセージを受信したらDM一覧を更新
  useEffect(() => {
    if (!lastMessage) return;

    setDmUsers((prev) =>
      prev.map((user) =>
        user.id === Number(user.id) // ここは将来的に senderId をつけて比較
          ? { ...user, lastMessage: lastMessage.content }
          : user,
      ),
    );
  }, [lastMessage]);

  return (
    <div className="container">
      <h1 className="title">💬 DM</h1>
      <ul className="dm-list">
        {dmUsers.map((user) => (
          <li
            key={user.id}
            className="dm-item"
            onClick={() => handleClick(user.id)}
          >
            <img
              src={user.avatarUrl || '/default-avatar.png'}
              className="avatar"
            />
            <div className="dm-content">
              <p className="dm-name">{user.name}</p>
              <p className="dm-last">{user.lastMessage}</p>
            </div>
          </li>
        ))}
      </ul>

      <style>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem 1rem 6rem 1rem;
          min-height: 100vh;
          background: transparent;
        }

        .title {
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 2rem;
          color: white;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          animation: fadeInUp 0.6s ease-out;
        }

        .dm-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .dm-item {
          display: flex;
          align-items: center;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .dm-item:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin-right: 1rem;
          object-fit: cover;
          border: 3px solid rgba(102, 126, 234, 0.3);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .dm-content {
          flex-grow: 1;
        }

        .dm-name {
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
          color: #1a1a1a;
        }

        .dm-last {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}
