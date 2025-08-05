'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchMatchingPosts, Post } from '@/lib/api/matching';

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

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <p style={styles.loading}>読み込み中...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>投稿一覧 / マッチング</h1>
      {posts.map((post) => (
        <Link href={`/profile/${post.username}`} key={post.id} style={styles.link}>
          <div style={styles.card}>
            <div style={styles.header}>
              <img
                src={post.avatar_url || '/default-avatar.png'}
                alt={`${post.username}のアバター`}
                style={styles.avatar}
              />
              <h2 style={styles.username}>{post.username}</h2>
            </div>
            <p style={styles.content}>{post.content}</p>
            {/* 投稿日時を右下に配置 */}
            <p style={styles.timestamp}>{formatTimestamp(post.created_at)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    fontFamily: "'Helvetica Neue', sans-serif",
    padding: '0 16px',
  },
  title: {
    textAlign: 'center',
    fontSize: '28px',
    marginBottom: '24px',
    fontWeight: 600,
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '16px',
    marginBottom: '16px',
    transition: 'transform 0.2s ease',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative', // timestampを絶対位置で配置するために必要
    paddingBottom: '32px', // timestampの分、下部に余白を確保
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #eee',
  },
  username: {
    fontSize: '18px',
    fontWeight: 600,
    margin: 0,
    color: '#333',
  },
  timestamp: {
    position: 'absolute', // 親要素（card）を基準に位置を決定
    bottom: '12px',
    right: '16px',
    fontSize: '13px',
    color: '#888',
    margin: 0,
  },
  content: {
    fontSize: '16px',
    color: '#444',
    lineHeight: '1.5',
    margin: 0,
  },
  loading: {
    textAlign: 'center',
    marginTop: '100px',
    fontSize: '18px',
    color: '#666',
  },
};