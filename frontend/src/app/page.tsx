import { redirect } from "next/navigation";

// ログインページに遷移する
export default function Home() {
  redirect("/login");
}
