<script lang="ts">
	// ABOUTME: Theme switching demonstration page showing all available DaisyUI themes
	// ABOUTME: Features theme toggle component and live preview of current theme

	import { themes, type Theme } from '$lib/themes';
	import { getTheme, setTheme } from '$lib/stores/theme.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	let currentTheme = $derived(getTheme());
</script>

<div class="container mx-auto max-w-4xl p-6">
	<div class="mb-8">
		<h1 class="mb-4 text-4xl font-bold">Theme Switch</h1>
		<p class="mb-6 text-lg opacity-70">
			Switch between different DaisyUI themes. Your selection is saved and will persist across
			browser sessions.
		</p>

		<div class="mb-6 alert alert-info">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="h-6 w-6 shrink-0 stroke-current"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				></path></svg
			>
			<div>
				<div class="font-semibold">Current theme: {currentTheme}</div>
				<div class="text-sm">Theme changes apply instantly and are saved automatically.</div>
			</div>
		</div>
	</div>

	<div class="grid gap-8 lg:grid-cols-2">
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Theme Selector</h2>
				<p class="mb-4">Choose from {themes.length} available DaisyUI themes:</p>
				<ThemeToggle />
			</div>
		</div>

		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Theme Preview</h2>
				<p class="mb-4">Live preview of current theme colors:</p>

				<div class="mb-4 grid grid-cols-2 gap-2">
					<div class="rounded bg-primary p-3 text-center text-sm text-primary-content">Primary</div>
					<div class="rounded bg-secondary p-3 text-center text-sm text-secondary-content">
						Secondary
					</div>
					<div class="rounded bg-accent p-3 text-center text-sm text-accent-content">Accent</div>
					<div class="rounded bg-neutral p-3 text-center text-sm text-neutral-content">Neutral</div>
				</div>

				<div class="flex flex-wrap gap-2">
					<button class="btn btn-sm btn-primary">Primary</button>
					<button class="btn btn-sm btn-secondary">Secondary</button>
					<button class="btn btn-sm btn-accent">Accent</button>
					<button class="btn btn-ghost btn-sm">Ghost</button>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-8">
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Available Themes</h2>
				<p class="mb-4">All {themes.length} DaisyUI themes available in this application:</p>

				<div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
					{#each themes as theme (theme)}
						<button
							class="btn btn-outline btn-sm {currentTheme === theme ? 'btn-active' : ''}"
							onclick={() => setTheme(theme)}
						>
							{theme.charAt(0).toUpperCase() + theme.slice(1)}
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
