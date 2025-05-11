import React from 'react';
import { ImageInfo } from '../types/image';
import { blobToBase64, copyToClipboard, formatFileSize } from '../utils';
import './ProcessNodeDestination.css';

interface DesinationProps {
    title: string; // 图片上方标题
    image: ImageInfo;
}

const ProcessNodeDestination: React.FC<DesinationProps> = ({
    title,
    image
}) => {

    const copyBase64 = async () => {
        const base64 = await blobToBase64(image.blob)
        copyToClipboard(base64)
    }
    const { url, name, size } = image;
    const { width, height } = image.dimensions;
    return (
        <div className="process-node-destination">
            <h3 className="destination-title">{title}</h3>
            <img className="destination-image" src={url} alt={title} />
            <div className="process-node-destination__file-info">
                <p><span className="file-info__label">文件名称</span><span className='file-name'>{name}</span></p>
                <p><span className="file-info__label">文件大小</span>{formatFileSize(size)}</p>
                <p><span className="file-info__label">图像宽高</span>{`${width} × ${height}`}</p>
            </div>
            <div className="process-node-destination__button-group">
                <a
                    href={url}
                    download={name}
                    className="process-node-destination__link"
                >
                    下载图片
                </a>
                <a href="javascript:;" onClick={copyBase64} className="process-node-destination__link">复制 Base64</a>
            </div>
        </div>
    );
};

export default ProcessNodeDestination;