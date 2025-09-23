# SvelteKit PWA

This is the SvelteKit starter project implemented as a PWA with the Vite-PWA plugin.

The documentation for the Vite-PWA plugin can be found here: [Getting Started | Guide | Vite PWA](https://vite-pwa-org.netlify.app/guide/)

The project was created using the usual `npx sv create my-app` command.

It takes the suggested implementation of the service worker in the SvelteKit documentation [Service workers • Docs • Svelte](https://svelte.dev/docs/kit/service-workers) and extends it with the Vite-PWA plugin.

## Install and minimal configuration of the vite-plugin-pwa

Source: https://vite-pwa-org.netlify.app/guide/#installing-vite-plugin-pwa

```bash
pnpm add -D vite-plugin-pwa
```

Then configure the plugin in `vite.config.ts`:

```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate'
		})
	]
});
```

> With this minimal configuration of the vite-plugin-pwa plugin, your application is now able to generate the Web App Manifest and inject it at the entry point, generate the service worker and register it in the browser.
> <br>
> [Getting Started | Guide | Vite PWA](https://vite-pwa-org.netlify.app/guide/#configuring-vite-plugin-pwa)

You will need to exclude the service worker registration from the SvelteKit configuration (the `serviceWorker: { register: false }` part), as described in https://vite-pwa-org.netlify.app/frameworks/sveltekit.html#generate-custom-service-worker

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: { adapter: adapter(), serviceWorker: { register: false } }
};

export default config;
```

## Configure the 'injectManifest' strategy

The injectManifest strategy allows you to control the service worker's behavior by providing a custom service worker script. This strategy is useful when you need more control over the service worker's behavior, such as when you want to cache specific resources or handle network requests differently.

If we take a look at the suggested Service worker implementation in the SvelteKit documentation, what it does is:

- creates a cache key based on the version of the service worker
- adds all build assets to the cache
- removes the cache with the outdated version
- responds with a cached asset response if available

Workbox handles caching different and simplifies the code.
To cache and serve assets, you can use this code:

```TypeScript
// src/service-worker/index.ts

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST || []);

cleanupOutdatedCaches();
```

What has changed between the two approaches?

<details>
<summary>
    <code>const self = globalThis.self as unknown as ServiceWorkerGlobalScope;</code> was changed to <code>declare let self: ServiceWorkerGlobalScope</code>
</summary>

The difference between these two approaches is:

`const self = globalThis.self as unknown as ServiceWorkerGlobalScope;`

- Creates a runtime variable assignment
- Performs type casting at compile time but doesn't change the actual global self
- You'd use this local 'self' variable instead of the global one
- More explicit but creates an extra variable

`declare let self: ServiceWorkerGlobalScope`

- TypeScript ambient declaration that tells the compiler the global self has this type
- No runtime code generated - purely for type checking
- Directly types the existing global 'self' object
- Cleaner approach that lets you use self directly without creating a new variable

The 'declare' approach is generally preferred in service worker files because it properly types the existing global scope without creating unnecessary runtime overhead.

</details>

<details>
<summary>
<code>precacheAndRoute</code> now handles what was previously done inside the 'install' event listener and 'fetch' event listener
</summary>

In dev mode, \_\_WB_MANIFEST is undefined, so we default to an empty array.
Notice that in dev mode, no assets will be cached.
You need to run `pnpm build && pnpm preview` in order to see in Dev Tools > Application window > Caches the cache key and the cached assets.

</details>

To configure the Vite PWA plugin to pick up this service worker, we need to use the injectManifest strategy.
The configuration would look like this:

```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			strategies: 'injectManifest',
			srcDir: 'src',
			filename: command === 'serve' ? 'service-worker/index.ts' : 'service-worker.js',

			// manifest: { ... }

			// https://vite-pwa-org.netlify.app/guide/development.html#plugin-configuration
			devOptions: {
				enabled: true,
				type: 'module'
			}
		})
	]
}));
```

We need to differentiate between the dev mode and preview mode now (`filename: command === 'serve' ? 'service-worker/index.ts' : 'service-worker.js'`)
since during development, `service-worker.js` does not exist, and you will get an error like:

```
ENOENT: no such file or directory, open '/home/victor/code/sandbox/pwa+svelte/src/service-worker.js'
```

## Extend the root `+layout.svelte`

```sveltehtml
<!-- src/routes/+layout.svelte -->

<script lang="ts">
  import { pwaInfo } from 'virtual:pwa-info';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

  let { children } = $props();
	const webManifest = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');

  onMount(async () => {
    /**
     * If you are using SSR in SvelteKit, you need to check whether you are
     * inside a browser context before registering the service worker.
     * Reference: https://vite-pwa-org.netlify.app/guide/auto-update.html#ssr-ssg.
     * */
    if (pwaInfo && browser) {
      import('./registerSW');
    }
	});
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html webManifest}
</svelte:head>
```

If you are, then the following script is imported and executed on service worker registration:

```typescript
// src/routes/registerSW.ts

import { useRegisterSW } from 'virtual:pwa-register/svelte';

useRegisterSW({
	onRegisteredSW(swScriptUrl, registration) {
		console.log(`SW Registered: ${registration}`);
	},
	onRegisterError(error) {
		console.log('SW registration error', error);
	},
  onNeedRefresh() {
		console.log(`SW needs refresh`);
	},
  onOfflineReady() {
		console.log(`SW was installed and is now ready to serve offline requests`);
	},
});
```

## What didn't work: PWA Assets

In the [Vite PWA documentation for SvelteKit](https://vite-pwa-org.netlify.app/frameworks/sveltekit.html#pwa-assets) it is mentioned that you could programmatically insert the link tags based on the Plugin configuration like this:

```sveltehtml
<!-- src/routes/+layout.svelte -->

