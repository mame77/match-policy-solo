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
        padding: '2rem 1rem',
        maxWidth: '600px',
        margin: 'auto',
        boxSizing: 'border-box',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
        新規投稿
      </h2>

      {error && (
        <p
          style={{
            color: '#D32F2F',
            backgroundColor: '#FFEBEE',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center',
            marginBottom: '1rem',
          }}
        >
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginTop: '1.5rem' }}>
          <label style={{ fontWeight: 'bold', color: '#555' }}>本文</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            style={{
              width: '100%',
              padding: '0.8rem',
              marginTop: '0.5rem',
              fontSize: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
              resize: 'vertical',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            marginTop: '2rem',
            width: '100%',
            padding: '1rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: '#007AFF',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          投稿する
        </button>
      </form>
    </div>
  );
}
