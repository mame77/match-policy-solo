// app/page.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default function HomePage() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token")?.value;

  // トークンがあればマッチング画面、なければログインへ
  if (token) {
    redirect("/posts/new");
  } else {
    redirect("/login");
  }

  return null; // リダイレクトするのでUIは不要
}
