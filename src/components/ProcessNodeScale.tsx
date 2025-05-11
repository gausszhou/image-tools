import { InputNumber, Checkbox } from 'antd';
import React, { Ref } from 'react';
import './ProcessNodeScale.css';

interface CompressProps {
    width: number;
    height: number;
    aspectRatio: number;
    lockRatio: boolean;
    onChange: (width: number, height: number, lockRatio: boolean) => void;
}

const ProcessNodeScale: React.FC<CompressProps> = ({
    width,
    height,
    aspectRatio,
    lockRatio,
    onChange
}) => {
    return (
        <div className="image-scale__controls">
            <div className="image-scale__dimensions">
                <div className="image-scale__input-group">
                    <label htmlFor="width">分辨率宽度:</label>
                    <InputNumber
                        id="width"
                        value={width}
                        onChange={(value) => {
                            const newWidth = Number(value || 0);
                            newWidth;
                            let newHeight = height;
                            if (lockRatio) {
                                newHeight = Math.round(newWidth / aspectRatio);
                            }
                            onChange(newWidth, newHeight, lockRatio);
                        }}
                        min={1}
                        precision={0}
                        style={{ width: 100 }}
                    />
                    <span>PX</span>
                </div>
                <div className="image-scale__input-group">
                    <label htmlFor="width">分辨率高度:</label>
                    <InputNumber
                        id="height"
                        value={height}
                        onChange={(value) => {
                            const newHeight = Number(value || 0);
                            let newWidth = width;
                            if (lockRatio) {
                                newWidth = (Math.round(newHeight * aspectRatio));
                            }
                            onChange(newWidth, newHeight, lockRatio);
                        }}
                        min={1}
                        precision={0}
                        style={{ width: 100 }}
                    />
                    <span>PX</span>
                </div>
                <div className="image-scale__lock">
                    <label>
                        锁定纵横比:
                    </label>
                    <Checkbox
                        className='image-scale__checkbox'
                        checked={lockRatio}
                        onChange={(e) => {
                            onChange(width, height, e.target.checked)
                        }}
                    />
                </div>
            </div>

        </div>
    );
};

export default ProcessNodeScale;