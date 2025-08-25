<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	let { data, children } = $props();
	let { session, supabase } = data;

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-white">
	<!-- Simple navigation bar -->
	<nav class="border-b border-gray-200 bg-white">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 justify-between">
				<div class="flex items-center">
					<a href="/" class="text-xl font-bold text-gray-900"> Svelte + Supabase </a>
				</div>
				<div class="flex items-center space-x-4">
					{#if session}
						<span class="text-sm text-gray-700">
							Welcome, {session.user.email}
						</span>
						<a
							href="/account"
							class="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
						>
							Account
						</a>
					{:else}
						<a
							href="/auth"
							class="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
						>
							Sign In
						</a>
					{/if}
				</div>
			</div>
		</div>
	</nav>

	<!-- Main content -->
	<main>
		{@render children?.()}
	</main>
</div>
