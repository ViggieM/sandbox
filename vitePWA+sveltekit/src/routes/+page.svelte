<script>
    import {
        getNeedsRefresh,
        getUpdateServiceWorker,
    } from "$lib/stores/sw.svelte";

    async function handleUpdate() {
        const updateFn = getUpdateServiceWorker();
        if (updateFn) {
            await updateFn(true); // Pass true to reload the page after update
        }
    }
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="/blog">blog</a></p>
<p>Visit <a href="/dynamic">dynamic page</a></p>

{#if getNeedsRefresh()}
    <p>Page needs refresh</p>
    <button onclick={handleUpdate}>Update</button>
{/if}
