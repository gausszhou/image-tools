import React from 'react';
import { ImageInfo } from '../types/image';
import { blobToBase64, copyToClipboard, formatFileSize } from '../utils';
import './ProcessNodeDestination.css';

interface DesinationProps {
    title: string;
    image: ImageInfo;
    onDelete: () => void;
}

const ProcessNodeDestination: React.FC<DesinationProps> = ({
    title,
    image,
    onDelete
}) => {
    const copyBase64 = async () => {
        const base64 = await blobToBase64(image.blob)
        copyToClipboard(base64)
    }
    const { url, name, size } = image;
    const { width, height } = image.dimensions;
    return (
        <div className="process-node-destination">
            <div className="destination-image-container">
                <img className="destination-image" src={url} alt={title} />
            </div>
            <div className="process-node-destination__file-info">
                <p>{name}</p>
                <p>{formatFileSize(size)} </p>
                <p>{`${width} × ${height}`}</p>
            </div>
            <div className="process-node-destination__button-group">
                <a
                    href={url}
                    download={name}
                    className="process-node-destination__link"
                    title="下载图片"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                </a>
                <a 
                    href="javascript:;" 
                    onClick={copyBase64} 
                    className="process-node-destination__link"
                    title="复制 Base64"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                </a>
                <a 
                    href="javascript:;" 
                    onClick={onDelete} 
                    className="process-node-destination__link"
                    title="删除"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                </a>
            </div>
        </div>
    );
};

export default ProcessNodeDestination;