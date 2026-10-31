# CampusSignal

CampusSignal helps college students organize real opportunities, extract structured details from notices with AI, and find teammates who opt in to discovery.

## Features

- Email and password sign up/sign in with Supabase Auth and email confirmation.
- Student profiles and application tracking stored in Supabase PostgreSQL.
- Opportunity submissions saved to the shared database and labeled as user submitted.
- Gemini notice extraction and Gemma opportunity analysis and teammate explanations.
- Team discovery is visible only to signed-in students and only for profiles that opt in.
- Row level security scopes profile edits and saved opportunities to their owner.

The app has no demo records or in-memory data fallback. If Supabase or Google AI is not configured, the affected feature returns a setup error.

## Set up locally

1. Install packages and create the local environment file:

   ```powershell
   npm install
   Copy-Item .env.example .env.local
   ```

2. Set your own Supabase project URL, anon/publishable key, and Google AI Studio key in `.env.local`. The app does not need a Supabase service-role key.

3. In Supabase **SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql). This creates the account-linked tables, profile-on-signup trigger, and owner-scoped RLS policies. It does not add sample accounts or opportunities.

4. In Supabase **Authentication → URL Configuration**, allow the local callback URL `http://localhost:3001/auth/callback` (or `http://localhost:3000/auth/callback` if using the default port) and your deployed callback URL. Enable Email sign-in and keep email confirmation enabled.

5. Start the app:

   ```powershell
   npm run dev -- --port 3001
   ```

   Open `http://localhost:3001`, create an account, confirm the email, then complete your profile. Set profile discovery on only if you want to appear in Team Matcher.

## Environment variables

```env
GEMINI_API_KEY=your-google-ai-studio-api-key
GEMINI_MODEL=gemini-3.8-flash
GEMMA_MODEL=gemma-4-31b-it
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-or-publishable-key
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

Keep `.env.local` private. Never put a service-role key or an AI key in a `NEXT_PUBLIC_` variable.

## Commands

```powershell
npm run dev
npm run lint
npm run build
```

The current Google AI model IDs are listed in the [Google Gemini API model catalog](https://ai.google.dev/gemini-api/docs/models) and [Gemma API guide](https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api). Change them in `.env.local` if your project has different model access.
