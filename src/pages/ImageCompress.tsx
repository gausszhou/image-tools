import React, { useState } from 'react';
import ProcessNodeCompress from "../components/ProcessNodeCompress";
import ProcessNodeDestination from '../components/ProcessNodeDestination';
import ProcessNodeSource from "../components/ProcessNodeSource";
import { getImageDimensions } from '../utils';
import './ImageCompress.css';
import { EnumImageType, ImageInfo } from '../types/image';
import { compressAndScaleImage } from '../utils/process';

const ImageCompress: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageInfo | null>(null);
  const [compressedImage, setCompressedImage] = useState<ImageInfo | null>(null);

  const [quality, setQuality] = useState<number>(80);
  const [format, setFormat] = useState<EnumImageType>(EnumImageType.WEBP);

  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  const onImageSuccess = async (file: File) => {
    setStatus('图片已就绪...');
    setError('');

    console.log(file);
    
    const originalUrl = URL.createObjectURL(file);
    const dimensions = await getImageDimensions(originalUrl);

    setOriginalImage({
      url: originalUrl,
      name: file.name,
      size: file.size,
      type: file.type as EnumImageType,
      blob: file,
      dimensions
    });
  };

  const onImageError = (err: Error) => {
    setError(err instanceof Error ? err.message : '处理图片时出错');
    setStatus('');
  }

  const convertImage = async () => {
    if (!originalImage) return;

    try {
      setStatus('开始转换');
      setError('');
      const result = await compressAndScaleImage(originalImage.name, originalImage.url, originalImage.dimensions, quality, format);
      setCompressedImage({
        url: result.url,
        name: result.name,
        size: result.blob.size,
        blob: result.blob,
        type: result.type,
        dimensions: result.dimensions
      });
      setStatus('转换完成');
    } catch (conversionError) {
      setError(conversionError instanceof Error ? conversionError.message : '转换失败');
      setStatus('');
    }
  };

  return (
    <div className="image-converter">
      <h1 className="image-converter__title">图片压缩</h1>
      <div className="image-converter__body">
        <div className="image-converter__input">
          <ProcessNodeSource onChange={onImageSuccess} onError={onImageError}></ProcessNodeSource>
          <ProcessNodeCompress quality={quality} format={format} onChange={(quality, format) => {
            setQuality(quality);
            setFormat(format);
          }} ></ProcessNodeCompress>
          {originalImage && (
            <button
              className="image-converter__convert-btn"
              onClick={convertImage}
            >
              开始压缩
            </button>
          )}
          {error && <div className="image-converter__error">{error}</div>}
          {status && <div className="image-converter__status">{status}</div>}
        </div>
        <div className="image-converter__output">
          {originalImage && compressedImage && (
            <div className="image-converter__preview">
              <ProcessNodeDestination title="原始图片" image={originalImage}></ProcessNodeDestination>
              <ProcessNodeDestination title="压缩后图片" image={compressedImage}></ProcessNodeDestination>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ImageCompress;