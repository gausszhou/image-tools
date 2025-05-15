import { Select, Slider, Tooltip } from 'antd';
import React from 'react';
import './ProcessNodeCompress.css';
import { EnumImageType } from '../types/image';
import { InfoCircleOutlined } from '@ant-design/icons';

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
        <Tooltip title="注意：当输入格式为 PNG 格式时使用无损压缩，此项设置无效" color="#272727">
          <InfoCircleOutlined style={{ marginLeft: '4px', color: '#1677ff' }} />
        </Tooltip>
      </div>
      <div className="image-converter__quality">
        <label htmlFor="quality">文件格式:</label>
        <Select value={format} onChange={value => {
          onChange(quality, value);
        }}
          options={[
            { value: EnumImageType.SAME, label: '原格式' },
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