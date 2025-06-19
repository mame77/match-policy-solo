
import { ReactNode } from "react";
import Footer from "../components/Footer";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
