<script lang="ts">
	let { data } = $props();
	let { session } = data;
</script>

<svelte:head>
	<title>Home - Svelte + Supabase</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-2xl text-center">
		<h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Svelte + Supabase</h1>
		<p class="mt-6 text-lg leading-8 text-gray-600">
			A modern full-stack application built with SvelteKit and Supabase. Features secure
			authentication, user profiles, and a beautiful interface powered by Tailwind CSS.
		</p>

		{#if session}
			<div class="mt-10 flex items-center justify-center gap-x-6">
				<a
					href="/account"
					class="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
				>
					Go to Account
				</a>
			</div>
		{:else}
			<div class="mt-10 flex items-center justify-center gap-x-6">
				<a
					href="/auth"
					class="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
				>
					Get Started
				</a>
				<a
					href="https://supabase.com/docs"
					target="_blank"
					class="text-base leading-6 font-semibold text-gray-900"
				>
					Learn more <span aria-hidden="true">→</span>
				</a>
			</div>
		{/if}
	</div>
</div>
