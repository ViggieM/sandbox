<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="flex items-center justify-center bg-primary p-4 text-neutral-content">Header</header>
<main class="">
	{@render children?.()}
</main>
<footer class="flex items-center justify-center bg-secondary p-4 text-neutral">Footer</footer>
