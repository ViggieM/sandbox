---
id: task-1
title: Add route-based CSS classes to main layout element
status: Done
assignee: []
created_date: '2025-09-01 07:12'
updated_date: '2025-09-01 07:24'
labels: []
dependencies: []
---

## Description

Adds route-specific CSS classes to the main layout element using SvelteKit load functions.

### Implementation:

**src/routes/+layout.svelte:14**

```svelte
<main class={page.data?.mainClassName}>
```

**Layout load functions:**

- `src/routes/foo/+layout.ts` - returns `mainClassName: 'bg-accent'` (route-specific)
- Root layout may have no load function (therefore `mainClassName` may be undefined)

### How it works:

1. Layout load functions return `mainClassName` data
2. Child layouts override parent classes
3. Root layout applies classes to `<main>` element
4. Classes update automatically on navigation

Reference: https://svelte.dev/docs/kit/load#page.data
