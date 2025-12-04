<script lang="ts">
    import favicon from "$lib/assets/favicon.svg";
    import { pwaInfo } from "virtual:pwa-info";
    import { onMount } from "svelte";
    import { browser } from "$app/environment";

    const webManifest = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : "");

    let { children } = $props();

    onMount(async () => {
        /**
         * If you are using SSR in SvelteKit, you need to check whether you are
         * inside a browser context before registering the service worker.
         * Reference: https://vite-pwa-org.netlify.app/guide/auto-update.html#ssr-ssg.
         * */
        if (pwaInfo && browser) {
            // await import("./registerSW");
        }
    });
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html webManifest}
</svelte:head>

{@render children()}

{#await import('$lib/ReloadPrompt.svelte') then { default: ReloadPrompt }}
    <ReloadPrompt />
{/await}
