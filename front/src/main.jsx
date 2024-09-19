import React from 'react';  // Ajoutez cet import
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  // Importez BrowserRouter
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>  {/* Enveloppez App dans BrowserRouter */}
      <App />
    </BrowserRouter>
  </StrictMode>,
);
