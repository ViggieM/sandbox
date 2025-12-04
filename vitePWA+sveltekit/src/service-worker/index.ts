/// <reference lib="webworker" />

import { offlineFallback, warmStrategyCache } from "workbox-recipes";
import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  addRoute,
} from "workbox-precaching";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { registerRoute } from "workbox-routing";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import { clientsClaim, type RouteHandler } from "workbox-core";

declare let self: ServiceWorkerGlobalScope;

const matchCb = ({ url, request, event }) => {
  return url.pathname === "/dynamic";
};

const handlerCb: RouteHandler = async ({ url, request, event, params }) => {
  console.log("handlerCb", url);
  const response = await fetch(request);
  const responseBody = await response.text();
  return new Response(`${responseBody}`, {
    headers: response.headers,
  });
};

registerRoute(matchCb, handlerCb);

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
