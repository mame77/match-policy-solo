'use client'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/ja'
import { useEffect, useState } from 'react'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('ja')
dayjs.tz.setDefault('Asia/Tokyo')  // ← これで日本時間ベース



// プロフィール情報の型定義
interface Profile {
  user_id: number
  username: string
  avatar_url: string
  bio: string
  followers_count: number // Twitter風プロフィールのために追加
  following_count: number // Twitter風プロフィールのために追加
}

// 投稿情報の型定義（新しく追加）
interface Post {
  id: number
  username: string // あなたのDBスキーマに基づく
  content: string
  created_at: string // バックエンドからISO 8601形式の文字列で来ると想定
}

// プロフィールカード表示用コンポーネント（ほとんど変更なし）
function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '32px auto 0 auto', // 投稿のためのスペースを確保するためマージン調整
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      overflow: 'hidden',
      backgroundColor: '#fff',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        backgroundColor: '#1DA1F2', // Twitterブルー
        height: '120px',
        position: 'relative'
      }}>
        <img
          src={profile.avatar_url}
          alt="avatar"
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: '4px solid #fff',
            position: 'absolute',
            bottom: '-60px',
            left: '20px',
          }}
        />
      </div>
      <div style={{ padding: '70px 20px 20px 20px', textAlign: 'left' }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '1.8em', color: '#333' }}>
          {profile.username}
        </h2>
        <p style={{ margin: '0 0 16px 0', color: '#66757F', fontSize: '1em' }}>
          @{profile.username.toLowerCase().replace(/\s/g, '')} {/* シンプルなハンドル名 */}
        </p>
        <p style={{ margin: '0 0 16px 0', color: '#333', fontSize: '1.1em', lineHeight: '1.5' }}>
          {profile.bio}
        </p>
        <div style={{ display: 'flex', gap: '20px', fontSize: '1em' }}>
          <p style={{ margin: 0, color: '#555' }}>
            <strong style={{ fontSize: '1.1em' }}>{profile.following_count}</strong> フォロー中
          </p>
          <p style={{ margin: 0, color: '#555' }}>
            <strong style={{ fontSize: '1.1em' }}>{profile.followers_count}</strong> フォロワー
          </p>
        </div>
      </div>
    </div>
  )
}

// 1つの投稿を表示する新しいコンポーネント
function PostCard({ post, avatarUrl }: { post: Post, avatarUrl: string }) {
  // 投稿からの経過時間を整形する関数（dayjsを使用）
  const formatTimeAgo = (isoString: string) => {
    return dayjs.utc(isoString).tz().fromNow(); // ←日本語時間で表示
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      fontFamily: "'Helvetica Neue', sans-serif",
      padding: '0 16px',
    }}>
      <div key={post.id} style={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '15px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        textAlign: 'left',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          {/* プロフィールから渡されたアイコンURLを使用 */}
          <img
            src={avatarUrl || '/default-avatar.png'}  // avatar_urlがない場合はデフォルト画像
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
            ・ {formatTimeAgo(post.created_at)} {/* 投稿からの経過時間を表示 */}
          </span>
        </div>
        <p style={{ margin: '0', fontSize: '1.05em', lineHeight: '1.4' }}>{post.content}</p>
      </div>
    </div>
  );
}


// メインのプロフィールページコンポーネント
export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [posts, setPosts] = useState<Post[]>([]) // 投稿データを保持する新しいステート
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      setError('未ログインのためトークンがありません')
      setLoading(false)
      return
    }

    // プロフィールと投稿の両方をフェッチする非同期関数
    const fetchProfileAndPostsData = async () => {
      try {
        // プロフィールデータをフェッチ
        const profileRes = await fetch('http://localhost:8000/profiles/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!profileRes.ok) {
          const txt = await profileRes.text()
          throw new Error(`HTTP ${profileRes.status}: ${txt}`)
        }
        const profileData: Profile = await profileRes.json()

        // --- フォロー・フォロワー数のシミュレーションデータ（バックエンドから取得するように変更してください） ---
        profileData.followers_count = 0; // 修正点
        profileData.following_count = 0; // 修正点
        // --- シミュレーションデータ終わり ---

        setProfile(profileData)

        const postsRes = await fetch('http://localhost:8000/posts/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!postsRes.ok) {
          const txt = await postsRes.text()
          throw new Error(`HTTP ${postsRes.status}: ${txt}`)
        }
        const postsData: Post[] = await postsRes.json()

        // 投稿を created_at の新しい順にソート
        const sortedPosts = postsData.sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setPosts(sortedPosts)

      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    }

    fetchProfileAndPostsData()
  }, []) // 依存配列が空なので、コンポーネントのマウント時に一度だけ実行される

  // ローディング中、エラー発生時、プロフィールが見つからない場合の表示
  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>読み込み中…</p>
  if (error) return <p style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>エラー: {error}</p>
  if (!profile) return <p style={{ textAlign: 'center', marginTop: '50px' }}>プロフィールが見つかりません</p>

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      {/* プロフィールカードの表示 */}
      <ProfileCard profile={profile} />

      {/* 投稿セクション */}
      <div style={{ marginTop: '20px', padding: '0 20px' }}>
        <h3 style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '10px', marginBottom: '20px', color: '#333' }}>
          投稿
        </h3>
        {posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>まだ投稿がありません。</p>
        ) : (
          // 投稿があれば、PostCardコンポーネントをリスト表示
          posts.map(post => (
            <PostCard key={post.id} post={post} avatarUrl={profile.avatar_url} />
          ))
        )}
      </div>
    </div>
  )
}