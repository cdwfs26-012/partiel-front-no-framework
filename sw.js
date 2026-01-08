const CACHE_NAME = 'renov-cache-v1';

// On corrige les chemins en fonction de ton image
const ASSETS_TO_CACHE = [
    'index.html',
    'prestations.html',
    'manifest.json',
    'assets/css/style.css',
    'assets/js/script.js',
    'assets/js/slider.js',
    'assets/js/components/AvisComponent.js',
    'assets/data/avis.json',
    'assets/images/hero.jpg'
];

// Installation
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Stratégie de Cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});