// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Cria a raiz do React para o seu aplicativo no elemento com id 'root' no index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza o componente App dentro do StrictMode do React e do BrowserRouter
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Registro do Service Worker para suporte a PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registrado com sucesso:', registration);
      })
      .catch(error => {
        console.error('Falha ao registrar o Service Worker:', error);
      });
  });
}
