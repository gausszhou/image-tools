import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css';
import './styles/page-layout.css';
import './styles/gauss-ui/g-desc.css';
import './styles/gauss-ui/g-divider.css';
import './styles/gauss-ui/g-menu.css';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 