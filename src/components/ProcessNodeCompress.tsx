import { Select, Slider } from 'antd';
import React from 'react';
import './ProcessNodeCompress.css';
import { EnumImageType } from '../types/image';

interface CompressProps {
  quality: number;
  format: EnumImageType;
  onChange: (quality: number, format: EnumImageType) => void;
}

const ProcessNodeCompress: React.FC<CompressProps> = ({
  quality,
  format,
  onChange
}) => {
  return (
    <div className="image-converter__options">
      <div className="image-converter__quality">
        <label htmlFor="quality">图像质量:</label>
        <Slider
          id="quality"
          min={0}
          max={100}
          value={quality}
          onChange={value => {
            onChange(value, format);
          }}
          tooltip={{ formatter: (value) => `${value}%` }}
          style={{ flex: 1, maxWidth: 300, margin: '0 8px' }}
        />
        <span>{quality}%</span>
      </div>
      <div className="image-converter__quality">
        <label htmlFor="quality">文件格式:</label>
        <Select value={format} onChange={value => {
          onChange(quality, value);
        }}
          options={[
            { value: EnumImageType.WEBP, label: 'WEBP' },
            { value: EnumImageType.JPEG, label: 'JPEG' },
            { value: EnumImageType.PNG, label: 'PNG' },
          ]}
          style={{ width: 120 }}
        />
      </div>
    </div>
  );
};

export default ProcessNodeCompress;