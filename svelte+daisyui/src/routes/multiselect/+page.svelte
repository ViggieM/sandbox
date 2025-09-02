<script lang="ts">
	import MultiSelectTags from '$lib/components/MultiSelectTags.svelte';
	import { defaultTags, type TagData } from '$lib/data/defaultTags';
	import { SvelteSet } from 'svelte/reactivity';

	let tags = $state<TagData[]>([...defaultTags]);
	const selectedTags = new SvelteSet<string>();

	let tagName = $state('');
	let parentId = $state('');

	function addTag(e: SubmitEvent) {
		e.preventDefault();

		if (!tagName.trim()) return;

		const id = tagName.toLowerCase().replace(/\s+/g, '-');
		const newTag: TagData = {
			id,
			parentId: parentId || null,
			name: tagName.trim()
		};

		tags.push(newTag);

		// Clear form
		tagName = '';
		parentId = '';
	}
</script>

<div class="space-y-6">
	<!-- Add New Tag Form -->
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title">Add New Tag</h2>
			<form class="space-y-4" onsubmit={addTag}>
				<div class="form-control">
					<label class="label" for="tagName">
						<span class="label-text">Tag Name</span>
					</label>
					<input
						id="tagName"
						type="text"
						placeholder="Enter tag name"
						class="input-bordered input w-full"
						bind:value={tagName}
					/>
				</div>

				<div class="form-control">
					<label class="label" for="parentTag">
						<span class="label-text">Parent Tag</span>
					</label>
					<select id="parentTag" class="select-bordered select w-full" bind:value={parentId}>
						<option value="">None (Root Level)</option>
						{#each tags as tag (tag.id)}
							<option value={tag.id}>{tag.name}</option>
						{/each}
					</select>
				</div>

				<div class="card-actions">
					<button type="submit" class="btn btn-primary">Add Tag</button>
				</div>
			</form>
		</div>
	</div>

	<!-- Tag Selection -->
	<MultiSelectTags {tags} {selectedTags}></MultiSelectTags>
</div>
