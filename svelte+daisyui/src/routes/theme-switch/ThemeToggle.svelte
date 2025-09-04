<script lang="ts">
	// ABOUTME: Theme toggle dropdown component using Svelte 5 runes
	// ABOUTME: Provides a select interface for switching between DaisyUI themes

	import { themes, type Theme } from '$lib/themes';
	import { getTheme, setTheme } from '$lib/stores/theme.svelte';

	let currentTheme = $derived(getTheme());

	function handleThemeChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const newTheme = target.value as Theme;
		setTheme(newTheme);
	}
</script>

<div class="form-control">
	<select
		class="select-bordered select select-sm"
		value={currentTheme}
		onchange={handleThemeChange}
	>
		{#each themes as theme (theme)}
			<option value={theme}>
				{theme.charAt(0).toUpperCase() + theme.slice(1)}
			</option>
		{/each}
	</select>
</div>
