// ABOUTME: Server-side account management logic with profile CRUD operations
// ABOUTME: Handles profile updates, sign out functionality, and authentication guards

import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { session, supabase } }) => {
	if (!session) {
		redirect(303, '/auth');
	}

	// Try to fetch user profile (this may not exist yet, which is fine)
	const { data: profile } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', session.user.id)
		.single();

	return {
		session,
		profile
	};
};

export const actions: Actions = {
	update: async ({ request, locals: { session, supabase } }) => {
		if (!session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const fullName = formData.get('fullName') as string;
		const username = formData.get('username') as string;
		const website = formData.get('website') as string;

		const updates = {
			id: session.user.id,
			full_name: fullName,
			username,
			website,
			updated_at: new Date().toISOString()
		};

		const { error } = await supabase.from('profiles').upsert(updates);

		if (error) {
			console.error('Profile update error:', error);
			return fail(500, {
				success: false,
				message: 'There was an error updating your profile. Please try again.'
			});
		}

		return {
			success: true,
			message: 'Profile updated successfully!'
		};
	},

	signout: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut();
		redirect(303, '/auth');
	}
};
