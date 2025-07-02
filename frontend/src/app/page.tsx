import { redirect } from "next/navigation";

// login/page.tsxに遷移する
export default function Home() {
  redirect("/login");
}