<script lang="ts">
  // ...
  import { pwaAssetsHead } from 'virtual:pwa-assets/head';
  // ...
</script>

<svelte:head>
	{#if pwaAssetsHead.themeColor}
    <meta name="theme-color" content={pwaAssetsHead.themeColor.content} />
  {/if}
  {#each pwaAssetsHead.links as link, index (index)}
    <link {...link} />
  {/each}
</svelte:head>
```

but this didn't work for me, as neither `pwaAssetsHead.themeColor` was defined nor any `pwaAssetsHead.links`

## Service Worker Lifecycle

For traditional websites/SSR apps, each page navigation triggers a network request to the server.
The browser automatically checks for SW updates during these navigation requests.

One issue for service workers is that even though a new SW is detected and installed, it is not activated until either:

- All tabs/windows controlled by the old SW are closed, OR
- You explicitly call skipWaiting() in the new SW

To complicate matters even more, for SvelteKit Apps (or SPAs in general), navigation is client-side only.
That means no network requests and no automatic SW update checks.
The solution to this is to [manually trigger update checks](https://developer.chrome.com/docs/workbox/service-worker-lifecycle#manually_triggering_update_checks).
This can be done by setting an interval at which `registration.update()` is called periodically as described in the [Periodic SW Updates](https://vite-pwa-org.netlify.app/frameworks/svelte.html#periodic-sw-updates) section:

```typescript
// src/routes/registerSW.ts
import { useRegisterSW } from 'virtual:pwa-register/svelte';

const intervalMS = 60 * 60 * 1000; // 1 hour

useRegisterSW({
	onRegisteredSW(swScriptUrl, registration) {
		/* Periodically check for updates */
		if (registration) {
			setInterval(() => {
				registration.update();
			}, intervalMS);
		}
	},
});
```

When a new update is found, the new SW is registered, but not yet activated.
For this, we need to configure the [Auto Update Behavior](https://vite-pwa-org.netlify.app/guide/inject-manifest.html#auto-update-behavior):

```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			// ...
			registerType: 'autoUpdate'
      // ...
		})
	]
}));
```

And add the following code to your `service-worker/index.ts`:

```typescript
// service-worker/index.ts
import { clientsClaim } from 'workbox-core'

self.skipWaiting()
clientsClaim()
```

This will have the inconvenient effect that the browser tab will reload, and the user might lose data that he was currently typing in inside a form e.g.

An alternative would be to **prompt the user** to reload the page when an update is found.

```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			// ...
			registerType: 'prompt'  // default
      // ...
		})
	]
}));
```

Make sure to remove the `self.skipWaiting()` and `clientsClaim()` calls inside `service-worker/index.ts`, and you will see that the `onNeedRefresh` callback is called:

```typescript
// src/routes/registerSW.ts

import { useRegisterSW } from 'virtual:pwa-register/svelte';

const { updateServiceWorker, offlineReady, needRefresh } = useRegisterSW({
	// ...
  onNeedRefresh() {
		console.log(`SW needs refresh`);
    // call updateServiceWorker() with an event handler triggered e.g. by a button click
	},
  // ...
});
```

The `useRegisterSW` method returns an object with a `updateServiceWorker` method that can be called later by an event, such as a click event on a button.
The official guide for the integration of Vite PWA with SvelteKit actually offers a good example on how to implement a `ReloadPrompt.svelte` component: https://vite-pwa-org.netlify.app/frameworks/sveltekit.html#prompt-for-update

## Navigation preload

> In some situations, service worker boot-up time can delay a network response.
> <br>
> -- [Speed up service worker with navigation preloads  |  Blog  |  web.dev](https://web.dev/blog/navigation-preload#activate_navigation_preload)


## Troubleshooting

### ENOENT: no such file or directory, open '/home/victor/code/sandbox/pwa+svelte/src/service-worker.js'

I have encountered this when was attempting to implement the 'Prompt for update' feature as described in:

- https://vite-pwa-org.netlify.app/guide/prompt-for-update.html
- https://vite-pwa-org.netlify.app/frameworks/sveltekit.html#auto-update

It occurred when I introduced the `import { useRegisterSW } from 'virtual:pwa-register/svelte';` import in `registerSW.ts`.
To fix it, I had to modify the `vite.config.ts` to check whether we are in dev or preview mode, otherwise it would not find the compiled `service-worker.js` file.

```typescript
/** vite.config.ts */

export default defineConfig(({ command }) => ({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			// ...
			filename: command === 'serve' ? 'service-worker/index.ts' : 'service-worker.js'
			// ...
		})
	]
}));
```

An alternative for `command` would be to use the `process.env.NODE_ENV` variable instead:

```typescript
import process from 'node:process';

// then use
process.env.NODE_ENV === 'development';
```

### Cannot find module 'virtual:pwa-info' or its corresponding type declarations

There is an issue with TypeScript check that is also described here https://github.com/vite-pwa/sveltekit/issues/59.
I am not entirely sure, but it seems to occur with pnpm rather than npm.
What worked for me was adding the following imports in my `app.d.ts` file:

```typescript
// src/app.d.ts
import 'vite-plugin-pwa/svelte';
import 'vite-plugin-pwa/info';
```

and extend the `.npmrc` file:

```
engine-strict=true
resolution-mode=highest
auto-install-peers=true
shamefully-hoist=true
```

## Misc

### skipWaiting from 'workbox-core' is deprecated

Source: https://developer.chrome.com/docs/workbox/modules/workbox-core#the_skipwaiting_wrapper_is_deprecated



## Resources

- [Handling navigation requests  |  Articles  |  web.dev](https://web.dev/articles/handling-navigation-requests)
- [Speed up service worker with navigation preloads  |  Blog  |  web.dev](https://web.dev/blog/navigation-preload)
