import './App.css';
import Home from './pages/Home';;

function AppHead() {
  return (
    <div className="layout__header">
      <div className="layout__dots">
        <span className="layout__dot layout__dot--red"></span>
        <span className="layout__dot layout__dot--yellow"></span>
        <span className="layout__dot layout__dot--green"></span>
      </div>
      <div className="layout__header-right">
        <h1 className="layout__header-title">欢迎使用图片工具箱，免费在线压缩您的WebP、JPEG和PNG图片，纯本地运行无需上传至服务器</h1>
      </div>
    </div>
  );
}

function AppMain() {
  return (
    <div className="layout__main">
      <Home />
    </div>
  );
}

function AppBody() {
  return (
    <div className="layout__body">
      <AppMain />
    </div>
  );
}

function App() {
  return (

    <div className="layout">
      <div className="layout__container">
        <div className="layout__container--inner">
          <AppHead />
          <AppBody />
        </div>
      </div>
    </div>

  );
}

export default App;