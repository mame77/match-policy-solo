'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { fetchMatchingPosts, Post } from '@/lib/api/matching';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// dayjs 設定
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ja');
dayjs.tz.setDefault('Asia/Tokyo');

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatchingPosts()
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('投稿の取得に失敗しました', err);
        setLoading(false);
      });
  }, []);

  // 相対時間
  const formatTimestamp = (timestamp: string): string => {
    return dayjs.utc(timestamp).tz('Asia/Tokyo').fromNow();
  };

  if (loading) {
    return <p style={styles.loading}>読み込み中...</p>;
  }

  // ログインユーザー名の取得（自分のプロフィール遷移に使用）
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  let currentUsername: string | null = null;
  try {
    const payload = token
      ? JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
      : null;
    currentUsername = payload?.username ?? payload?.sub ?? null;
  } catch {}

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💕 マッチング</h1>
      {posts.map((post, index) => (
        <Link
          key={post.id}
          href={String(post.user_id) === currentUsername ? '/profile' : `/profile/${post.username}`}
        >
          <div
            style={{
              ...styles.card,
              animationDelay: `${index * 0.1}s`,
              animation: 'fadeInUp 0.6s ease-out forwards',
              opacity: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }}
          >
            <h2 style={styles.username}>
              🙋‍♀️ {post.username}
              <span style={{ marginLeft: 'auto', fontSize: '0.9rem', color: '#666' }}>
                ・ {formatTimestamp(post.created_at)}
              </span>
            </h2>
            <p style={styles.content}>{post.content}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem 1rem 6rem 1rem',
    minHeight: '100vh',
    background: 'transparent',
  },
  title: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '2rem',
    fontWeight: 700,
    color: 'white',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    animation: 'fadeInUp 0.6s ease-out',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    padding: '1.5rem',
    marginBottom: '1rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  username: {
    fontSize: '1.3rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#1a1a1a',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  content: {
    fontSize: '1rem',
    color: '#555',
    lineHeight: 1.6,
    marginTop: '0.5rem',
  },
  loading: {
    textAlign: 'center',
    marginTop: '4rem',
    fontSize: '1.2rem',
    color: 'white',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
  },
};
