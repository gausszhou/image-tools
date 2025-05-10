import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="page-container">
      <h1>图片工具集</h1>
      <div className="tools-grid">
        <Link to="/compress" className="tool-card">
          <h2>图片压缩</h2>
          <p>将图片转换为 WebP 格式，支持质量调整</p>
        </Link>
        {/* 可以在这里添加更多工具卡片 */}
      </div>
    </div>
  );
};

export default Home; 