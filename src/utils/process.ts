import { replaceFileExtension } from ".";
import { EnumImageType } from "../types/image";

export interface ProcessResult {
    url: string;
    name: string;
    type: EnumImageType;
    blob: Blob; // 压缩后的文件对象
    dimensions: { width: number; height: number }
}

/**
 * 图片文件大小压缩 / 图片尺寸放缩
 * 使用 canvas.toBlob()
 * @param imageDataUrl 表示图片文件的一个临时地址
 * @param dimensions 
 * @param quality 
 * @param format 
 * @returns 
 */
export const compressAndScaleImage = (
    originName: string,
    imageDataUrl: string,
    dimensions: { width: number; height: number },
    quality: number = 100,
    format = EnumImageType.WEBP
): Promise<ProcessResult> => {
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
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('转换失败，浏览器可能不支持' + format + '编码'));
                            return;
                        }
                        const url = URL.createObjectURL(blob);
                        resolve({
                            url,
                            name: replaceFileExtension(originName, format.split('/')[1]),
                            blob,
                            type: format,
                            dimensions: dimensions
                        });
                    },
                    format,
                    quality / 100
                );
            };

            img.onerror = (e) => {
                reject(e);
            };

            img.src = imageDataUrl;
        } catch (err) {
            reject(err instanceof Error ? err : new Error('转换过程中发生错误'));
        }
    });
};
