// Disables access to DOM typings like `HTMLElement` which are not available
// inside a service worker and instantiates the correct globals
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { offlineFallback } from 'workbox-recipes';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, setDefaultHandler, setCatchHandler } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { clientsClaim } from 'workbox-core';

declare let self: ServiceWorkerGlobalScope;

/**
 * Pre-cache assets and pre-rendered routes.
 * In dev mode, __WB_MANIFEST is undefined and might throw an error, so we default to an empty array.
 *
 * References:
 * - https://vite-pwa-org.netlify.app/guide/inject-manifest.html#service-worker-code
 * - https://stackoverflow.com/questions/66230023/multiple-instances-of-self-wb-manifest
 * */
precacheAndRoute(self.__WB_MANIFEST || []);

cleanupOutdatedCaches();

offlineFallback({
	pageFallback: '/offline'
});

/** Automatically take control over the windows*/
self.skipWaiting();
clientsClaim();

/** https://developer.chrome.com/docs/workbox/managing-fallback-responses/ */
// Use a stale-while-revalidate strategy to handle requests by default.
setDefaultHandler(new StaleWhileRevalidate());

// This "catch" handler is triggered when any of the other routes fail to
// generate a response.
setCatchHandler(async ({ request }) => {
	switch (request.destination) {
		default:
			// If we don't have a fallback, return an error response.
			return Response.error();
	}
});
