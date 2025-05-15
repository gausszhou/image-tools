import React, { useState } from 'react';
import { Slider } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import ProcessNodeDestination from '../components/ProcessNodeDestination';
import ProcessNodeScale from '../components/ProcessNodeScale';
import ProcessNodeSource from "../components/ProcessNodeSource";
import ProcessNodeCompress from "../components/ProcessNodeCompress";
import { EnumImageFormat, EnumImageType, ImageInfo } from '../types/image';
import { getImageDimensions } from '../utils';
import { compressAndScaleImage } from '../utils/process';
import './Home.css';

const Home: React.FC = () => {
  const [sourceKey, setSourceKey] = useState<number>(0);
  const [originalImages, setOriginalImages] = useState<ImageInfo[]>([]);
  const [processedImages, setProcessedImages] = useState<ImageInfo[]>([]);
  const [progress, setProgress] = useState<number>(0);

  const [quality, setQuality] = useState<number>(80);
  const [type, setType] = useState<EnumImageType>(EnumImageType.SAME);

  const [scale, setScale] = useState<number>(1);
  const [error, setError] = useState<string>('');

  const onImageSuccess = async (files: File[]) => {
    setError('');
    const processedImages: ImageInfo[] = [];

    for (const file of files) {
      const originalUrl = URL.createObjectURL(file);
      const dimensions = await getImageDimensions(originalUrl);
      processedImages.push({
        id: uuidv4(),
        url: originalUrl,
        name: file.name,
        size: file.size,
        format: file.type as EnumImageFormat,
        blob: file,
        dimensions
      });
    }
    setOriginalImages((prev) => prev.concat(processedImages));
    setProcessedImages([]);
  };

  const onImageError = (err: Error) => {
    setError(err instanceof Error ? err.message : '处理图片时出错');
  }

  const processImages = async () => {
    if (originalImages.length === 0) {
      setError('请选择图片');
      return;
    }

    try {
      setError('');
      setProgress(0);

      const processedImages: ImageInfo[] = [];

      for (let i = 0; i < originalImages.length; i++) {
        const originalImage = originalImages[i];
        const result = await compressAndScaleImage(
          originalImage,
          {
            scale,
            quality,
            type,
          }
        );

        processedImages.push({
          id: originalImage.id, // 使用原始图片的 id
          url: result.url,
          name: result.name,
          size: result.blob.size,
          format: result.format,
          blob: result.blob,
          dimensions: result.dimensions
        });

        // 更新进度
        setProcessedImages(processedImages);
        setProgress(Math.round(((i + 1) / originalImages.length) * 100));
      }

      setProcessedImages(processedImages);
    } catch (error: any) {
      onImageError(error);
    }
  };

  // 添加删除原始图片的处理函数
  const handleDeleteOriginal = (image: ImageInfo) => {
    URL.revokeObjectURL(image.url);
    setOriginalImages(prev => prev.filter(item => item.id !== image.id));
    // 当删除原始图片时，也需要删除对应的处理后图片
    const processedImage = processedImages.find(item => item.id === image.id);
    if (processedImage) {
      URL.revokeObjectURL(processedImage.url);
    }
    setProcessedImages(prev => prev.filter(item => item.id !== image.id));
    // 更新key以强制重新渲染ProcessNodeSource组件
    setSourceKey(prev => prev + 1);
  };

  // 添加删除处理后图片的处理函数
  const handleDeleteProcessed = (image: ImageInfo) => {
    URL.revokeObjectURL(image.url);
    setProcessedImages(prev => prev.filter(item => item.id !== image.id));
  };

  // 添加清空原始图片列表的处理函数
  const handleClearOriginal = () => {
    originalImages.forEach(image => {
      URL.revokeObjectURL(image.url);
    });
    processedImages.forEach(image => {
      URL.revokeObjectURL(image.url);
    });
    setOriginalImages([]);
    setProcessedImages([]);
    // 更新key以强制重新渲染ProcessNodeSource组件
    setSourceKey(prev => prev + 1);
  };

  // 添加清空处理后图片列表的处理函数
  const handleClearProcessed = () => {
    processedImages.forEach(image => {
      URL.revokeObjectURL(image.url);
    });
    setProcessedImages([]);
  }


  return (
    <div className="image-tool">
      <div className="image-tool__body">
        <div className="image-tool__input">
          <ProcessNodeSource
            key={sourceKey}
            onChange={onImageSuccess}
            onError={onImageError}
          />
          <ProcessNodeCompress quality={quality} type={type} onChange={(quality, format) => {
            setQuality(quality);
            setType(format);
          }} ></ProcessNodeCompress>
          <ProcessNodeScale scale={scale} onChange={(scale) => {
            setScale(scale);
          }} ></ProcessNodeScale>
          {originalImages.length > 0 && (
            <>
              <button className="image-tool__button" onClick={processImages}>
                开始处理 ({originalImages.length} 张图片)
              </button>
              <div style={{ marginTop: '16px', padding: '0 10px' }}>
                <Slider value={progress} />
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>原始图片</h3>
                  <DeleteOutlined
                    onClick={handleClearOriginal}
                    style={{ fontSize: '16px', cursor: 'pointer' }}
                  />
                </div>
                <div className="image-tool__list">
                  {originalImages.map((image) => (
                    <ProcessNodeDestination
                      key={image.id}
                      title={`原始图片 ${originalImages.findIndex(img => img.id === image.id) + 1}`}
                      image={image}
                      onDelete={() => handleDeleteOriginal(image)}
                    />
                  ))}
                </div>
              </div>
              {processedImages.length > 0 && (
                <div className="image-tool__preview-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>处理后图片</h3>
                    <DeleteOutlined
                      onClick={handleClearProcessed}
                      style={{ fontSize: '16px', cursor: 'pointer' }}
                    />
                  </div>
                  <div className="image-tool__list">
                    {processedImages.map((image) => (
                      <ProcessNodeDestination
                        key={image.id}
                        title={`处理后图片 ${processedImages.findIndex(img => img.id === image.id) + 1}`}
                        image={image}
                        onDelete={() => handleDeleteProcessed(image)}
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

export default Home;