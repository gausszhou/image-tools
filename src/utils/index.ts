/**
 * 格式化文件大小，转换为人类可读的格式
 * @param bytes 
 * @returns 
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * 复制文本到剪贴板
 * @param text 
 * @returns 
 */
export async function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    return await navigator.clipboard.writeText(text);
  } else {
    return new Promise((resolve, reject) => {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      document.body.appendChild(textarea);
      textarea.select();

      try {
        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (successful) {
          resolve({});
        } else {
          reject(new Error("复制命令失败"));
        }
      } catch (err) {
        document.body.removeChild(textarea);
        reject(err);
      }
    });
  }
}

/**
 * 获取 Base64 图片的尺寸信息
 * @param dataUrl 
 * @returns 
 */
export function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
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

/**
 * 图片文件转 Base64
 * @param file File
 * @returns Base64
 */
export function blobToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(new Error('Base64转换失败'));
    };
    reader.readAsDataURL(file);
  });
}


export function replaceFileExtension(originalFileName: string, newExtension: string): string {
  // 使用正则表达式匹配文件名中的最后一个点（如果有）
  const regex = /\.([a-z0-9]+)(?:\/|\?|#|$)/i;
  
  // 替换后缀名
  return originalFileName.replace(regex, `.${newExtension}`);
}
