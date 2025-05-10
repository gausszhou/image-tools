export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const getImageDimensions = (dataUrl: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.src = dataUrl;
  });
};

export const convertToWebP = async (
  imageDataUrl: string,
  dimensions: { width: number; height: number },
  quality: number,
  onProgress: (progress: number, status: string) => void,
  onComplete: (webpUrl: string, webpName: string, blob: Blob, base64data: string) => void,
  onError: (error: string) => void
) => {
  try {
    onProgress(20, '正在转换...');

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('无法创建canvas上下文');
      }

      ctx.drawImage(img, 0, 0);
      onProgress(50, '编码WebP...');

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error('转换失败，浏览器可能不支持WebP编码');
          }

          const webpUrl = URL.createObjectURL(blob);
          const webpName = 'converted.webp';
          
          // 将 blob 转换为 base64
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            onComplete(webpUrl, webpName, blob, base64data);
          };
          reader.readAsDataURL(blob);
        },
        'image/webp',
        quality / 100
      );
    };

    img.src = imageDataUrl;
  } catch (err) {
    onError(err instanceof Error ? err.message : '转换过程中发生错误');
  }
}; 