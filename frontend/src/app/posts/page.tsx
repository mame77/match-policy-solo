'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchMatchingPosts, Post } from '@/lib/api/matching';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// dayjsにプラグインを拡張
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ja');
dayjs.tz.setDefault('Asia/Tokyo'); // 日本時間ベース

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

  // 経過時間を相対的に表示する関数
  const formatTimestamp = (timestamp: string): string => {
    return dayjs.utc(timestamp).tz('Asia/Tokyo').fromNow(); // 相対時間を表示
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '100px', fontSize: '18px', color: '#666' }}>読み込み中...</p>;

  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      fontFamily: "'Helvetica Neue', sans-serif",
      padding: '0 16px',
    }}>
      <h1 style={{ textAlign: 'center', fontSize: '28px', marginBottom: '24px', fontWeight: 600 }}>投稿一覧 / マッチング</h1>
      {posts.map((post) => (
        <Link href={`/profile/${post.username}`} key={post.id} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '15px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            textAlign: 'left',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              {/* アイコンのサイズを大きく変更 */}
              <img
                src={post.avatar_url || '/default-avatar.png'}
                alt={`${post.username}のアバター`}
                style={{
                  width: '48px',  // アイコンの幅
                  height: '48px',  // アイコンの高さ
                  borderRadius: '50%',  // 丸型にする
                  marginRight: '8px',
                }}
              />
              <strong style={{ fontSize: '1em', marginRight: '8px' }}>{post.username}</strong>
              <span style={{ color: '#66757F', fontSize: '0.9em', marginLeft: 'auto' }}>
                ・ {formatTimestamp(post.created_at)}
              </span>
            </div>
            <p style={{ margin: '0', fontSize: '1.05em', lineHeight: '1.4' }}>{post.content}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
