<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { initializeTheme } from '$lib/stores/theme.svelte';

	let { children } = $props();

	$effect(() => {
		initializeTheme();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header>Header</header>
<main class={page.data?.mainClassName}>
	{@render children?.()}
</main>
<footer class={page.data?.footerClassName}>Footer</footer>
