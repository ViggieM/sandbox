<script lang="ts">
	// ABOUTME: Multi-level hierarchical tag selection component using Svelte 5 runes
	// ABOUTME: Optimized database-driven architecture with O(1) lookups and reactive maps
	import { SvelteMap, SvelteSet } from 'svelte/reactivity';

	import type { TagData } from './defaultTags';

	// Reactive render tree for template
	interface RenderNode {
		tag: Tag;
		level: number;
		checkboxState: 'checked' | 'indeterminate' | 'unchecked';
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

	// Props - accepts database format tags
	let { tags, selectedTags = $bindable() }: { tags: TagData[]; selectedTags: SvelteSet<string> } =
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

	// Pre-compute ancestor chains for O(1) lookups
	const ancestorMap = $derived.by(() => {
		const map = new SvelteMap<string, string[]>();
		tagInstances.forEach((tag) => {
			const ancestors: string[] = [];
			let current = tag.parentId;
			while (current && tagMap.get(current)) {
				ancestors.push(current);
				current = tagMap.get(current)!.parentId;
			}
			map.set(tag.id, ancestors);
		});
		return map;
	});

	// Pre-compute descendant chains for O(1) lookups
	const descendantMap = $derived.by(() => {
		const map = new SvelteMap<string, string[]>();
		const getDescendants = (tagId: string): string[] => {
			const children = childrenMap.get(tagId) || [];
			const descendants = [...children];
			children.forEach((childId) => {
				descendants.push(...getDescendants(childId));
			});
			return descendants;
		};

		tagInstances.forEach((tag) => {
			map.set(tag.id, getDescendants(tag.id));
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
					checkboxState: getCheckboxState(id),
					children: buildTree(id, level + 1)
				};
			});
		};
		return buildTree(null);
	});

	function toggleTag(tagId: string) {
		if (selectedTags.has(tagId)) {
			// Deselecting: remove tag and all descendants
			selectedTags.delete(tagId);
			descendantMap.get(tagId)?.forEach((id) => selectedTags.delete(id));
		} else {
			// Selecting: add tag, remove descendants and ancestors
			selectedTags.add(tagId);
			descendantMap.get(tagId)?.forEach((id) => selectedTags.delete(id));
			ancestorMap.get(tagId)?.forEach((id) => selectedTags.delete(id));
		}
	}

	function getCheckboxState(tagId: string): 'checked' | 'indeterminate' | 'unchecked' {
		if (selectedTags.has(tagId)) return 'checked';

		// Check if any descendants are selected
		const descendants = descendantMap.get(tagId) || [];
		const hasSelectedDescendants = descendants.some((id) => selectedTags.has(id));

		return hasSelectedDescendants ? 'indeterminate' : 'unchecked';
	}

	export function getSelectedTagsDisplay(): Tag[] {
		return Array.from(selectedTags)
			.map((id) => tagMap.get(id)!)
			.filter(Boolean);
	}
</script>

<!-- Recursive component for rendering tree nodes -->
{#snippet tagNode(node: RenderNode)}
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
								type="checkbox"
								class="checkbox checkbox-xs"
								checked={node.checkboxState === 'checked'}
								indeterminate={node.checkboxState === 'indeterminate'}
								onchange={() => toggleTag(node.tag.id)}
							/>
							<span class="text-sm {node.level === 0 ? 'font-medium' : ''}">{node.tag.name}</span>
						</label>
					</span>
				</summary>
				<ul>
					{#each node.children as child (child.tag.id)}
						{@render tagNode(child)}
					{/each}
				</ul>
			</details>
		</li>
	{:else}
		<li>
			<label class="label cursor-pointer justify-start gap-2 p-2">
				<input
					type="checkbox"
					class="checkbox checkbox-xs"
					checked={selectedTags.has(node.tag.id)}
					onchange={() => toggleTag(node.tag.id)}
				/>
				<span class="text-sm">{node.tag.name}</span>
			</label>
		</li>
	{/if}
{/snippet}

<div class="w-80">
	<ul class="menu w-full overflow-y-auto rounded-box bg-base-200">
		{#each renderTree as node (node.tag.id)}
			{@render tagNode(node)}
		{/each}
	</ul>

	{#if selectedTags.size > 0}
		<div class="mt-4">
			<h4 class="mb-2 text-sm font-medium">Selected Tags:</h4>
			<div class="flex flex-wrap gap-1">
				{#each getSelectedTagsDisplay() as tag (tag.id)}
					<!-- .tag-badge is defined in app.css -->>
					<div class="tag-badge">
						{tag.name}
						<button onclick={() => toggleTag(tag.id)}> × </button>
					</div>
				{/each}
				<button
					class="btn ml-2 btn-ghost btn-xs"
					onclick={() => {
						selectedTags.clear();
					}}
				>
					Clear All
				</button>
			</div>
		</div>
	{/if}
</div>
