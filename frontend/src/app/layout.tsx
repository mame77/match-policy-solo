import { ReactNode } from 'react';
import Footer from '../components/Footer';
import { WebSocketProvider } from '@/components/WebSocketProvider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <WebSocketProvider>
          <main>{children}</main>
        </WebSocketProvider>
        <Footer />
      </body>
    </html>
  );
}
