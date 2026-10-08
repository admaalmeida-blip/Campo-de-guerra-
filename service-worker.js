const CACHE_NAME = "forja-v12-0";
const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./assets/exercises/bench-press.webp",
  "./assets/exercises/bench-press-demo.webp",
  "./assets/exercises/back-squat.webp",
  "./assets/exercises/back-squat-demo.webp",
  "./assets/exercises/lat-pulldown.webp",
  "./assets/exercises/lat-pulldown-demo.webp"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => clients.claim()));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).then((response) => {
      if (event.request.method === "GET" && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      }
      return response;
    }).catch(() => caches.match(event.request))
  );
});
