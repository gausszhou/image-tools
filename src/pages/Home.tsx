import React, { useState } from 'react';
import ProcessNodeDestination from '../components/ProcessNodeDestination';
import ProcessNodeScale from '../components/ProcessNodeScale';
import ProcessNodeSource from "../components/ProcessNodeSource";
import ProcessNodeCompress from "../components/ProcessNodeCompress";
import { EnumImageType, ImageInfo } from '../types/image';
import { getImageDimensions } from '../utils';
import { compressAndScaleImage } from '../utils/process';
import './Home.css';

const ImageScale: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageInfo | null>(null);
  const [scaledImage, setScaledImage] = useState<ImageInfo | null>(null);

  const [quality, setQuality] = useState<number>(80);
  const [format, setFormat] = useState<EnumImageType>(EnumImageType.WEBP);

  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [lockRatio, setLockRatio] = useState<boolean>(true);

  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  const onImageSuccess = async (file: File) => {
    setStatus('图片已就绪');
    setError('');

    const originalUrl = URL.createObjectURL(file);
    const dimensions = await getImageDimensions(originalUrl);
    if (dimensions) {
      setWidth(dimensions.width);
      setHeight(dimensions.height);
      setAspectRatio(dimensions.width / dimensions.height);
    }

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

  const processImage = async () => {
    if (!originalImage) {
      setError('请选择图片');
      return;
    }

    try {
      setStatus('处理中...');
      setError('');
      const result = await compressAndScaleImage(originalImage.name, originalImage.url, { width, height }, quality, format)
      setScaledImage({
        url: result.url,
        name: result.name,
        size: result.blob.size,
        type: result.type,
        blob: result.blob,
        dimensions: result.dimensions
      });
      setStatus('处理完成');
    } catch (error: any) {
      setStatus('');
      onImageError(error)
    }
  };
  
  return (
    <div className="image-tool">
      <div className="image-tool__body">
        <div className="image-tool__input">
          <ProcessNodeSource onChange={onImageSuccess} onError={onImageError}></ProcessNodeSource>
          <ProcessNodeCompress quality={quality} format={format} onChange={(quality, format) => {
            setQuality(quality);
            setFormat(format);
          }} ></ProcessNodeCompress>
          <ProcessNodeScale aspectRatio={aspectRatio} width={width} height={height} lockRatio={lockRatio} onChange={(width, height, lockRatio) => {
            setWidth(width);
            setHeight(height);
            setLockRatio(lockRatio)
          }} ></ProcessNodeScale>
          {originalImage && (
            <button className="image-tool__button" onClick={processImage}>
              开始
            </button>
          )}
          {error && <div className="image-tool__error">{error}</div>}
          {status && <div className="image-tool__status">{status}</div>}
        </div>
        <div className="image-tool__output">
          {originalImage && scaledImage && (
              <div className="image-tool__preview">
                <ProcessNodeDestination title="原始图片" image={originalImage}></ProcessNodeDestination>
                <ProcessNodeDestination title="缩放后图片" image={scaledImage}></ProcessNodeDestination>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageScale;