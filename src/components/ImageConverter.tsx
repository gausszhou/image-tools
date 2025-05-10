import React, { useState, useRef } from 'react';
import './ImageConverter.css';

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
  const [quality, setQuality] = useState<number>(80);
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentFileName = useRef<string>('');

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getImageDimensions = (dataUrl: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };
      img.src = dataUrl;
    });
  };

  const handleFile = async (file: File) => {
    try {
      setError('');
      setProgress(0);
      setStatus('准备转换...');

      if (!file.type.match('image.*')) {
        throw new Error('请选择有效的图片文件');
      }

      currentFileName.current = file.name;

      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        const dimensions = await getImageDimensions(dataUrl);

        setOriginalImage({
          url: dataUrl,
          name: file.name,
          size: file.size,
          dimensions
        });

        convertToWebP(dataUrl, dimensions);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理文件时发生错误');
    }
  };

  const convertToWebP = async (imageDataUrl: string, dimensions: { width: number; height: number }) => {
    try {
      setProgress(20);
      setStatus('正在转换...');

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('无法创建canvas上下文');
        }

        ctx.drawImage(img, 0, 0);
        setProgress(50);
        setStatus('编码WebP...');

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              throw new Error('转换失败，浏览器可能不支持WebP编码');
            }

            const webpUrl = URL.createObjectURL(blob);
            const webpName = currentFileName.current.replace(/\.[^/.]+$/, '') + '.webp';
            
            setWebpImage({
              url: webpUrl,
              name: webpName,
              size: blob.size,
              dimensions
            });

            setProgress(100);
            setStatus('转换完成!');

            setTimeout(() => {
              setProgress(0);
              setStatus('');
            }, 3000);
          },
          'image/webp',
          quality / 100
        );
      };

      img.src = imageDataUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : '转换过程中发生错误');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
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
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="container">
      <h1>Image Tools</h1>
      
      <div 
        className={`upload-area ${isDragging ? 'highlight' : ''}`}
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

      <div className="options">
        <h3>转换选项</h3>
        <div>
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
        <div className="progress-container">
          <progress value={progress} max="100" />
          <div className="status">{status}</div>
        </div>
      )}

      {error && <div className="error">{error}</div>}

      {originalImage && webpImage && (
        <div className="preview">
          <div className="preview-item">
            <h3>原始图片</h3>
            <img src={originalImage.url} alt="原始图片" className="preview-img" />
            <div className="file-info">
              {originalImage.name} ({formatFileSize(originalImage.size)})
              {originalImage.dimensions && 
                ` ${originalImage.dimensions.width}×${originalImage.dimensions.height}`}
            </div>
          </div>
          <div className="preview-item">
            <h3>WebP 图片</h3>
            <img src={webpImage.url} alt="WebP图片" className="preview-img" />
            <div className="file-info">
              {webpImage.name} ({formatFileSize(webpImage.size)})
              {webpImage.dimensions && 
                ` ${webpImage.dimensions.width}×${webpImage.dimensions.height}`}
            </div>
            <a href={webpImage.url} download={webpImage.name} className="download-btn">
              <button>下载 WebP 图片</button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageConverter; 