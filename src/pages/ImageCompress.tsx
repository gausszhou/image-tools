import React, { useState, useRef } from 'react';
import { Slider, Select } from 'antd';
import './ImageCompress.css';
import { formatFileSize, getImageDimensions, compressImage } from '../utils';

interface ImageInfo {
  url: string;
  name: string;
  size: number;
  dimensions: {
    width: number;
    height: number;
  } | null;
}

const ImageCompress: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageInfo | null>(null);
  const [webpImage, setWebpImage] = useState<ImageInfo | null>(null);
  const [base64Image, setBase64Image] = useState<string>('');
  const [quality, setQuality] = useState<number>(80);
  const [format, setFormat] = useState<string>('webp');
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = async (file: File) => {
    try {

      setStatus('图片已就绪...');
      setError('');

      const originalUrl = URL.createObjectURL(file);
      const dimensions = await getImageDimensions(originalUrl);

      setOriginalImage({
        url: originalUrl,
        name: file.name,
        size: file.size,
        dimensions
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理图片时出错');
      setStatus('');
    }
  };

  const convertImage = async () => {
    if (!originalImage) return;

    try {
      setStatus('开始转换');
      setError('');
      const result = await compressImage(originalImage.url, originalImage.dimensions!, quality, format);

      setWebpImage({
        url: result.webpUrl,
        name: originalImage.name.replace(/\.[^/.]+$/, '.' + format),
        size: result.blob.size,
        dimensions: originalImage.dimensions
      });
      setBase64Image(result.base64data);
      setStatus('转换完成');
    } catch (conversionError) {
      setError(conversionError instanceof Error ? conversionError.message : '转换失败');
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
    } catch (err) {
      setError('复制失败，请手动复制');
    }
  };

  return (
    <div className="image-converter">
      <h1 className="image-converter__title">图片压缩</h1>
      <div className="image-converter__body">
        <div className="image-converter__input">
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
            <div className="image-converter__quality">
              <label htmlFor="quality">图像质量:</label>
              <Slider
                id="quality"
                min={0}
                max={100}
                value={quality}
                onChange={setQuality}
                tooltip={{ formatter: (value) => `${value}%` }}
                style={{ flex: 1, maxWidth: 300, margin: '0 8px' }}
              />
              <span>{quality}%</span>
            </div>
            <div className="image-converter__quality">
              <label htmlFor="quality">文件格式:</label>
              <Select value={format} onChange={setFormat}
                options={[
                  { value: 'webp', label: 'WebP' },
                  { value: 'jepg', label: 'JPEG' },
                  { value: 'png', label: 'PNG' },
                ]}
                style={{ width: 120 }}
              />
            </div>
          </div>
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


          {originalImage && webpImage && (
            <div className="image-converter__preview">
              <div className="image-converter__preview-item">
                <h3>原始图片</h3>
                <img src={originalImage.url} alt="原始图片" className="image-converter__preview-img" />
                <div className="image-converter__file-info">
                  <span>{originalImage.name} </span>
                  <span style={{ fontWeight: 700 }}>({formatFileSize(originalImage.size)})</span>
                  {originalImage.dimensions &&
                    ` ${originalImage.dimensions.width}×${originalImage.dimensions.height}`}
                </div>
              </div>
              <div className="image-converter__preview-item">
                <h3>压缩后图片</h3>
                <img src={webpImage.url} alt="WebP图片" className="image-converter__preview-img" />
                <div className="image-converter__file-info">
                  <span>{webpImage.name}</span>
                  <span style={{ fontWeight: 700 }}>({formatFileSize(webpImage.size)})</span>
                  {webpImage.dimensions &&
                    ` ${webpImage.dimensions.width}×${webpImage.dimensions.height}`}
                </div>
                <div>
                  <a href={webpImage.url} download={webpImage.name} className="image-converter__download">
                    <button>下载图片</button>
                  </a>
                  <button onClick={copyBase64} className="image-converter__copy">复制 Base64</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ImageCompress;