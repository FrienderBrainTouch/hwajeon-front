// 배포 시마다 이 버전을 변경하여 캐시 무효화
const CACHE_NAME = 'hwajeon-music-main-2b57477-20250821';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// Service Worker 설치
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Cache addAll failed:', error);
      })
  );
  // 새로운 서비스 워커가 즉시 활성화되도록 강제
  self.skipWaiting();
});

// Service Worker 활성화
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // 모든 클라이언트에 새로운 서비스 워커 적용
      return self.clients.claim();
    })
  );
});

// 네트워크 요청 가로채기 - Network First 전략
self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // 네트워크 우선 전략 적용
  event.respondWith(
    fetch(request)
      .then((response) => {
        // 네트워크 요청이 성공하면 캐시에 저장
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // 네트워크 요청이 실패하면 캐시에서 가져오기
        return caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              console.log('Serving from cache:', request.url);
              return cachedResponse;
            }
            // 캐시에도 없으면 기본 오류 페이지 반환
            return new Response('Network error', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain',
              }),
            });
          });
      })
  );
});

// 메시지 리스너 - 강제 캐시 무효화를 위한 API
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('Clearing cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
    );
  }
});
