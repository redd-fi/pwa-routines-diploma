const CACHE_NAME = 'my-pwa-cache-v4';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/routine.js',
    '/steps-drag-drop.js',
    '/manifest.json'
];

// Optional files that may not exist yet – cache them only if available
const optionalFiles = [
    '/login.html',
    '/signup.html',
    '/profile.html',
    '/auth.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async cache => {
            // Cache required files
            await cache.addAll(urlsToCache);
            
            // Try to cache optional files (don't fail if missing)
            for (const file of optionalFiles) {
                try {
                    const response = await fetch(file);
                    if (response.ok) {
                        await cache.put(file, response);
                    }
                } catch (error) {
                    console.log(`Optional file not cached: ${file}`);
                }
            }
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});