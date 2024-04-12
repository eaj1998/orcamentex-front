// service-worker.js

// Define a unique cache name
const cacheName = 'tubo-oeste';

// List of assets to be cached
const assetsToCache = [
  '/',
  '/index.html',
  '/src/main.ts', // Update with the path to your app's JavaScript bundle
  '/src/scss/style.scss', // Update with the path to your app's CSS bundle
  // Add any other static assets (images, fonts, etc.) that you want to cache
];

// Event listener to install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(assetsToCache))
      .then(() => self.skipWaiting())
  );
});

// Event listener to activate service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== cacheName) {
            return caches.delete(name);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Event listener to intercept fetch requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
