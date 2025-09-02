<script lang="ts">
	// ABOUTME: Single tag selection component using radio buttons with Svelte 5 runes
	// ABOUTME: Optimized database-driven architecture with O(1) lookups and reactive maps

	import { SvelteMap } from 'svelte/reactivity';

	import type { TagData } from './defaultTags';

	// Reactive render tree for template
	interface RenderNode {
		tag: Tag;
		level: number;
		children: RenderNode[];
	}

	class Tag {
		readonly id: string;
		readonly parentId: string | null;
		readonly name: string;

		constructor(data: TagData) {
			this.id = data.id;
			this.parentId = data.parentId;
			this.name = data.name;
		}

		isRoot(): boolean {
			return this.parentId === null;
		}

		hasParent(parentId: string): boolean {
			return this.parentId === parentId;
		}

		getDisplayName(): string {
			return this.name;
		}
	}

	// Props - accepts database format tags and single selectedTag
	let { tags, selectedTag = $bindable() }: { tags: TagData[]; selectedTag: string | null } =
		$props();

	// Convert database data to Tag instances
	const tagInstances = $derived(tags.map((data) => new Tag(data)));

	// Reactive lookup maps using $derived.by for complex computations
	const tagMap = $derived.by(() => {
		const map = new SvelteMap<string, Tag>();
		tagInstances.forEach((tag) => map.set(tag.id, tag));
		return map;
	});

	const childrenMap = $derived.by(() => {
		const map = new SvelteMap<string, string[]>();
		tagInstances.forEach((tag) => {
			const parentId = tag.parentId || 'root';
			if (!map.has(parentId)) map.set(parentId, []);
			map.get(parentId)!.push(tag.id);
		});
		return map;
	});

	const renderTree = $derived.by(() => {
		const buildTree = (parentId: string | null, level = 0): RenderNode[] => {
			const childIds = childrenMap.get(parentId || 'root') || [];
			return childIds.map((id) => {
				const tag = tagMap.get(id)!;
				return {
					tag,
					level,
					children: buildTree(id, level + 1)
				};
			});
		};
		return buildTree(null);
	});

	function selectTag(tagId: string) {
		// Toggle selection - deselect if clicking the same tag, otherwise select it
		selectedTag = selectedTag === tagId ? null : tagId;
	}

	export function getSelectedTagDisplay(): Tag | null {
		return selectedTag ? tagMap.get(selectedTag) || null : null;
	}
</script>

<!-- Recursive component for rendering tree nodes -->
{#snippet tagNode(node: RenderNode, radioName: string)}
	{#if node.children.length > 0}
		<li>
			<details>
				<summary class={node.level === 0 ? 'font-medium' : 'text-sm'}>
					<span class="flex items-center gap-2">
						<label
							class="label cursor-pointer justify-start gap-2 p-0"
							onclick={(e) => e.stopPropagation()}
						>
							<input
								type="radio"
								name={radioName}
								class="radio radio-xs"
								checked={selectedTag === node.tag.id}
								onchange={() => selectTag(node.tag.id)}
							/>
							<span class="text-sm {node.level === 0 ? 'font-medium' : ''}">{node.tag.name}</span>
						</label>
					</span>
				</summary>
				<ul>
					{#each node.children as child (child.tag.id)}
						{@render tagNode(child, radioName)}
					{/each}
				</ul>
			</details>
		</li>
	{:else}
		<li>
			<label class="label cursor-pointer justify-start gap-2 p-2">
				<input
					type="radio"
					name={radioName}
					class="radio radio-xs"
					checked={selectedTag === node.tag.id}
					onchange={() => selectTag(node.tag.id)}
				/>
				<span class="text-sm">{node.tag.name}</span>
			</label>
		</li>
	{/if}
{/snippet}

<div class="w-80">
	<ul class="menu w-full overflow-y-auto rounded-box bg-base-200">
		{#each renderTree as node (node.tag.id)}
			{@render tagNode(node, 'select-tag-radio')}
		{/each}
	</ul>

	{#if selectedTag}
		{@const selectedTagObj = getSelectedTagDisplay()}
		{#if selectedTagObj}
			<div class="mt-4">
				<h4 class="mb-2 text-sm font-medium">Selected Tag:</h4>
				<div class="flex flex-wrap gap-1">
					<div class="badge gap-1 badge-primary">
						{selectedTagObj.name}
						<button class="btn btn-circle btn-ghost btn-xs" onclick={() => selectTag(selectedTag!)}>
							×
						</button>
					</div>
					<button
						class="btn ml-2 btn-ghost btn-xs"
						onclick={() => {
							selectedTag = null;
						}}
					>
						Clear Selection
					</button>
				</div>
			</div>
		{/if}
	{/if}
</div>
