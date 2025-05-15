import React, { useRef, useState } from 'react';
import './ProcessNodeSource.css';

interface SourceProps {
  onChange: (files: File[]) => void;
  onError: (e: Error) => void;
}

const ProcessNodeSource: React.FC<SourceProps> = ({
  onChange,
  onError
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = async (items: DataTransferItem[] | FileList) => {
    const images: File[] = [];
    const processItem = async (item: DataTransferItem | File) => {
      if (item instanceof File) {
        if (item.type.startsWith('image/')) {
          images.push(item);
        }
        return;
      }

      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry();
        if (entry && entry.isDirectory) {
          const dirReader = entry.createReader();
          const entries = await new Promise<FileSystemEntry[]>((resolve) => {
            dirReader.readEntries((entries) => resolve(entries));
          });

          for (const entry of entries) {
            if (entry.isFile) {
              const fileEntry = entry as FileSystemFileEntry;
              const file = await new Promise<File>((resolve) => {
                fileEntry.file((file) => resolve(file));
              });
              if (file.type.startsWith('image/')) {
                images.push(file);
              }
            }
          }
        } else if (entry && entry.isFile) {
          const fileEntry = entry as FileSystemFileEntry;
          const file = await new Promise<File>((resolve) => {
            fileEntry.file((file) => resolve(file));
          });
          if (file.type.startsWith('image/')) {
            images.push(file);
          }
        }
      }
    };

    if (items instanceof FileList) {
      await Promise.all(Array.from(items).map(processItem));
    } else {
      await Promise.all(Array.from(items).map(processItem));
    }

    if (images.length === 0) {
      onError(new Error('未找到图片文件'));
      return;
    }

    onChange(images);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const items = e.dataTransfer.items;
    if (items.length > 0) {
      await processFiles(items);
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      await processFiles(e.target.files);
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
        <h3>点击或拖放图片/文件夹到此处</h3>
        <p>支持 WebP, JPG, PNG 等格式</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          webkitdirectory=""
          directory=""
          multiple
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

export default ProcessNodeSource;