const CACHE_NAME = 'sarampion-pwa-cache-v1.1';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './images/measles_virus_cover.png',
    './images/bg.png',
    './images/natural_history.png',
    './images/r0.png',
    './images/koplik_real.png',
    './images/exantema_real.png',
    './images/exantema.png',
    './images/vaccination.png',
    './images/rural.png'
];

// Evento de Instalación: Se ejecuta cuando se registra el Service Worker por primera vez.
// Aquí cacheamos todos los recursos declarados en `urlsToCache`.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierto y recursos guardados');
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento Fetch: Intercepta las solicitudes de red.
// Estrategia: "Cache First, fallback to Network".
// Intenta servir desde el caché primero para uso offline. Si no está, va a la red.
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si la respuesta está en caché, la devolvemos.
                if (response) {
                    return response;
                }
                // Si no, la pedimos a la red.
                return fetch(event.request);
            })
    );
});

// Evento Activate: Se ejecuta cuando el SW se activa.
// Útil para limpiar cachés antiguos si se actualiza la versión.
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
