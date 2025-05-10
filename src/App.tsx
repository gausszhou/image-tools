import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import ImageCompress from './pages/ImageCompress';

function App() {
  return (
    <Router basename="/image-tools">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/compress" element={<ImageCompress />} />
      </Routes>
    </Router>
  );
}

export default App; 