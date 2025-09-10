'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { CSSProperties } from 'react';

export default function Footer() {
  const pathname = usePathname();

  // ログイン/サインアップではフッター非表示
  const hide = pathname === '/login' || pathname === '/signup';
  if (hide) return null;

  // 現在ページ判定（/posts/new のような下層も拾う）
  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + '/');

  const baseBtn: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 600,
    minWidth: '80px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'translateY(0)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
    textDecoration: 'none',
  };

  const pressHandlers = {
    onMouseDown: (e: React.MouseEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).style.transform = 'translateY(2px) scale(0.95)';
    },
    onMouseUp: (e: React.MouseEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
    },
  };

  return (
    <footer
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '12px 0 calc(12px + env(safe-area-inset-bottom))',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1000,
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* プロフィール */}
      <Link
        href="/profile"
        style={{
          ...baseBtn,
          background: 'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)',
          color: '#333',
          boxShadow: isActive('/profile') ? '0 6px 20px rgba(100, 100, 100, 0.3)' : baseBtn.boxShadow,
          outline: isActive('/profile') ? '2px solid rgba(0,0,0,0.1)' : 'none',
        }}
        {...pressHandlers}
        aria-current={isActive('/profile') ? 'page' : undefined}
      >
        👤 プロフィール
      </Link>

      {/* 投稿作成 */}
      <Link
        href="/posts/new"
        style={{
          ...baseBtn,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          boxShadow: isActive('/posts/new') ? '0 6px 20px rgba(102,126,234,0.5)' : baseBtn.boxShadow,
        }}
        {...pressHandlers}
        aria-current={isActive('/posts/new') ? 'page' : undefined}
      >
        📝 投稿
      </Link>

      {/* マッチング一覧 */}
      <Link
        href="/posts"
        style={{
          ...baseBtn,
          background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
          color: '#333',
          boxShadow: isActive('/posts') ? '0 6px 20px rgba(252,182,159,0.5)' : baseBtn.boxShadow,
        }}
        {...pressHandlers}
        aria-current={isActive('/posts') ? 'page' : undefined}
      >
        💕 マッチ
      </Link>

      {/* DM */}
      <Link
        href="/dm"
        style={{
          ...baseBtn,
          background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          color: '#333',
          boxShadow: isActive('/dm') ? '0 6px 20px rgba(168,237,234,0.5)' : baseBtn.boxShadow,
        }}
        {...pressHandlers}
        aria-current={isActive('/dm') ? 'page' : undefined}
      >
        💬 DM
      </Link>
    </footer>
  );
}
