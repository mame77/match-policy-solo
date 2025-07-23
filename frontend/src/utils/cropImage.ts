export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }, // 切り取り範囲
): Promise<Blob> => {
  // 画像を読み込む
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  // 切り取るための canvas を作成
  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // 描画コンテキストを取得
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas rendering failed');

  // 指定された範囲を canvas に描画
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  // canvas を JPEG形式の Blob に変換して返す
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, 'image/jpeg');
  });
};
