import React, { useState, useRef } from 'react';
import './ImageScale.css';
import { getImageDimensions } from '../utils';

interface ImageInfo {
  url: string;
  name: string;
  size: number;
  dimensions: {
    width: number;
    height: number;
  } | null;
}

const ImageScale: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageInfo | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockRatio, setLockRatio] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [scaledImageUrl, setScaledImageUrl] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const aspectRatio = useRef<number>(1);

  const processImage = async (file: File) => {
    try {
      setError('');
      
      const originalUrl = URL.createObjectURL(file);
      const dimensions = await getImageDimensions(originalUrl);

      if (dimensions) {
        setWidth(dimensions.width);
        setHeight(dimensions.height);
        aspectRatio.current = dimensions.width / dimensions.height;
      }

      setOriginalImage({
        url: originalUrl,
        name: file.name,
        size: file.size,
        dimensions
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理图片时出错');
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number(e.target.value);
    setWidth(newWidth);
    if (lockRatio) {
      setHeight(Math.round(newWidth / aspectRatio.current));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number(e.target.value);
    setHeight(newHeight);
    if (lockRatio) {
      setWidth(Math.round(newHeight * aspectRatio.current));
    }
  };

  const scaleImage = async () => {
    if (!originalImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置 canvas 尺寸
    canvas.width = width;
    canvas.height = height;

    // 创建临时图片对象
    const img = new Image();
    img.src = originalImage.url;
    img.onload = () => {
      // 在 canvas 上绘制缩放后的图片
      ctx.drawImage(img, 0, 0, width, height);
      
      // 将 canvas 转换为图片 URL
      const scaledUrl = canvas.toDataURL('image/png');
      setScaledImageUrl(scaledUrl);
    };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        processImage(file);
      } else {
        setError('请上传图片文件');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      processImage(file);
    }
  };

  return (
    <div className="image-scale">
      <h1 className="image-scale__title">图片缩放</h1>
      
      <div 
        className={`image-scale__upload ${isDragging ? 'image-scale__upload--dragging' : ''}`}
        onClick={handleUploadClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <h3>点击或拖放图片到此处</h3>
        <p>支持 JPG, PNG, GIF, BMP 等格式</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>

      {error && <div className="image-scale__error">{error}</div>}

      {originalImage && (
        <div className="image-scale__content">
          <div className="image-scale__controls">
            <div className="image-scale__dimensions">
              <div className="image-scale__input-group">
                <label htmlFor="width">宽度 (px):</label>
                <input
                  type="number"
                  id="width"
                  value={width}
                  onChange={handleWidthChange}
                  min="1"
                />
              </div>
              <div className="image-scale__input-group">
                <label htmlFor="height">高度 (px):</label>
                <input
                  type="number"
                  id="height"
                  value={height}
                  onChange={handleHeightChange}
                  min="1"
                />
              </div>
              <div className="image-scale__lock">
                <label>
                  <input
                    type="checkbox"
                    checked={lockRatio}
                    onChange={(e) => setLockRatio(e.target.checked)}
                  />
                  锁定纵横比
                </label>
              </div>
            </div>
            <button className="image-scale__button" onClick={scaleImage}>
              应用缩放
            </button>
          </div>
          
          <div className="image-scale__preview">
            <div className="image-scale__original">
              <h3>原始图片</h3>
              <img src={originalImage.url} alt="原始图片" />
              <div className="image-scale__info">
                {originalImage.name}
                {originalImage.dimensions && 
                  ` (${originalImage.dimensions.width}×${originalImage.dimensions.height})`}
              </div>
            </div>

            {scaledImageUrl && (
              <div className="image-scale__scaled">
                <h3>缩放后图片</h3>
                <img src={scaledImageUrl} alt="缩放后图片" />
                <div className="image-scale__info">
                  {`${width}×${height}`}
                </div>
                <a 
                  href={scaledImageUrl} 
                  download={originalImage.name.replace(/\.[^/.]+$/, '_scaled$&')}
                  className="image-scale__download"
                >
                  下载缩放后的图片
                </a>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      )}
    </div>
  );
};

export default ImageScale;