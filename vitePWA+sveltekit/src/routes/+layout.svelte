<script lang="ts">
    import favicon from "$lib/assets/favicon.svg";
    import { pwaInfo } from "virtual:pwa-info";

    const webManifest = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : "");

    let { children } = $props();
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
