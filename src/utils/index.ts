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

export interface WebPConversionResult {
  webpUrl: string;
  webpName: string;
  blob: Blob;
  base64data: string;
}

export const compressImage = (
  imageDataUrl: string,
  dimensions: { width: number; height: number },
  quality: number,
  format = 'webp'
): Promise<WebPConversionResult> => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('无法创建canvas上下文'));
          return;
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('转换失败，浏览器可能不支持WebP编码'));
              return;
            }

            const webpUrl = URL.createObjectURL(blob);
            const webpName = 'converted.' + format;
            
            // 将 blob 转换为 base64
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64data = reader.result as string;
              resolve({
                webpUrl,
                webpName,
                blob,
                base64data
              });
            };
            reader.onerror = () => {
              reject(new Error('Base64转换失败'));
            };
            reader.readAsDataURL(blob);
          },
          'image/' + format,
          quality / 100
        );
      };

      img.onerror = () => {
        reject(new Error('图片加载失败'));
      };

      img.src = imageDataUrl;
    } catch (err) {
      reject(err instanceof Error ? err : new Error('转换过程中发生错误'));
    }
  });
};


export const scaleImage = (
  originalUrl: string,
  width: number,
  height: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('无法创建canvas上下文'));
        return;
      }

      // 设置 canvas 尺寸
      canvas.width = width;
      canvas.height = height;

      // 创建临时图片对象
      const img = new Image();
      img.onload = () => {
        // 在 canvas 上绘制缩放后的图片
        ctx.drawImage(img, 0, 0, width, height);
        
        // 将 canvas 转换为图片 URL
        const scaledUrl = canvas.toDataURL('image/png');
        resolve(scaledUrl);
      };

      img.onerror = () => {
        reject(new Error('图片加载失败'));
      };

      img.src = originalUrl;
    } catch (err) {
      reject(err);
    }
  });
};