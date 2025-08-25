// ABOUTME: Server-side authentication logic for magic link email handling
// ABOUTME: Processes form submissions, validates emails, and triggers Supabase auth

import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { session } }) => {
	// If user is already authenticated, redirect to account page
	if (session) {
		redirect(303, '/account');
	}

	return { url: url.origin };
};

export const actions: Actions = {
	default: async (event) => {
		const {
			url,
			request,
			locals: { supabase }
		} = event;

		const formData = await request.formData();
		const email = formData.get('email') as string;

		// Basic email validation
		const validEmail = /^[\w\-.+]+@([\w-]+\.)+[\w-]{2,8}$/.test(email);
		if (!validEmail) {
			return fail(400, {
				errors: { email: 'Please enter a valid email address' },
				email
			});
		}

		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				// Redirect to the callback URL after email confirmation
				emailRedirectTo: `${url.origin}/auth/callback`
			}
		});

		if (error) {
			console.error('Auth error:', error);
			return fail(400, {
				success: false,
				email,
				message: 'There was an issue sending the magic link. Please try again.'
			});
		}

		return {
			success: true,
			message: 'Check your email for a magic link to log into the website!'
		};
	}
};
