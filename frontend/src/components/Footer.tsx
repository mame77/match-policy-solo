'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  // ログイン.サインアップはフッダーをつけない
  const hide = pathname === '/login' || pathname === '/signup';

  if (hide) return null;

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
      <Link 
        href="/posts/new"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '8px 16px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          minWidth: '80px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: 'translateY(0)',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'translateY(2px) scale(0.95)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
        }}
      >
        📝 投稿
      </Link>
      <Link 
        href="/posts"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '8px 16px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
          color: '#333',
          fontSize: '14px',
          fontWeight: '600',
          minWidth: '80px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: 'translateY(0)',
          boxShadow: '0 4px 15px rgba(255, 182, 159, 0.3)',
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'translateY(2px) scale(0.95)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
        }}
      >
        💕 マッチ
      </Link>
      <Link 
        href="/dm"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '8px 16px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          color: '#333',
          fontSize: '14px',
          fontWeight: '600',
          minWidth: '80px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: 'translateY(0)',
          boxShadow: '0 4px 15px rgba(168, 237, 234, 0.3)',
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'translateY(2px) scale(0.95)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
        }}
      >
        💬 DM
      </Link>
    </footer>
  );
}
