// ABOUTME: Notifications store with Svelte 5 runes for toast management
// ABOUTME: Provides reactive state and utility functions for toast notifications

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
	id: string;
	message: string;
	type: ToastType;
	timestamp: number;
}

export const toasts = $state<Toast[]>([]);

export function addToast(message: string, type: ToastType) {
	const toast: Toast = {
		id: crypto.randomUUID(),
		message,
		type,
		timestamp: Date.now()
	};

	toasts.push(toast);

	// Auto-remove after 5 seconds
	setTimeout(() => {
		removeToast(toast.id);
	}, 5000);
}

export function removeToast(id: string) {
	const index = toasts.findIndex((toast) => toast.id === id);
	if (index > -1) {
		toasts.splice(index, 1);
	}
}
