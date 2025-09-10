"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cropper, { Area } from "react-easy-crop";
import { v4 as uuidv4 } from "uuid";
import { getCroppedImg } from "@/utils/cropImage";

export default function ProfileSetupPage() {
  const router = useRouter();

  // ステートの定義
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  // 追加: トリミング後のBlobを保持
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [isCropping, setIsCropping] = useState(true);
  const [uploading, setUploading] = useState(false);

  // ファイル選択時の処理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setCroppedPreviewUrl(null);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // クロップ完了時のピクセル位置保存
  const onCropComplete = useCallback((_: Area, cropped: Area) => {
    setCroppedAreaPixels(cropped);
  }, []);

  // トリミング確定時の処理
  const handleCropConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedBlob(blob);
      const previewUrl = URL.createObjectURL(blob);
      setCroppedPreviewUrl(previewUrl);
      setImageSrc(null);
      setIsCropping(false);
    } catch (e) {
      console.error("Cropping error:", e);
      alert("画像のトリミングに失敗しました");
    }
  };

  // フォーム送信時の処理（プリサインド→PUT→登録）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!croppedBlob || !bio) {
      alert("画像と自己紹介を入力してください");
      return;
    }
    setUploading(true);

    try {
      // 1) オブジェクトキー生成
      const objectKey = `avatars/${uuidv4()}.jpg`;

      // 2) プリサインドURL取得 (認証ヘッダーを追加)
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("ログイン情報がありません");
      const res1 = await fetch(
        `http://localhost:8000/profiles/upload-url?key=${encodeURIComponent(objectKey)}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      if (!res1.ok) throw new Error("プリサインドURL取得失敗");
      const { uploadUrl } = await res1.json();

      // 3) MinIOへPUT
      const res2 = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "image/jpeg" },
        body: croppedBlob,
      });
      if (!res2.ok) throw new Error("画像アップロード失敗");

      // 4) プロフィール登録 (認証ヘッダーを追加)
      const res3 = await fetch("http://localhost:8000/profiles/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ objectKey, bio }),
      });
      if (!res3.ok) throw new Error("プロフィール登録失敗");

      alert("プロフィールの登録が完了しました！");
      router.push("/profile");
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "40px auto",
        padding: "24px",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "20px", fontWeight: "bold", textAlign: "center", marginBottom: "24px" }}>
        プロフィール設定
      </h1>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
        {isCropping && imageSrc && (
          <>
            <div style={{ position: "relative", width: "100%", height: "256px", backgroundColor: "black", overflow: "hidden" }}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div style={{ width: "100%", textAlign: "center", marginTop: "8px" }}>
              <label>Zoom</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                style={{ width: "100%", marginTop: "4px" }}
              />
            </div>

            <button
              type="button"
              onClick={handleCropConfirm}
              style={{
                marginTop: "12px",
                padding: "8px 16px",
                backgroundColor: "#10B981",
                color: "#fff",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              この範囲で決定
            </button>
          </>
        )}

        {croppedPreviewUrl && (
          <img
            src={croppedPreviewUrl}
            alt="プロフィール画像"
            style={{
              width: "128px",
              height: "128px",
              borderRadius: "50%",
              objectFit: "cover",
              marginTop: "12px",
            }}
          />
        )}

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="自己紹介を入力"
          style={{
            width: "100%",
            height: "96px",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            resize: "none",
          }}
          required
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#3B82F6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          disabled={!croppedPreviewUrl || !bio || uploading}
        >
          {uploading ? "登録中…" : "登録する"}
        </button>
      </form>
    </div>
  );
}
