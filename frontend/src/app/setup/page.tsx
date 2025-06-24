"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "@/utils/cropImage";

export default function ProfileSetupPage() {
  const router = useRouter();

  // ステートの定義
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [isCropping, setIsCropping] = useState(true);

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
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const previewUrl = URL.createObjectURL(croppedBlob);
      setCroppedPreviewUrl(previewUrl);
      setImageSrc(null);
      setIsCropping(false);
    } catch (e) {
      console.error("Cropping error:", e);
      alert("画像のトリミングに失敗しました");
    }
  };

  // フォーム送信時の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!croppedPreviewUrl || !bio) return;

    const blob = await fetch(croppedPreviewUrl).then((res) => res.blob());
    const formData = new FormData();
    formData.append("avatar", blob, "avatar.jpg");
    formData.append("bio", bio);
    formData.append("user_id", "1");

    const res = await fetch("http://localhost:8000/profiles/setup", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      router.push("/home");
    } else {
      alert("登録に失敗しました");
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
          <img//ここの注意は実行に影響がないため放置でOK
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
          disabled={!croppedPreviewUrl || !bio}
        >
          登録する
        </button>
      </form>
    </div>
  );
}
