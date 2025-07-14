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
        width: '100%',
        backgroundColor: '#f9f9f9',
        borderTop: '1px solid #ccc',
        padding: '1rem 0',
        display: 'flex',
        justifyContent: 'space-around',
      }}
    >
      <Link href="/posts/new">投稿</Link>
      <Link href="/posts">マッチング</Link>
      <Link href="/dm">DM</Link>
    </footer>
  );
}
