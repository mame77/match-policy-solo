// src/lib/api/profile.ts
export const uploadProfile = async ({
  blob,
  bio,
  userId,
}: {
  blob: Blob;
  bio: string;
  userId: string;
}) => {
  const formData = new FormData();
  formData.append('avatar', blob, 'avatar.jpg');
  formData.append('bio', bio);
  formData.append('user_id', userId);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${API_URL}/profiles`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('プロフィール登録に失敗しました');
  }

  return res;
};
