// src/components/ClientRoot.tsx
'use client';

import { WebSocketProvider } from './WebSocketProvider';

export default function ClientRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WebSocketProvider>{children}</WebSocketProvider>;
}
