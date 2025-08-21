import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/global.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// PWA Service Worker 등록 및 자동 캐시 최신화 (TWA용)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
        
        // 서비스 워커 업데이트 감지
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('Service Worker update found!');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // 새로운 서비스 워커가 설치되었고, 현재 페이지가 서비스 워커에 의해 제어되고 있음
              console.log('New content is available; updating cache...');
              
              // TWA용: 사용자에게 알림 없이 자동으로 캐시 최신화
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          });
        });
        
        // 서비스 워커가 제어하는 페이지에서 새로운 서비스 워커가 활성화될 때
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('New service worker activated');
        });
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
  
  // 개발 중 강제 캐시 무효화를 위한 전역 함수 (개발용)
  if (process.env.NODE_ENV === 'development') {
    window.clearServiceWorkerCache = () => {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
        console.log('Cache clear message sent to service worker');
      }
    };
  }
}
