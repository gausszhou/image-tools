import React, { useState } from 'react';
import ProcessNodeCompress from "../components/ProcessNodeCompress";
import ProcessNodeDestination from '../components/ProcessNodeDestination';
import ProcessNodeSource from "../components/ProcessNodeSource";
import { EnumImageType, ImageInfo } from '../types/image';
import { getImageDimensions } from '../utils';
import { removeBg } from '../utils/process';
import './ImageCompose.css';

const ImageRemoveBackground: React.FC = () => {

  const [originalImage, setOriginalImage] = useState<ImageInfo | null>(null);
  const [outputImage, setOutputImage] = useState<ImageInfo | null>(null);

  const [quality, setQuality] = useState<number>(80);
  const [format, setFormat] = useState<EnumImageType>(EnumImageType.WEBP);

  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  const onImageSuccess = async (file: File) => {
    setStatus('图片已就绪...');
    setError('');

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

  const processImage = async () => {
    if (!originalImage) {
      setError('请选择图片');
      return;
    }
    try {
      setStatus('处理中，此任务比较耗时，请耐心等待...');
      setOutputImage(null)
      const result = await removeBg(originalImage.name, originalImage.url, originalImage.dimensions, quality, format)
      setStatus('处理完成');
      setOutputImage({
        url: result.url,
        name: result.name,
        size: result.blob.size,
        type: result.type,
        blob: result.blob,
        dimensions: result.dimensions
      });
    } catch (error: any) {
      onImageError(error)
    }

  }
  return (
    <div className="image-tool">
      <h1 className="image-tool__title">去除背景</h1>
      <div className="image-tool__body">
        <div className="image-tool__input">
          <ProcessNodeSource onChange={onImageSuccess} onError={onImageError}></ProcessNodeSource>
          <ProcessNodeCompress quality={quality} format={format} onChange={(quality, format) => {
            setQuality(quality);
            setFormat(format);
          }} ></ProcessNodeCompress>
          {originalImage && (
            <button className="image-tool__button" onClick={processImage}>
              开始缩放
            </button>
          )}
          {error && <div className="image-tool__error">{error}</div>}
          {status && <div className="image-tool__status">{status}</div>}
        </div>
        <div className="image-tool__output">
          {originalImage && outputImage && (
            <div className="image-scale__content">
              <div className="image-scale__preview">
                <ProcessNodeDestination title="原始图片" image={originalImage}></ProcessNodeDestination>
                <ProcessNodeDestination title="去除背景后图片" image={outputImage}></ProcessNodeDestination>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageRemoveBackground;