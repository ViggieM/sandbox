<!-- ABOUTME: Authentication error page for failed login attempts -->
<!-- ABOUTME: Displays error message and provides option to try again -->

<svelte:head>
	<title>Authentication Error - Svelte + Supabase</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8 text-center">
		<div>
			<h1 class="text-3xl font-bold tracking-tight text-red-900">Authentication Error</h1>
			<p class="mt-2 text-sm text-gray-600">
				There was a problem confirming your authentication. The link may have expired or already
				been used.
			</p>
		</div>

		<div class="mt-8">
			<a
				href="/auth"
				class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
			>
				Try again
			</a>
		</div>
	</div>
</div>
