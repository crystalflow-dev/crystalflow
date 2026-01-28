import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// Import ReactFlo CSS
import '../../react/src/components/Node/CustomNode.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
