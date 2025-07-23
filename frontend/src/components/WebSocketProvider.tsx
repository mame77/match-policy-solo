'use client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

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

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [lastMessage, setLastMessage] = useState<Message | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const userId = parseJwt(token)?.sub;
    if (!userId) return;

    const ws = new WebSocket(`${WS_URL}/ws/dm/${userId}`);

    ws.onopen = () => {
      console.log('🔌 WebSocket connected');
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log('📩 WebSocket message received:', data);
      setLastMessage(data);
    };

    ws.onclose = () => {
      console.log('❌ WebSocket disconnected');
    };

    socketRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{ socket: socketRef.current, lastMessage }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

// JWTのsubを取り出すユーティリティ関数
function parseJwt(token: string): { sub?: string } | null {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export function useGlobalWebSocket() {
  return useContext(WebSocketContext);
}
