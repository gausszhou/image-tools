import { Link, Route, HashRouter as Router, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import ImageCompose from './pages/ImageCompose';
import ImageCompress from './pages/ImageCompress';
import ImageRemoveBackground from './pages/ImageRemoveBackground';
import ImageScale from './pages/ImageScale';

function Sidebar() {
  const location = useLocation();
  return (
    <div className="layout__sidebar">
      <nav className="layout__nav g-menu second-level">
        <Link to="/" className={location.pathname === '/' ? 'g-menu-item is-active' : 'g-menu-item'}>首页</Link>
        <Link to="/compress" className={location.pathname === '/compress' ? 'g-menu-item is-active' : 'g-menu-item'}>图片压缩</Link>
        <Link to="/scale" className={location.pathname === '/scale' ? 'g-menu-item is-active' : 'g-menu-item'}>图片缩放</Link>
        <Link to="/remove-bg" className={location.pathname === '/remove-bg' ? 'g-menu-item is-active' : 'g-menu-item'}>去除背景</Link>
        <Link to="/compose" className={location.pathname === '/compose' ? 'g-menu-item is-active' : 'g-menu-item'}>拖拽组合</Link>
      </nav>
    </div>
  );
}

function AppHead() {
  return (
    <div className="layout__header">
      <div className="layout__dots">
        <span className="layout__dot layout__dot--red"></span>
        <span className="layout__dot layout__dot--yellow"></span>
        <span className="layout__dot layout__dot--green"></span>
      </div>
    </div>
  );
}

function AppMain() {
  return (
    <div className="layout__main">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/compress" element={<ImageCompress />} />
        <Route path="/scale" element={<ImageScale />} />
        <Route path="/remove-bg" element={<ImageRemoveBackground />} />
        <Route path="/compose" element={<ImageCompose />} />
      </Routes>
    </div>
  );
}

function AppBody() {
  return (
    <div className="layout__body">
      <Sidebar />
      <AppMain />
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="layout">
        <div className="layout__container">
          <div className="layout__container--inner">
            <AppHead />
            <AppBody />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;