import { Select, Slider, Tooltip } from 'antd';
import React from 'react';
import './ProcessNodeCompress.css';
import { EnumImageType } from '../types/image';
import { InfoCircleOutlined } from '@ant-design/icons';

interface CompressProps {
  quality: number;
  type: EnumImageType;
  onChange: (quality: number, format: EnumImageType) => void;
}

const ProcessNodeCompress: React.FC<CompressProps> = ({
  quality,
  type,
  onChange
}) => { 
  return (
    <div className="image-converter__options">
      <div className="image-converter__quality">
        <label htmlFor="quality">
          <span>图像质量</span>
          <Tooltip title="注意：PNG 格式使用 UPNG 压缩，JPEG/WEBP 格式使用 canvas.toBlob 压缩" color="#272727">
            <InfoCircleOutlined style={{ marginLeft: '4px', color: '#1677ff' }} />
          </Tooltip>
          <span className="ml-2x">:</span>
        </label>
        <Slider
          id="quality"
          min={0}
          max={100}
          value={quality}
          onChange={value => {
            onChange(value, type);
          }}
          tooltip={{ formatter: (value) => `${value}%` }}
          style={{ flex: 1, maxWidth: 300, margin: '0 8px' }}
        />
        <span>{quality}%</span>
      </div>
      <div className="image-converter__quality">
        <label htmlFor="quality">
          <span>文件格式</span>
          <Tooltip title="注意：SVG（非 Base64 编码） 最好保留 SVG 格式，相信我将矢量图转换为位图是一件愚蠢的事情" color="#272727">
            <InfoCircleOutlined style={{ marginLeft: '4px', color: '#1677ff' }} />
          </Tooltip>
          <span className="ml-2x">:</span>
        </label>
        <Select className="image-converter__select" style={{ width: '150px' }} value={type} onChange={value => {
          onChange(quality, value);
        }}
          options={[
            { value: EnumImageType.SAME, label: '原格式' },
            { value: EnumImageType.WEBP, label: 'WEBP' },
            { value: EnumImageType.JPEG, label: 'JPEG' },
            { value: EnumImageType.PNG, label: 'PNG' },
          ]}
        />
      </div>
    </div>
  );
};

export default ProcessNodeCompress;