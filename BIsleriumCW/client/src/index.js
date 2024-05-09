import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// Use createRoot instead of ReactDOM.render
createRoot(document.getElementById('root')).render(<App />);
