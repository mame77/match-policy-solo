'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    <>
      <div className="signup-container">
        <h2>サインアップ</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="username">ユーザー名</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">登録</button>
        </form>
        <div className="login-link">
          <p>
            すでにアカウントをお持ちですか？ <a href="/login">ログイン</a>
          </p>
        </div>
      </div>
      <style jsx>{`
        .signup-container {
          max-width: 400px;
          margin: 60px auto;
          padding: 30px;
          border: 1px solid #ccc;
          border-radius: 10px;
          background: #f9f9f9;
          font-family: sans-serif;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        h2 {
          text-align: center;
          margin-bottom: 24px;
        }

        .error {
          color: red;
          text-align: center;
          margin-bottom: 16px;
        }

        .signup-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        label {
          margin-bottom: 6px;
          font-weight: bold;
        }

        input {
          padding: 8px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }

        button {
          padding: 10px;
          font-size: 16px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        button:hover {
          background-color: #0059c1;
        }
      `}</style>
    </>
  );
}
