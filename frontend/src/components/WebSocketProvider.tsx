// components/WebSocketProvider.tsx
'use client';

import { createContext, useEffect, useRef, useContext, useState } from 'react';

type Message = {
  id: string;
  sender: 'me' | 'partner';
  content: string;
};

type WebSocketContextType = {
  socket: WebSocket | null;
  lastMessage: Message | null;
};

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  lastMessage: null,
});

export function WebSocketProvider({
  userId,
  children,
}: {
  userId: number | null;
  children: React.ReactNode;
}) {
  const [lastMessage, setLastMessage] = useState<Message | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const ws = new WebSocket(`ws://localhost:8000/ws/dm/${userId}`);

    ws.onopen = () => {
      console.log('🔌 WebSocket connected');
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log('📩 WebSocket message received:', data);
      setLastMessage(data); // 最新メッセージを state に保存
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

export function useGlobalWebSocket() {
  return useContext(WebSocketContext);
}
