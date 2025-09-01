<script lang="ts">
	import MultiSelectTags from '$lib/components/MultiSelectTags.svelte';
	import { defaultTags } from '$lib/data/defaultTags.js';
	import { SvelteSet } from 'svelte/reactivity';

	const selectedTags = new SvelteSet<string>();
</script>

<MultiSelectTags tags={defaultTags} {selectedTags}></MultiSelectTags>
