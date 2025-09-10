'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchMatchingPosts, Post } from '@/lib/api/matching';

export default function PostsPage() {
  // 投稿状態管理
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // 初回投稿一覧取得
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

  if (loading) return <p style={styles.loading}>読み込み中...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💕 マッチング</h1>
      {posts.map((post, index) => (
        <Link href={`/profile/${post.username}`} key={post.id}>
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
            </h2>
            <p style={styles.content}>{post.content}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
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
    fontWeight: '700',
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
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#1a1a1a',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  content: {
    fontSize: '1rem',
    color: '#555',
    lineHeight: '1.6',
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
