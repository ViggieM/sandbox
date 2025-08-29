# TODO

Future improvements

## Social Authentication

Task:
Add also a social authentication option.
Create separate routes for login with magic link and login with e.g. Google auth, so the code inside @svelte+supabase/src/routes/auth is not cluttered.
Update the @svelte+supabase/README.md to include this second setup option.

References:
- [Setting up Server-Side Auth for SvelteKit | Supabase Docs](https://supabase.com/docs/guides/auth/server-side/sveltekit)
- [How to setup supabase locally with OAUTH providers | Alberto Sadde](https://www.albertosadde.com/blog/local-auth-with-subapase/)
- [Login with Google | Supabase Docs](https://supabase.com/docs/guides/auth/social-login/auth-google).

## Account update form

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
