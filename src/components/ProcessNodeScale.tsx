import { Radio } from 'antd';
import React from 'react';
import './ProcessNodeScale.css';

interface ScaleProps {
    scale: number;
    onChange: (scale: number) => void;
}

const ProcessNodeScale: React.FC<ScaleProps> = ({
    scale,
    onChange
}) => {
    const scaleOptions = [0.25, 0.5, 1, 2, 4];

    return (
        <div className="image-scale__controls">
            <div className="image-scale__dimensions">
                <Radio.Group 
                    value={scale} 
                    onChange={(e) => onChange(e.target.value)}
                >   
                    {scaleOptions.map((value) => (
                        <Radio className="image-scale__radio" key={value} value={value}>
                            {value}x
                        </Radio>
                    ))}
                </Radio.Group>
            </div>
        </div>
    );
};

export default ProcessNodeScale;