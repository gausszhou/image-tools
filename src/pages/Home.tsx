import React, { useState } from 'react';
import { Slider } from 'antd';
import ProcessNodeDestination from '../components/ProcessNodeDestination';
import ProcessNodeScale from '../components/ProcessNodeScale';
import ProcessNodeSource from "../components/ProcessNodeSource";
import ProcessNodeCompress from "../components/ProcessNodeCompress";
import { EnumImageType, ImageInfo } from '../types/image';
import { getImageDimensions } from '../utils';
import { compressAndScaleImage } from '../utils/process';
import './Home.css';

const ImageScale: React.FC = () => {
  const [originalImages, setOriginalImages] = useState<ImageInfo[]>([]);
  const [processedImages, setProcessedImages] = useState<ImageInfo[]>([]);
  const [progress, setProgress] = useState<number>(0);

  const [quality, setQuality] = useState<number>(80);
  const [format, setFormat] = useState<EnumImageType>(EnumImageType.WEBP);

  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [lockRatio, setLockRatio] = useState<boolean>(true);

  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  const onImageSuccess = async (files: File[]) => {
    setStatus('图片已就绪');
    setError('');

    const processedImages: ImageInfo[] = [];

    for (const file of files) {
      const originalUrl = URL.createObjectURL(file);
      const dimensions = await getImageDimensions(originalUrl);

      // 使用第一张图片的尺寸作为初始缩放尺寸
      if (processedImages.length === 0 && dimensions) {
        setWidth(dimensions.width);
        setHeight(dimensions.height);
        setAspectRatio(dimensions.width / dimensions.height);
      }

      processedImages.push({
        url: originalUrl,
        name: file.name,
        size: file.size,
        type: file.type as EnumImageType,
        blob: file,
        dimensions
      });
    }

    setOriginalImages((prev) => prev.concat(processedImages));
    setProcessedImages([]);
  };

  const onImageError = (err: Error) => {
    setError(err instanceof Error ? err.message : '处理图片时出错');
    setStatus('');
  }

  const processImages = async () => {
    if (originalImages.length === 0) {
      setError('请选择图片');
      return;
    }

    try {
      setStatus('处理中...');
      setError('');
      setProgress(0);

      const processedImages: ImageInfo[] = [];

      for (let i = 0; i < originalImages.length; i++) {
        const originalImage = originalImages[i];
        const result = await compressAndScaleImage(
          originalImage.name,
          originalImage.url,
          { width, height },
          quality,
          format
        );

        processedImages.push({
          url: result.url,
          name: result.name,
          size: result.blob.size,
          type: result.type,
          blob: result.blob,
          dimensions: result.dimensions
        });


        // 更新进度
        setProcessedImages(processedImages);
        setProgress(Math.round(((i + 1) / originalImages.length) * 100));
      }

      setProcessedImages(processedImages);
      setStatus('处理完成');
    } catch (error: any) {
      setStatus('');
      onImageError(error);
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
          {originalImages.length > 0 && (
            <>
              <button className="image-tool__button" onClick={processImages}>
                开始处理 ({originalImages.length} 张图片)
              </button>
              <div style={{ marginTop: '16px', padding: '0 10px' }}>
                  <Slider value={progress}  />
                  <div style={{ textAlign: 'center', marginTop: '8px' }}>
                    <div className="image-tool__status">    处理进度：{progress}%</div>
                  </div>
                </div>
            </>
          )}
          {error && <div className="image-tool__error">{error}</div>}
          
        </div>
        <div className="image-tool__output">
          {originalImages.length > 0 && (
            <div className="image-tool__preview">
              <div className="image-tool__preview-group">
                <h3>原始图片</h3>
                <div className="image-tool__list">


                  {originalImages.map((image, index) => (
                    <ProcessNodeDestination
                      key={`original-${index}`}
                      title={`原始图片 ${index + 1}`}
                      image={image}
                    />
                  ))}
                </div>
              </div>
              {processedImages.length > 0 && (
                <div className="image-tool__preview-group">
                  <h3>处理后图片</h3>
                  <div className="image-tool__list">
                    {processedImages.map((image, index) => (
                      <ProcessNodeDestination
                        key={`scaled-${index}`}
                        title={`处理后图片 ${index + 1}`}
                        image={image}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageScale;