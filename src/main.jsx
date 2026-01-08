import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './globals.css';

const assetBase = window.__BYTEBANK_ASSET_BASE__ || 'http://localhost:9001';
import(`${assetBase}/bytebank-ui.js`);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
