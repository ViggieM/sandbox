/// <reference lib="webworker" />

import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { clientsClaim } from "workbox-core";

declare let self: ServiceWorkerGlobalScope;

// this makes sure all other assets are saved for offline use
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST || []);

// You need to include on your service worker at least this code
// https://vite-pwa-org.netlify.app/guide/inject-manifest.html#service-worker-code-2
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
    clientsClaim();
  }
});
