import { Route, BrowserRouter as Router, Routes, Link, useLocation } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import ImageCompress from './pages/ImageCompress';

function Sidebar() {
  const location = useLocation();
  return (
    <div className="layout__sidebar">
      <nav className="layout__nav">
        <Link to="/" className={location.pathname === '/' ? 'layout__nav-link layout__nav-link--active' : 'layout__nav-link'}>首页</Link>
        <Link to="/compress" className={location.pathname === '/compress' ? 'layout__nav-link layout__nav-link--active' : 'layout__nav-link'}>图片压缩</Link>
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
    <Router basename="/image-tools/">
      <div className="layout">
        <div className="layout__container">
          <AppHead />
          <AppBody />
        </div>
      </div>
    </Router>
  );
}

export default App;