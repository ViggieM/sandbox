/// <reference lib="webworker" />

import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import { Queue } from "workbox-background-sync";
import { db } from "../lib/db";

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

const queue = new Queue("FetchMetadata");

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (
    event.request.method !== "POST" &&
    !url.pathname.includes("/api/fetch-metadata")
  ) {
    return;
  }

  const bgFetchMeta = async () => {
    try {
      const response = await fetch(event.request.clone());
      const meta = await response.clone().json();
      const { bookmarkId, ...data } = meta;
      console.log(bookmarkId, data);
      await db.bookmarks.update(bookmarkId, { meta: data });
      return response;
    } catch (error) {
      await queue.pushRequest({ request: event.request });
      return error;
    }
  };

  event.respondWith(bgFetchMeta());
});
