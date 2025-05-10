import React, { useState, useRef } from 'react';
import './ImageConverter.css';
import { formatFileSize, getImageDimensions, convertToWebP } from '../utils';

interface ImageInfo {
  url: string;
  name: string;
  size: number;
  dimensions: {
    width: number;
    height: number;
  } | null;
}

const ImageConverter: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageInfo | null>(null);
  const [webpImage, setWebpImage] = useState<ImageInfo | null>(null);
  const [base64Image, setBase64Image] = useState<string>('');
  const [quality, setQuality] = useState<number>(80);
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentFileName = useRef<string>('');

  const processImage = async (file: File) => {
    try {
      setProgress(0);
      setStatus('正在处理图片...');
      setError('');
      
      // 创建原始图片的 URL
      const originalUrl = URL.createObjectURL(file);
      const dimensions = await getImageDimensions(originalUrl);
  
      setOriginalImage({
        url: originalUrl,
        name: file.name,
        size: file.size,
        dimensions
      });
  
      // 转换为 WebP
      try {
        const result = await convertToWebP(originalUrl, dimensions, quality);
        
        setWebpImage({
          url: result.webpUrl,
          name: file.name.replace(/\.[^/.]+$/, '.webp'),
          size: result.blob.size,
          dimensions
        });
        setBase64Image(result.base64data);
        setProgress(100);
        setStatus('转换完成');
        setTimeout(() => setStatus(''), 3000);
      } catch (conversionError) {
        setError(conversionError instanceof Error ? conversionError.message : '转换失败');
        setStatus('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理图片时出错');
      setStatus('');
    }
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

  const copyBase64 = async () => {
    if (!base64Image) return;
    
    try {
      await navigator.clipboard.writeText(base64Image);
      setStatus('Base64 已复制到剪贴板');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setError('复制失败，请手动复制');
    }
  };

  return (
    <div className="image-converter">
      <div className="image-converter__header">
        <h1 className="image-converter__title">图片压缩</h1>
      </div>
      <div 
        className={`image-converter__upload ${isDragging ? 'image-converter__upload--dragging' : ''}`}
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

      <div className="image-converter__options">
        <h3>转换选项</h3>
        <div className="image-converter__quality">
          <label htmlFor="quality">质量 (0-100): </label>
          <input
            type="range"
            id="quality"
            min="0"
            max="100"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
          />
          <span>{quality}</span>
        </div>
      </div>

      {(progress > 0 || status) && (
        <div className="image-converter__progress">
          <progress value={progress} max="100" />
          <div className="image-converter__status">{status}</div>
        </div>
      )}

      {error && <div className="image-converter__error">{error}</div>}

      {originalImage && webpImage && (
        <div className="image-converter__preview">
          <div className="image-converter__preview-item">
            <h3>原始图片</h3>
            <img src={originalImage.url} alt="原始图片" className="image-converter__preview-img" />
            <div className="image-converter__file-info">
              {originalImage.name} ({formatFileSize(originalImage.size)})
              {originalImage.dimensions && 
                ` ${originalImage.dimensions.width}×${originalImage.dimensions.height}`}
            </div>
          </div>
          <div className="image-converter__preview-item">
            <h3>WebP 图片</h3>
            <img src={webpImage.url} alt="WebP图片" className="image-converter__preview-img" />
            <div className="image-converter__file-info">
              {webpImage.name} ({formatFileSize(webpImage.size)})
              {webpImage.dimensions && 
                ` ${webpImage.dimensions.width}×${webpImage.dimensions.height}`}
            </div>
            <a href={webpImage.url} download={webpImage.name} className="image-converter__download">
              <button>下载 WebP 图片</button>
            </a>
          </div>
          <div className="image-converter__preview-item">
            <h3>Base64 图片</h3>
            <img src={base64Image} alt="Base64图片" className="image-converter__preview-img" />
            <div className="image-converter__file-info">
              {webpImage?.name.replace('.webp', '.base64')} ({formatFileSize(base64Image.length)})
              {webpImage?.dimensions && 
                ` ${webpImage.dimensions.width}×${webpImage.dimensions.height}`}
            </div>
            <button onClick={copyBase64} className="image-converter__copy">复制 Base64</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageConverter;