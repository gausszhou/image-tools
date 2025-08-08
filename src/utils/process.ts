import { replaceFileExtension } from ".";
import { EnumImageFormat, EnumImageType, ImageInfo } from "../types/image";
// @ts-ignore
import UPNG from 'upng-js';
// @ts-ignore
import { optimize } from 'svgo/dist/svgo.browser.js';

export interface ProcessResult {
    url: string;
    name: string;
    format: EnumImageFormat;
    blob: Blob; // 压缩后的文件对象
    dimensions: { width: number; height: number }
}

export interface ProcessOptions {
    scale: number;
    quality: number;
    type: EnumImageType;
}

function getValidFormat(format: string): EnumImageFormat {
    if (format === EnumImageFormat.JPEG) {
        return EnumImageFormat.JPEG;
    } else if (format === EnumImageFormat.PNG) {
        return EnumImageFormat.PNG;
    } else if (format === EnumImageFormat.WEBP) {
        return EnumImageFormat.WEBP;
    } else {
        return EnumImageFormat.WEBP;
    }
}

function getTargetFormat(type: EnumImageType, originalFormat: EnumImageFormat): EnumImageFormat {
    if (type === EnumImageType.SAME) {
        return getValidFormat(originalFormat);
    }
    return getValidFormat(type)
}


/**
 * 缩放 SVG 图片
 * 使用 DOMParser 和 XMLSerializer
 * @param svgString 
 * @param scale 
 * @returns 
 */
function scaleSvg(svgString: string, scale: number): string {
    // 解析 SVG 字符串
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');
    if (svgElement) {
        // 获取原始大小
        const width = svgElement.getAttribute('width');
        const height = svgElement.getAttribute('height');
        // 调整大小
        svgElement.setAttribute('width', `${Number(width) * scale}`);
        svgElement.setAttribute('height', `${Number(height) * scale}`);
        // 转换回字符串
        const newSvgString = new XMLSerializer().serializeToString(svgDoc);
        return newSvgString;
    }
    return svgString;
}

/**
 * 图片文件大小压缩 / 图片尺寸放缩
 * 使用 canvas.toBlob()
 * @Param originName 原始文件名
 * @param imageDataUrl 表示图片文件的一个临时地址
 * @param dimensions 
 * @param processOptions 
 * @returns 
 */
export const compressAndScaleImage = (
    originImage: ImageInfo,
    processOptions: ProcessOptions
): Promise<ProcessResult> => {
    const { url, name: originName, blob, format, dimensions } = originImage;
    const { scale, quality, type } = processOptions;
    const targetFormat = getTargetFormat(type, format);
    return new Promise(async (resolve, reject) => {
        // 如果是 SVG 格式，读取 svg 文件内容并进行压缩
        if (targetFormat === EnumImageFormat.SVG) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const svgString = e.target!.result;
                const scaledSvg = scaleSvg(svgString as string, scale);
                const svgData = await optimize(scaledSvg);
                const blob = new Blob([svgData.data], { type: EnumImageFormat.SVG });
                const url = URL.createObjectURL(blob);
                resolve({
                    url,
                    name: replaceFileExtension(originName, 'svg'),
                    blob,
                    format: EnumImageFormat.SVG,
                    dimensions: dimensions
                })
            };
            reader.readAsText(blob); // 以文本形式读取文件
            return;
        }
        try {
            const img = new Image();
            img.onload = async () => {
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
                if (targetFormat === EnumImageFormat.PNG) {
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const pngData = UPNG.encode(
                        [imageData.data.buffer],
                        canvas.width,
                        canvas.height,
                        Math.floor((100 - quality) * 2.56)  // 0 表示无损压缩
                    );
                    const blob = new Blob([pngData], { type: EnumImageFormat.PNG });
                    const url = URL.createObjectURL(blob);
                    resolve({
                        url,
                        name: replaceFileExtension(originName, 'png'),
                        blob,
                        format: EnumImageFormat.PNG,
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
                            reject(new Error('转换失败，浏览器可能不支持' + targetFormat + '编码'));
                            return;
                        }
                        const url = URL.createObjectURL(blob);
                        resolve({
                            url,
                            name: replaceFileExtension(originName, targetFormat.split('/')[1]),
                            blob,
                            format: targetFormat,
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

            img.src = url;
        } catch (err) {
            reject(err instanceof Error ? err : new Error('转换过程中发生错误'));
        }
    });
};
