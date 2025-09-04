# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Package Manager**: pnpm (required - do not use npm or yarn)

```bash
# Development server
pnpm dev

# Production build
pnpm build

# Type checking
pnpm check              # One-time check
pnpm check:watch        # Watch mode

# Code quality
pnpm lint               # Prettier + ESLint
pnpm format             # Format code with Prettier

# Preview production build
pnpm preview
```

## Architecture Overview

### Tech Stack

- **Framework**: SvelteKit with Svelte 5
- **Styling**: Tailwind CSS v4 + DaisyUI component library
- **Build**: Vite
- **Language**: TypeScript throughout

### Project Structure

- **File-based routing**: Routes in `src/routes/` with co-located components
- **Layout system**: Grid-based with header/main/footer in `+layout.svelte`
- **Styling**: Global styles in `src/app.css`, custom CSS classes like `.tag-badge`
- **Assets**: Stored in `src/lib/assets/`

### State Management Patterns

**CRITICAL**: This project uses Svelte 5 runes - always prefer these over legacy patterns:

- `$state()` instead of `let` variables
- `$derived()` instead of `$:` reactive statements
- `SvelteMap` and `SvelteSet` for reactive collections
- `$derived.by()` for complex derived computations
- `$bindable()` for component props that can be mutated

### Component Architecture

- **Database-driven**: Components designed for real data, no mock implementations
- **Performance optimized**: Uses lookup maps and O(1) operations for complex data structures
- **Hierarchical patterns**: See `MultiSelectTags.svelte` for advanced tree-based selection logic

## Key Implementation Details

### CSS and Styling

- Uses Tailwind CSS v4 syntax in `app.css`
- DaisyUI provides component classes (`.btn`, `.badge`, `.menu`, etc.)
- Custom utilities defined globally (e.g. `.tag-badge` class)
- Grid layout with `grid-template-rows: auto 1fr auto` for page structure

### TypeScript Configuration

- Strict type checking enabled
- ESLint configured with TypeScript, Svelte, and Prettier integration
- Uses `svelte-check` for Svelte-specific type validation

### Route-Specific Features

- `/multiselect`: Hierarchical tag selection with indeterminate states
- `/clickable-rows`: Interactive table row patterns
- `/dnd`: Drag and drop implementations (in development)

## Development Notes

- Components include `ABOUTME:` comments explaining their purpose
- Route data can pass `mainClassName` for layout customization
- Prefers keyed `{#each}` blocks for performance
- No file extensions in imports (use `'$lib/foo'` not `'$lib/foo.ts'`)
