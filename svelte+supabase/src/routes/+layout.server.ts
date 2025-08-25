// ABOUTME: Server layout for session management and data dependency handling
// ABOUTME: Provides session data to all child routes and sets up auth dependencies

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { session }, cookies }) => {
	return {
		session,
		cookies: cookies.getAll()
	};
};
