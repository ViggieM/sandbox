<!-- ABOUTME: User account management page with profile editing and sign out functionality -->
<!-- ABOUTME: Protected route that displays user information and allows profile updates -->

<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	let { data, form } = $props();
	let { session, profile } = data;

	let profileForm = $state() as HTMLFormElement;
	let loading = $state(false);

	let fullName = $state(profile?.full_name ?? '');
	let username = $state(profile?.username ?? '');
	let website = $state(profile?.website ?? '');

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async () => {
			loading = false;
		};
	};

	const handleSignOut: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
		};
	};
</script>

<svelte:head>
	<title>Account - Svelte + Supabase</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-md space-y-8">
		<div class="text-center">
			<h1 class="text-3xl font-bold tracking-tight text-gray-900">Your Account</h1>
			<p class="mt-2 text-sm text-gray-600">Manage your profile information</p>
		</div>

		{#if form?.message}
			<div
				class="rounded-md p-4 {form?.success
					? 'border border-green-200 bg-green-50 text-green-800'
					: 'border border-red-200 bg-red-50 text-red-800'}"
			>
				{form.message}
			</div>
		{/if}

		<form
			class="space-y-6 rounded-lg bg-white p-6 shadow"
			method="post"
			action="?/update"
			use:enhance={handleSubmit}
			bind:this={profileForm}
		>
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
				<input
					id="email"
					type="text"
					value={session.user.email}
					disabled
					class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-gray-500"
				/>
			</div>

			<div>
				<label for="fullName" class="block text-sm font-medium text-gray-700">Full Name</label>
				<input
					id="fullName"
					name="fullName"
					type="text"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
					bind:value={fullName}
				/>
			</div>

			<div>
				<label for="username" class="block text-sm font-medium text-gray-700">Username</label>
				<input
					id="username"
					name="username"
					type="text"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
					bind:value={username}
				/>
			</div>

			<div>
				<label for="website" class="block text-sm font-medium text-gray-700">Website</label>
				<input
					id="website"
					name="website"
					type="url"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
					bind:value={website}
				/>
			</div>

			<div>
				<button
					type="submit"
					disabled={loading}
					class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
				>
					{loading ? 'Updating...' : 'Update Profile'}
				</button>
			</div>
		</form>

		<form method="post" action="?/signout" use:enhance={handleSignOut} class="text-center">
			<button
				type="submit"
				disabled={loading}
				class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
			>
				Sign Out
			</button>
		</form>
	</div>
</div>
