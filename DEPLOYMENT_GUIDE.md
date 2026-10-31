# Deployment

## Supabase

1. Use a Supabase project and run [`supabase/schema.sql`](supabase/schema.sql) in SQL Editor.
2. Enable Email authentication and email confirmation.
3. Add both local and deployed `/auth/callback` URLs to Authentication URL Configuration.
4. Use the project URL and anon/publishable key in the app. Do not configure a service-role key; authenticated user sessions and RLS authorize database access.

The schema starts without seeded users or opportunities. A signup creates its own student profile. Students must opt in before their profile appears in Team Matcher. Users can edit only their own profile and saved-opportunity records.

## App environment

Set these variables in local `.env.local` or the deployment provider:

```env
GEMINI_API_KEY=your-google-ai-studio-api-key
GEMINI_MODEL=gemini-3.8-flash
GEMMA_MODEL=gemma-4-31b-it
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-or-publishable-key
NEXT_PUBLIC_APP_URL=https://your-app.example
```

Keep `.env.local` out of version control. Do not add secret keys to `NEXT_PUBLIC_` variables.

## Build and verify

```powershell
npm run lint
npm run build
npm run start
```

After deployment, create and confirm a student account, save a profile, enable profile discovery, submit a notice, and update an opportunity status. AI features require a working Google AI Studio key and access to the selected models. Without it, they return a configuration error instead of sample output.
