<!-- ABOUTME: Magic link authentication page with email form and server actions -->
<!-- ABOUTME: Handles login/signup flow with enhanced form validation and user feedback -->

<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	let { form } = $props();

	let loading = $state(false);

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			update();
			loading = false;
		};
	};
</script>

<svelte:head>
	<title>Authentication - Svelte + Supabase</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<h1 class="text-3xl font-bold tracking-tight text-gray-900">Welcome</h1>
			<p class="mt-2 text-sm text-gray-600">Sign in via magic link with your email below</p>
		</div>

		<form class="mt-8 space-y-6" method="POST" use:enhance={handleSubmit}>
			{#if form?.message}
				<div
					class="rounded-md p-4 {form?.success
						? 'border border-green-200 bg-green-50 text-green-800'
						: 'border border-red-200 bg-red-50 text-red-800'}"
				>
					{form.message}
				</div>
			{/if}

			<div>
				<label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
					placeholder="your@email.com"
					value={form?.email ?? ''}
				/>
				{#if form?.errors?.email}
					<p class="mt-1 text-sm text-red-600">{form.errors.email}</p>
				{/if}
			</div>

			<div>
				<button
					type="submit"
					disabled={loading}
					class="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
				>
					{loading ? 'Loading...' : 'Send magic link'}
				</button>
			</div>
		</form>

		<div class="text-center text-sm text-gray-600">
			<p>No account needed! We'll create one for you automatically.</p>
		</div>
	</div>
</div>
