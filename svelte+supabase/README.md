# Svelte + Supabase Authentication

A modern SvelteKit application with Supabase authentication using magic links, server-side rendering, and Svelte 5 runes.

## Tech Stack
- **SvelteKit** - Full-stack framework with SSR
- **Supabase** - Backend-as-a-Service for auth and database
- **Tailwind CSS** - Styling framework
- **TypeScript** - Type safety

## Quick Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure Supabase:**
   - Update [`.env.local`](.env.local) with your Supabase project credentials
   - Get URL and anon key from your Supabase dashboard → Settings → API

3. **Start development:**
   ```bash
   pnpm run dev
   ```

## Architecture Overview

### Core Configuration
- **[`src/app.d.ts`](src/app.d.ts)** - TypeScript definitions for Supabase types and SvelteKit locals
- **[`src/hooks.server.ts`](src/hooks.server.ts)** - Server-side auth hooks with JWT validation using sequence pattern

### Layout & Client Setup
- **[`src/routes/+layout.server.ts`](src/routes/+layout.server.ts)** - Provides session data to all routes
- **[`src/routes/+layout.ts`](src/routes/+layout.ts)** - Browser/server Supabase client initialization with auth dependencies
- **[`src/routes/+layout.svelte`](src/routes/+layout.svelte)** - Main layout with navigation and auth state handling

### Authentication Flow
- **[`src/routes/auth/+page.svelte`](src/routes/auth/+page.svelte)** - Magic link login form (uses Svelte 5 runes)
- **[`src/routes/auth/+page.server.ts`](src/routes/auth/+page.server.ts)** - Server actions for sending magic links with email validation
- **[`src/routes/auth/callback/+server.ts`](src/routes/auth/callback/+server.ts)** - Processes magic link callbacks using `exchangeCodeForSession()`
- **[`src/routes/auth/auth-code-error/+page.svelte`](src/routes/auth/auth-code-error/+page.svelte)** - Error page for failed authentication

### Protected Routes
- **[`src/routes/account/+page.svelte`](src/routes/account/+page.svelte)** - User profile management (uses Svelte 5 runes with `$state()`)
- **[`src/routes/account/+page.server.ts`](src/routes/account/+page.server.ts)** - Profile CRUD operations and sign out functionality

## Authentication Flow

1. **User enters email** → Magic link sent via Supabase
2. **User clicks magic link** → Supabase processes and redirects to `/auth/callback` with `code`
3. **Callback handler** → Exchanges code for session using `exchangeCodeForSession()`
4. **Success** → Redirects to home page with active session
5. **Failure** → Redirects to `/auth/auth-code-error`

## Current Status

### ✅ Working
- Magic link authentication (sign up/sign in)
- Server-side session management with JWT validation
- Protected routes (redirects to auth if not logged in)
- Navigation with auth state
- Sign out functionality
- Modern Svelte 5 runes syntax throughout

### 🚧 Work in Progress
- **Account update form** - Profile updates currently don't work (needs database schema setup)

## Next Steps

1. **Set up profiles table in Supabase:**
   ```sql
   CREATE TABLE profiles (
     id uuid references auth.users on delete cascade,
     full_name text,
     username text unique,
     website text,
     updated_at timestamp with time zone,
     primary key (id)
   );
   ```

2. **Enable Row Level Security** and create policies for profile access
3. **Test profile update functionality** once database is configured

## Development Notes

- All `.svelte` files use Svelte 5 runes (`$props()`, `$state()`)
- Server-side authentication uses the modern `@supabase/ssr` package
- Magic links use PKCE flow with `exchangeCodeForSession()` method
- Linting configured with Prettier and ESLint

## Deployment Notes

To set up magic link authentication, you need to configure the [Supabase Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls).
This needs to be done in the project dashboard > Authentication > URL Configuration.
Here, you can change the default redirect URL, and add Redirect URLs.

### Troubleshooting

- error code `email_address_not_authorized`: Supabase's SMTP service allows sending emails only to predefined recipients, see https://supabase.com/docs/guides/auth/auth-smtp.
  This can be avoided if a private SMTP server is configured
- Authentication flow does not complete: Redirect URLs require a trailing slash, e.g. `https://example.com/` instead of `https://example.com`
