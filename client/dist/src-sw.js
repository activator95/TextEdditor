// Import necessary modules from Workbox
import { offlineFallback, warmStrategyCache } from 'workbox-recipes';
import { CacheFirst } from 'workbox-strategies';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute';

// Precache the resources in the service worker manifest
precacheAndRoute(self.__WB_MANIFEST || []);

// Create a cache strategy for pages
const pageCache = new CacheFirst({
cacheName: 'page-cache',
plugins: [
new CacheableResponsePlugin({
statuses: [0, 200],
}),
new ExpirationPlugin({
maxAgeSeconds: 30 * 24 * 60 * 60,
}),
],
});

// Preload certain URLs into the cache
warmStrategyCache({
urls: ['/index.html', '/'],
strategy: pageCache,
});

// Register a route for navigating pages using the pageCache strategy
registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// Register a route for caching assets such as stylesheets and scripts
registerRoute(
({ request }) => request.destination === 'style' || request.destination === 'script',
new CacheFirst({
cacheName: 'assets-cache',
plugins: [
new CacheableResponsePlugin({
statuses: [0, 200],
}),
new ExpirationPlugin({
maxEntries: 50,
maxAgeSeconds: 30 * 24 * 60 * 60,
}),
],
})
);