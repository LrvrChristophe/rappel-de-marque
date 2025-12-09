const CACHE_NAME = "rm-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", event => {
  console.log("Service Worker installing");

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/manifest.json",
        "/offline.html",
        "/rappel-des-marques-192.png",
        "/rappel-des-marques-512.png",        
         "/app.js",
         "/main.css",
        "/respons.css"
        // ajoute tes fichiers CSS / JS ici
      ]);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  console.log("Service Worker activating");

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return (
        resp ||
        fetch(event.request).catch(() =>
          caches.match(OFFLINE_URL)
        )
      );
    })
  );
});

