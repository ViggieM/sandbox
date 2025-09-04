// ABOUTME: Client-side theme store using Svelte 5 runes for reactive state management
// ABOUTME: Handles theme persistence via localStorage and cookies with DOM updates

import { DEFAULT_THEME, isValidTheme, type Theme } from '$lib/themes';

let currentTheme = $state<Theme>(DEFAULT_THEME);

export function getTheme(): Theme {
	return currentTheme;
}

export function setTheme(newTheme: Theme): void {
	if (!isValidTheme(newTheme)) {
		console.warn(`Invalid theme: ${newTheme}`);
		return;
	}

	currentTheme = newTheme;

	if (typeof window !== 'undefined') {
		// Update DOM attribute immediately
		document.documentElement.setAttribute('data-theme', newTheme);

		// Save to localStorage
		window.localStorage.setItem('theme', newTheme);

		// Save to cookie with 1 year expiration
		const oneYear = 60 * 60 * 24 * 365;
		document.cookie = `theme=${newTheme}; max-age=${oneYear}; path=/; SameSite=Strict;`;
	}
}

export function initializeTheme(): void {
	if (typeof window === 'undefined') return;

	try {
		// Try to get theme from localStorage first
		const savedTheme = window.localStorage.getItem('theme');
		if (savedTheme && isValidTheme(savedTheme)) {
			currentTheme = savedTheme;
			return;
		}

		// Fall back to DOM attribute (server-rendered theme)
		const domTheme = document.documentElement.getAttribute('data-theme');
		if (domTheme && isValidTheme(domTheme)) {
			currentTheme = domTheme;
			return;
		}

		// Final fallback to default theme
		currentTheme = DEFAULT_THEME;
	} catch (error) {
		console.error('Error initializing theme:', error);
		currentTheme = DEFAULT_THEME;
	}
}
