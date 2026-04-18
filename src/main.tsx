import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// PWA Virtual Module (injected by vite-plugin-pwa)
// @ts-ignore
// import { registerSW } from 'virtual:pwa-register';

// Register Service Worker for offline support
// if ('serviceWorker' in navigator) {
//   registerSW({ immediate: true });
// }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
