// ABOUTME: Theme configuration for DaisyUI theme switching system
// ABOUTME: Provides type-safe theme constants and validation utilities

export const themes = [
	'light',
	'dark',
	'cupcake',
	'bumblebee',
	'emerald',
	'corporate',
	'synthwave',
	'retro',
	'cyberpunk',
	'valentine',
	'halloween'
] as const;

export type Theme = (typeof themes)[number];

export const DEFAULT_THEME: Theme = 'light';

export function isValidTheme(theme: string): theme is Theme {
	return themes.includes(theme as Theme);
}
