'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost } from '@/lib/api/posts';

export default function NewPostPage() {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // 投稿フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token'); // トークンを取得
    if (!token) {
      setError('ログイン情報がありません');
      return;
    }

    try {
      await createPost(content, token); // 投稿作成
      router.push('/posts'); // 投稿一覧ページ遷移
    } catch (err: any) {
      setError(err.message || 'サーバーエラーが発生しました');
    }
  };
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem 6rem 1rem',
        background: 'transparent',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '2rem',
          width: '100%',
          maxWidth: '500px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          animation: 'fadeInUp 0.6s ease-out',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '0.5rem',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
          }}>
            ✍️
          </h1>
          <h2 style={{ 
            fontSize: '1.8rem',
            fontWeight: '600', 
            color: '#1a1a1a',
            marginBottom: '0.5rem'
          }}>
            新しい投稿
          </h2>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>あなたの想いを届けよう</p>
        </div>

        {error && (
          <div
            style={{
              background: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
              color: 'white',
              padding: '1rem',
              borderRadius: '16px',
              textAlign: 'center',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              fontWeight: '500',
              boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
            }}
          >
            🚨 {error}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ marginBottom: '2rem' }}>
            <label
              style={{ 
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600', 
                color: '#333',
                marginBottom: '0.5rem'
              }}
            >
              💭 本文
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="今の気持ちを書いてみよう...✨"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                border: '2px solid rgba(102, 126, 234, 0.2)',
                borderRadius: '16px',
                boxSizing: 'border-box',
                background: 'rgba(255, 255, 255, 0.8)',
                resize: 'none',
                transition: 'all 0.3s ease',
                outline: 'none',
                minHeight: '120px',
                fontFamily: 'inherit',
                lineHeight: '1.6',
              }}
              onFocus={(e) => {
                e.target.style.border = '2px solid #667eea';
                e.target.style.background = 'white';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid rgba(102, 126, 234, 0.2)';
                e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: 'white',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(2px) scale(0.98)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(102, 126, 234, 0.6)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
            }}
          >
            🚀 投稿する
          </button>
        </form>
      </div>
    </div>
  );
}
