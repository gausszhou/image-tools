// 文件输入

import React, { useRef, useState } from 'react';
import './ProcessNodeSource.css';

interface SourceProps {
  onChange: (file: File) => void;
  onError: (e: Error) => void;
}

const ProcessNodeSource: React.FC<SourceProps> = ({
  onChange,
  onError
}) => {

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (file: File) => {
    if (file.type.startsWith('image/')) {
      onChange(file);
    } else {
      onError(new Error('请上传图片文件'));
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      onFileChange(file);
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
      onFileChange(file);
    }
  };

  return (
    <div className="process-node-source">
      <div
        className={`process-node-source__upload ${isDragging ? 'process-node-source__upload--dragging' : ''}`}
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
    </div>
  );
};

export default ProcessNodeSource;