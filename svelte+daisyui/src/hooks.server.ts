// ABOUTME: Server-side hooks for theme cookie handling and FOWT prevention
// ABOUTME: Processes theme cookies and injects theme data into HTML before client rendering

import type { Handle } from '@sveltejs/kit';
import { isValidTheme } from '$lib/themes';

export const handle: Handle = async ({ event, resolve }) => {
	const theme = event.cookies.get('theme');

	if (!theme || !isValidTheme(theme)) {
		return resolve(event);
	}

	return resolve(event, {
		transformPageChunk: ({ html }) => {
			return html.replace('data-theme=""', `data-theme="${theme}"`);
		}
	});
};
