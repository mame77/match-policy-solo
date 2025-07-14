'use client';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
import { createContext, useEffect, useRef, useContext, useState } from 'react';

// メッセージ型定義
type Message = {
  id: string;
  sender: 'me' | 'partner';
  content: string;
};

// WebSocketコンテキストの型定義
type WebSocketContextType = {
  socket: WebSocket | null;
  lastMessage: Message | null;
};

// コンテキストを作成
const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  lastMessage: null,
});

// WebSocketプロバイダー
export function WebSocketProvider({
  userId,
  children,
}: {
  userId: number | null;
  children: React.ReactNode;
}) {
  const [lastMessage, setLastMessage] = useState<Message | null>(null); // 受信した最新メッセージ
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!userId) return;

    // WebSocket接続
    const ws = new WebSocket(`${WS_URL}/ws/dm/${userId}`);
    ws.onopen = () => {
      console.log('🔌 WebSocket connected');
    };

    // メッセージを受信
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log('📩 WebSocket message received:', data);
      setLastMessage(data); // 最新メッセージをステートに保存
    };

    ws.onclose = () => {
      console.log('❌ WebSocket disconnected');
    };

    socketRef.current = ws;

    return () => {
      ws.close();
    };
  }, [userId]);

  return (
    <WebSocketContext.Provider
      value={{ socket: socketRef.current, lastMessage }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

// コンテキストを使うためのカスタムフック
export function useGlobalWebSocket() {
  return useContext(WebSocketContext);
}
