import { replaceFileExtension } from ".";
import { EnumImageType } from "../types/image";
// @ts-ignore
import UPNG from 'upng-js';

export interface ProcessResult {
    url: string;
    name: string;
    type: EnumImageType;
    blob: Blob; // 压缩后的文件对象
    dimensions: { width: number; height: number }
}

export interface ProcessOptions {
    scale: number;
    quality: number;
    format: EnumImageType;
    originalFormat: EnumImageType;
}

/**
 * 图片文件大小压缩 / 图片尺寸放缩
 * 使用 canvas.toBlob()
 * @Param originName 原始文件名
 * @param imageDataUrl 表示图片文件的一个临时地址
 * @param dimensions 
 * @param options 
 * @returns 
 */
export const compressAndScaleImage = (
    originName: string,
    imageDataUrl: string,
    dimensions: { width: number; height: number },
    options: ProcessOptions
): Promise<ProcessResult> => {
    const { scale, quality, format, originalFormat } = options;
    const targetFormat = format === EnumImageType.SAME ? originalFormat : format;

    return new Promise((resolve, reject) => {
        try {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = Math.round(dimensions.width * scale);
                canvas.height = Math.round(dimensions.height * scale);
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('无法创建canvas上下文'));
                    return;
                }
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // 如果是 PNG 格式，使用 UPNG 进行处理
                if (targetFormat === EnumImageType.PNG) {
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const pngData = UPNG.encode(
                        [imageData.data.buffer],
                        canvas.width,
                        canvas.height,
                        0  // 0 表示无损压缩
                    );
                    const blob = new Blob([pngData], { type: EnumImageType.PNG });
                    const url = URL.createObjectURL(blob);
                    resolve({
                        url,
                        name: replaceFileExtension(originName, 'png'),
                        blob,
                        type: EnumImageType.PNG,
                        dimensions: {
                            width: canvas.width,
                            height: canvas.height
                        }
                    });
                    return;
                }

                // 其他格式使用原有的 canvas.toBlob 方法
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('转换失败，浏览器可能不支持' + format + '编码'));
                            return;
                        }
                        const url = URL.createObjectURL(blob);
                        resolve({
                            url,
                            name: replaceFileExtension(originName, targetFormat.split('/')[1]),
                            blob,
                            type: targetFormat,
                            dimensions: {
                                width: canvas.width,
                                height: canvas.height
                            }
                        });
                    },
                    targetFormat,
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
