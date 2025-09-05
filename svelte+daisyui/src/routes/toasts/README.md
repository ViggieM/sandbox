# Toast Notifications

A minimal toast notification system built with Svelte 5 runes and DaisyUI components.

## Architecture

The toast system is split into three parts:

- **Store**: `src/lib/stores/notifications.svelte.ts` - Reactive state management
- **Display Component**: `Notifications.svelte` - Toast rendering and positioning  
- **Demo Page**: `+page.svelte` - Example usage with trigger buttons

## Store Implementation

Uses Svelte 5 runes for optimal reactivity:

```typescript
export const toasts = $state<Toast[]>([]);

export function addToast(message: string, type: ToastType) {
  // Creates toast with auto-removal after 5 seconds
}

export function removeToast(id: string) {
  // Manual removal for close button
}
```

### Toast Interface

```typescript
export interface Toast {
  id: string;          // Unique identifier (crypto.randomUUID())
  message: string;     // Display text
  type: ToastType;     // 'info' | 'success' | 'warning' | 'error'
  timestamp: number;   // Creation time (Date.now())
}
```

## Components

### Notifications.svelte

Handles toast display with:
- DaisyUI toast positioning (`toast` class)
- Conditional alert styling using `class:` directive
- Manual close buttons with × symbol
- Keyed `{#each}` blocks for proper reactivity

```svelte
<div class="toast">
  {#each toasts as toast (toast.id)}
    <div class="alert" class:alert-{type}={toast.type === type}>
      <span>{toast.message}</span>
      <button onclick={() => removeToast(toast.id)}>✕</button>
    </div>
  {/each}
</div>
```

### +page.svelte

Demo page with trigger buttons for each toast type:
- Info (blue)
- Success (green) 
- Warning (yellow)
- Error (red)

## Usage

```typescript
import { addToast } from '$lib/stores/notifications.svelte';

// Trigger different toast types
addToast('Operation completed!', 'success');
addToast('Something went wrong', 'error');
```

## Features

- ✅ Auto-removal after 5 seconds
- ✅ Manual close with × button
- ✅ Multiple toast stacking
- ✅ DaisyUI styling with proper color variants
- ✅ Svelte 5 runes for optimal performance
- ✅ TypeScript throughout
- ✅ Proper `class:` directive usage (no string interpolation)

## Design Decisions

- **Direct state export**: `toasts` exported directly rather than through getter function
- **Array mutations**: Using `push()` and `splice()` for efficient `$state` updates
- **Component separation**: Display logic separated from trigger logic
- **Auto-cleanup**: Prevents memory leaks with setTimeout cleanup