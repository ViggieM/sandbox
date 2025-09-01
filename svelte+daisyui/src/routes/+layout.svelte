<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="flex items-center justify-center bg-primary p-4 text-neutral-content">Header</header>
<main class={page.data?.mainClassName}>
	{@render children?.()}
</main>
<footer class="flex items-center justify-center bg-secondary p-4 text-neutral">Footer</footer>
