import React from 'react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-welcome">
      <h1 className="page-title">欢迎使用 Image Tools</h1>
      <p className="home-description">在左侧选择你需要的图片工具</p>
    </div>
  );
};

export default Home;