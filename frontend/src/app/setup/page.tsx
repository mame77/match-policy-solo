"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "@/utils/cropImage";

export default function ProfileSetupPage() {
  const router = useRouter();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [isCropping, setIsCropping] = useState(true);

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

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      const previewUrl = URL.createObjectURL(croppedBlob);
      setCroppedPreviewUrl(previewUrl);
      setIsCropping(false);
    } catch (e) {
      alert("画像のトリミング中にエラーが発生しました");
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!croppedPreviewUrl || !bio) return;

    const croppedBlob = await fetch(croppedPreviewUrl).then(res => res.blob());
    const formData = new FormData();
    formData.append("avatar", croppedBlob, "avatar.jpg");
    formData.append("bio", bio);
    formData.append("user_id", "1");

    const res = await fetch("http://localhost:8000/profiles/setup", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      router.push("/home");
    } else {
      alert("プロフィールの登録に失敗しました");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-2xl shadow-md">
      <h1 className="text-xl font-bold mb-6 text-center">プロフィール設定</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
        {imageSrc && (
          <>
            <div
              className="relative w-full h-64 bg-black overflow-hidden"
              onClick={() => {
                if (!isCropping) setIsCropping(true);
              }}
            >
              <div
                style={{
                  pointerEvents: isCropping ? "auto" : "none",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                />
              </div>
            </div>

            {isCropping ? (
              <>
                <label>Zoom</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                />

                <label>Rotation</label>
                <input
                  type="range"
                  min={0}
                  max={360}
                  step={1}
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                />

                <button
                  type="button"
                  onClick={handleCropConfirm}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  disabled={!croppedAreaPixels}
                >
                  この範囲で決定
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsCropping(true)}
                className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                編集を再開
              </button>
            )}
          </>
        )}

        {croppedPreviewUrl && (
          <Image
            src={croppedPreviewUrl}
            alt="Preview"
            width={128}
            height={128}
            className="rounded-full object-cover"
          />
        )}

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="自己紹"
          className="w-full h-24 p-3 border rounded-md resize-none"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          disabled={!croppedPreviewUrl || !bio}
        >
          登録する
        </button>
      </form>
    </div>
  );
}