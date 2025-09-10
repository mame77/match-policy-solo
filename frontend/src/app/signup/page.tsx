'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signup } from '@/lib/api/auth';

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = await signup(username, password);
      localStorage.setItem('access_token', token);
      router.push('/setup');
    } catch (err: any) {
      console.error(err);
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
        padding: '2rem 1rem',
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
          maxWidth: '400px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          animation: 'fadeInUp 0.6s ease-out',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700'
          }}>
            🚀
          </h1>
          <h2 style={{ 
            fontSize: '1.8rem',
            fontWeight: '600', 
            color: '#1a1a1a',
            marginBottom: '0.5rem'
          }}>
            はじめよう！
          </h2>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>新しいアカウントを作成</p>
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
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="username"
              style={{ 
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600', 
                color: '#333',
                marginBottom: '0.5rem'
              }}
            >
              👤 ユーザー名
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ユーザー名を入力"
              required
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                border: '2px solid rgba(102, 126, 234, 0.2)',
                borderRadius: '16px',
                boxSizing: 'border-box',
                background: 'rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s ease',
                outline: 'none',
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

          <div style={{ marginBottom: '2rem' }}>
            <label
              htmlFor="password"
              style={{ 
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600', 
                color: '#333',
                marginBottom: '0.5rem'
              }}
            >
              🔐 パスワード
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              required
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                border: '2px solid rgba(102, 126, 234, 0.2)',
                borderRadius: '16px',
                boxSizing: 'border-box',
                background: 'rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s ease',
                outline: 'none',
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
            ✨ 登録
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            すでにアカウントをお持ちですか？{' '}
            <Link 
              href="/login" 
              style={{ 
                color: '#667eea', 
                fontWeight: '600',
                textDecoration: 'underline',
                textDecorationColor: 'rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecorationColor = '#667eea';
                e.currentTarget.style.color = '#764ba2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecorationColor = 'rgba(102, 126, 234, 0.3)';
                e.currentTarget.style.color = '#667eea';
              }}
            >
              こちら 🔑
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
