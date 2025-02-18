const { urlsToCache } = require("./urlsToCache");

importScripts('assets/lib/cache-polyfill.js');
const CACHE_NAME = 'mi-app-cache-v1';

// Instalar el Service Worker y cachear los archivos
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

// Activar el Service Worker y limpiar el caché antiguo
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.map(cacheName => {
                    if (CACHE_NAME !== cacheName) {
                        return caches.delete(cacheName);
                    }
                })
            )
        )
    );
    self.clients.claim();
});

// Interceptar las solicitudes de red y responder desde el caché
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
