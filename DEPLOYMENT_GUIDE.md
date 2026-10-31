# CampusSignal AI — Production Deployment Guide
## Deploying to Vercel & Supabase with Google AI Studio

This guide provides end-to-end instructions for deploying CampusSignal AI to a publicly accessible production URL on **Vercel** with a managed **Supabase PostgreSQL** database and **Google Gemini / Gemma AI Studio** endpoints.

---

## 1. Prerequisites

1. **GitHub Account**: To host the repository.
2. **Vercel Account**: [vercel.com](https://vercel.com) for edge hosting.
3. **Supabase Account**: [supabase.com](https://supabase.com) for PostgreSQL database.
4. **Google AI Studio API Key**: [aistudio.google.com](https://aistudio.google.com) for Gemini and Gemma inference.

---

## 2. Supabase Database Configuration

1. Log in to [Supabase](https://supabase.com/dashboard) and click **New Project**.
2. Name your project `campussignal-ai` and set a strong database password.
3. Select an AWS region close to your target audience (e.g., `ap-south-1` Mumbai for India).
4. Navigate to the **SQL Editor** in the left sidebar.
5. Open the `supabase/schema.sql` file in this repository, copy its full contents, paste into the Supabase SQL editor, and click **Run**.
6. Verify the following 4 tables are created:
   * `students`
   * `opportunities`
   * `saved_opportunities`
   * `team_matches`
7. Navigate to **Project Settings** -> **API** and copy:
   * **Project URL**: `https://<your-project-id>.supabase.co`
   * **anon public key**: `eyJhbGciOi...`
   * **service_role secret key**: `eyJhbGciOi...` (keep confidential)

---

## 3. Google AI Studio Configuration

1. Go to [Google AI Studio](https://aistudio.google.com).
2. Click **Get API key** and generate a new key for your project.
3. Note your key: `GEMINI_API_KEY`.
4. Supported & verified model identifiers:
   * **Gemini (Multimodal Notice Intelligence)**: `gemini-2.5-flash` or `gemini-1.5-flash`
   * **Gemma (Lightweight classification & match rationale)**: `gemma-2-9b-it`, `gemma-2-27b-it`, or `gemma-4-31b-it` (depending on your regional quota).

---

## 4. Local Environment Testing

Create a `.env.local` file in the root directory:

```env
# Google AI Studio Configuration
GEMINI_API_KEY=your_google_ai_studio_api_key_here
GEMINI_MODEL=gemini-2.5-flash
GEMMA_MODEL=gemma-2-9b-it

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# App URL Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Run the development server:
```bash
npm run dev
```

Verify the local application at `http://localhost:3000`.

---

## 5. Deploying to Vercel

### Method A: Deploy via GitHub (Recommended)

1. Push your local repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of CampusSignal AI"
   git branch -M main
   git remote add origin https://github.com/<your-username>/campussignal-ai.git
   git push -u origin main
   ```
2. In the Vercel Dashboard, click **Add New...** -> **Project**.
3. Import your `campussignal-ai` repository.
4. Framework Preset: **Next.js** (auto-detected).
5. Expand **Environment Variables** and enter:
   * `GEMINI_API_KEY`
   * `GEMINI_MODEL` (`gemini-2.5-flash`)
   * `GEMMA_MODEL` (`gemma-2-9b-it`)
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * `SUPABASE_SERVICE_ROLE_KEY`
6. Click **Deploy**. Vercel will build and assign a production URL (e.g. `https://campussignal-ai.vercel.app`).

### Method B: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
vercel --prod
```

---

## 6. Post-Deployment Verification Checklist

Once deployed, execute the 3 core user journeys on the live production URL:

- [ ] **Journey 1: Notice Intelligence**
  - Navigate to `/notice-intelligence`.
  - Click "Try Demo Notice" or upload a hackathon poster.
  - Confirm Gemini multimodal extraction returns structured JSON within 3 seconds.
  - Verify fields can be edited in the preview form.
  - Click "Save to Opportunity Radar" and verify toast notification.

- [ ] **Journey 2: Opportunity Radar**
  - Navigate to `/radar`.
  - Filter by category ("Hackathons", "Internships").
  - Click on an opportunity card to view details.
  - Test the Gemma AI relevance explanation drawer.
  - Click "Bookmark" and check status transitions (`Interested` -> `Applied`).

- [ ] **Journey 3: AI Team Matcher**
  - Navigate to `/team-matcher`.
  - Enter a collaboration prompt (e.g., *"Looking for Python FastAPI developer and UI/UX designer for AI hackathon"*).
  - Click "Find Teammates".
  - Verify deterministic compatibility score calculation.
  - Verify Gemma-generated natural language match explanation.

- [ ] **60-Second Judge Demo Mode**
  - From the top navigation or hero, click **"Try Live Demo (60s Flow)"**.
  - Execute the step-by-step demo checklist seamlessly.
