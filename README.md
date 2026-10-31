# CampusSignal AI 🎓🚀
### "Never Miss an Opportunity. Find Your People. Build Something Real."

[![Dual AI: Gemini + Gemma](https://img.shields.io/badge/Dual_AI-Gemini_2.5_Flash_+_Gemma-blueviolet.svg)](#gemini--gemma-integration)
[![Stack](https://img.shields.io/badge/Stack-Next.js_15_•_TypeScript_•_Tailwind_•_Supabase-blue.svg)](#technical-architecture)
[![Prompt Injection Safe](https://img.shields.io/badge/Security-Untrusted_Boundary_Guard-emerald.svg)](#security--prompt-injection-defense)

**CampusSignal AI** is an AI-powered campus opportunity intelligence and team formation platform engineered specifically for Indian college ecosystems. It transforms unstructured, chaotic campus notices (WhatsApp forwards, circular PDFs, notice board posters) into high-fidelity structured opportunities using **Gemini Multimodal Intelligence**, surfaces them on a prioritized **Smart Opportunity Radar**, and algorithmically pairs students with complementary peers using a deterministic scoring engine backed by **Gemma** natural language explanations.

---

## ⚡ 60-Second Judge Demonstration Script

Follow this fast-track checklist to evaluate the complete end-to-end product in under 60 seconds:

```
[00:00 - 00:10] 1. Open Landing Page / Dashboard
               • Click "Try Live Demo (60s Flow)" in the navigation bar.
               • Select the "DevSprint Hackathon" WhatsApp forward sample.

[00:10 - 00:25] 2. Test AI Notice Intelligence (Gemini 2.5 Flash)
               • Notice is loaded inside the untrusted boundary guard.
               • Click "Extract Structured Intelligence".
               • Watch Gemini extract title, category, deadline, eligibility, and required skills.
               • Notice how missing info is marked "Unknown" and no deadlines are hallucinated.

[00:25 - 00:35] 3. Validate & Publish to Radar
               • Review the editable form (edit any field or add a skill tag).
               • Click "Save to Opportunity Radar".
               • Confetti celebration confirms real-time database insertion.

[00:35 - 00:45] 4. Explore Smart Opportunity Radar (Gemma AI Insights)
               • Navigate to /radar.
               • Click "Gemma AI Rationale" on any opportunity card.
               • Toggle between English and conversational Hinglish ("हिन्दी / Hinglish").
               • Check application status toggle (Interested -> Applied).

[00:45 - 00:60] 5. Test AI Team Matcher (Deterministic + Gemma Synergy)
               • Open /team-matcher.
               • Click the 1-click chip: "AI Hackathon: Frontend + UI/UX".
               • Observe the deterministic mathematical compatibility score (e.g. 92%).
               • Read Gemma's plain-language rationale explaining exact technical synergy.
               • Click "Send Hackathon Invite".
```

---

## 🧠 Gemini + Gemma AI Integration

Both models have real, separated responsibilities within CampusSignal AI:

### 1. Google Gemini 2.5 Flash (`gemini-2.5-flash`)
* **Role**: Multimodal visual perception, document OCR, and structured JSON generation.
* **Input Types**: High-res poster graphics, scanned notices, PDF documents, and raw text.
* **Prompt Injection Defense**: All user notices are strictly sandboxed inside `<UNTRUSTED_CAMPUS_DOCUMENT_PAYLOAD>` tags with explicit guard instructions neutralizing embedded malicious overrides.
* **Schema Validation**: Outputs are strictly parsed and typed through runtime Zod schemas.

### 2. Google Gemma (`gemma-2-9b-it` / `gemma-4-31b-it`)
* **Role**: Vernacular simplification, student career fit, and transparent team matching justifications.
* **Relevance Engine**: Synthesizes 2-sentence actionable explanations of why an opportunity matters to specific engineering branches.
* **Bilingual Support**: Generates instant conversational Hinglish/Hindi translations for inclusive access across Indian state universities.
* **Explainable Matching**: Converts deterministic Jaccard scores into clear partnership recommendations.

*Configurable Model Adapters*: Both models are dynamically controlled via environment variables (`GEMINI_MODEL`, `GEMMA_MODEL`) with clear diagnostics and graceful heuristic fallbacks if API keys or quotas are unconfigured during local evaluation.

---

## 🛠️ Technical Architecture

* **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Framer Motion, Canvas Confetti.
* **Backend**: Serverless Next.js API Routes (`/api/ai/*`, `/api/opportunities`, `/api/students`, `/api/team-match`).
* **Validation**: Zod runtime schema validation.
* **Database**: Supabase PostgreSQL with Row Level Security (RLS) policies, composite indexing, and in-memory dual-mode fallback.
* **Deployment**: Vercel Serverless Edge + Supabase Cloud.

---

## 📂 Project Structure

```
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   ├── extract-notice/route.ts      # Gemini multimodal notice OCR
│   │   │   ├── classify-opportunity/route.ts # Gemma opportunity relevance
│   │   │   └── match-explanation/route.ts   # Gemma team match rationale
│   │   ├── opportunities/route.ts          # CRUD & status tracker
│   │   ├── students/route.ts               # Student profile data
│   │   └── team-match/route.ts             # Deterministic match engine
│   ├── dashboard/page.tsx                  # Student Command Center
│   ├── notice-intelligence/page.tsx        # Feature 1: AI Notice Intelligence
│   ├── radar/page.tsx                      # Feature 2: Smart Opportunity Radar
│   ├── team-matcher/page.tsx               # Feature 3: AI Team Matcher
│   ├── profile/page.tsx                    # Student Profile & Skill Tags
│   ├── layout.tsx                          # Dark Navy Theme & Meta
│   ├── page.tsx                            # Premium Landing Page
│   └── globals.css                         # Glassmorphism & custom glow
├── components/
│   ├── Navbar.tsx                          # Global Nav & Fast-Track Trigger
│   ├── Footer.tsx                          # Footer & System Health Status
│   ├── DemoModal.tsx                       # 60s Fast-Track Modal Wizard
│   └── GemmaRelevanceModal.tsx             # Gemma vernacular explanation modal
├── lib/
│   ├── ai/
│   │   ├── config.ts                       # AI Model registry & key validator
│   │   ├── gemini.ts                       # Gemini multimodal client & parser
│   │   ├── gemma.ts                        # Gemma model adapter & Hinglish
│   │   └── matcher.ts                      # Deterministic scoring algorithm
│   ├── data/
│   │   ├── mock-data.ts                    # Realistic Indian campus seed data
│   │   └── store.ts                        # Dual-mode Supabase/Memory store
│   ├── schemas.ts                          # Zod runtime schemas
│   └── utils.ts                            # Date & deadline countdown helpers
├── supabase/
│   └── schema.sql                          # Complete PostgreSQL DDL & Seeds
├── ARCHITECTURE.md                         # Detailed system design
├── CAMPUSSIGNAL_PRODUCT_ANALYSIS.md        # Pros, Cons & Competitor Analysis
├── DEPLOYMENT_GUIDE.md                     # Step-by-step Vercel & Supabase guide
└── .env.example                            # Environment variables template
```

---

## 🔒 Security & Prompt Injection Defense

1. **Untrusted Data Boundaries**: Campus notices often contain informal text, untrusted links, or potential prompt injection strings. All documents are wrapped in boundary tags and treated strictly as inert data.
2. **Deterministic URL Validation**: Registration URLs are validated against URL schemas and flagged if unverified.
3. **No Hallucinated Deadlines**: When a deadline or eligibility is absent from a notice, the engine marks it as `Unknown` rather than fabricating dates.
4. **Zero PII Collection**: CampusSignal explicitly avoids collecting Aadhaar numbers, bank information, phone numbers, or passwords.

---

## 🚀 Quick Local Setup

1. **Clone & Install Dependencies**:
   ```bash
   git clone https://github.com/<your-username>/campussignal-ai.git
   cd campussignal-ai
   npm install
   ```

2. **Configure Environment Variables**:
   ```bash
   cp .env.example .env.local
   ```
   Add your Google AI Studio API key:
   ```env
   GEMINI_API_KEY=AIzaSy...
   GEMINI_MODEL=gemini-2.5-flash
   GEMMA_MODEL=gemma-2-9b-it
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Run Production Build**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📄 License & Attribution
Developed for the Google Antigravity / Gemini Hackathon 2026. Built with Next.js, Google Gemini, Gemma, and Supabase.
