"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileSetupPage() {
  const router = useRouter();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bio, setBio] = useState("");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatar || !bio) return;

    const formData = new FormData();
    formData.append("avatar", avatar);
    formData.append("bio", bio);
    formData.append("user_id", "1"); // 仮の例、サインアップで取得済のIDを入れる

    const res = await fetch("http://localhost:8000/profiles/setup", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      router.push("/home"); // プロフィール登録後の遷移先
    } else {
      alert("プロフィールの登録に失敗しました");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-2xl shadow-md">
      <h1 className="text-xl font-bold mb-6 text-center">プロフィール設定</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        {avatarPreview ? (
          <img
  src={avatarPreview}
  alt="アイコンプレビュー"
  className="w-32 h-32 rounded-full object-cover"
/>
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            プレビュー
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="text-sm"
        />
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="自己紹介を入力（例：音楽と旅行が好きです）"
          className="w-full h-24 p-3 border rounded-md resize-none"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          登録する
        </button>
      </form>
    </div>
  );
}
