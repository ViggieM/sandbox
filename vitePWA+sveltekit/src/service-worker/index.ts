// src/service-worker/index.ts

import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST || []);

cleanupOutdatedCaches();

console.log("Worker installed!");
