const CACHE_NAME = 'gnss-logger-v1';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.9.0/proj4.js'
];

// Εγκατάσταση Service Worker και αποθήκευση αρχείων στην Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ενεργεία και καθαρισμός παλιών caches αν υπάρξουν ενημερώσεις
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.claim();
});

// Διαχείριση αιτημάτων (Fetch): Προσπάθεια από cache, αν δεν υπάρχει από internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Fallback offline συμπεριφορά αν χρειαστεί
      });
    })
  );
});