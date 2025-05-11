import React, { useRef, useState } from 'react';
import ProcessNodeDestination from '../components/ProcessNodeDestination';
import ProcessNodeScale from '../components/ProcessNodeScale';
import ProcessNodeSource from "../components/ProcessNodeSource";
import { getImageDimensions } from '../utils';
import './ImageScale.css';
import { EnumImageType, ImageInfo } from '../types/image';
import { compressAndScaleImage } from '../utils/process';

const ImageScale: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageInfo | null>(null);
  const [scaledImage, setScaledImage] = useState<ImageInfo | null>(null);

  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [lockRatio, setLockRatio] = useState<boolean>(true);

  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  const onImageSuccess = async (file: File) => {
    setStatus('图片已就绪...');
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

  const scaleImage = async () => {
    if (!originalImage) return;
    try {
      const result = await compressAndScaleImage(originalImage.name, originalImage.url, { width, height })
      setScaledImage({
        url: result.url,
        name: result.name,
        size: result.blob.size,
        type: result.type,
        blob: result.blob,
        dimensions: { width, height }
      });
    } catch (error: any) {
      onImageError(error)
    }

  };

  return (
    <div className="image-scale">
      <h1 className="image-scale__title">图片缩放</h1>
      <div className="image-scale__body">
        <div className="image-scale__input">
          <ProcessNodeSource onChange={onImageSuccess} onError={onImageError}></ProcessNodeSource>
          <ProcessNodeScale aspectRatio={aspectRatio} width={width} height={height} lockRatio={lockRatio} onChange={(width, height, lockRatio) => {
            setWidth(width);
            setHeight(height);
            setLockRatio(lockRatio)
          }} ></ProcessNodeScale>
          {originalImage && (
            <button className="image-scale__button" onClick={scaleImage}>
              开始缩放
            </button>
          )}
          {error && <div className="image-converter__error">{error}</div>}
          {status && <div className="image-converter__status">{status}</div>}
        </div>
        <div className="image-scale__output">
          {originalImage && scaledImage && (
            <div className="image-scale__content">
              <div className="image-scale__preview">
              <ProcessNodeDestination title="原始图片" image={originalImage}></ProcessNodeDestination>
              <ProcessNodeDestination title="缩放后图片" image={scaledImage}></ProcessNodeDestination>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ImageScale;