# Shashi Azad — Software Engineer II Portfolio

Stack: Next.js 14 + Tailwind CSS + Framer Motion + next-themes + next-seo + Supabase.

## Quickstart
1. Install: `npm install`
2. Copy `.env.example` → `.env.local` and fill in values
3. Dev: `npm run dev` → http://localhost:3000
4. Add `public/resume.pdf`

## Customize
- Edit `data/profile.ts` to change name, bio, skills, projects, contact.
- Colors: `tailwind.config.js`
- Animations: `components/Section.tsx`, `app/globals.css`

## Referrals & Jobs Feature

### Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Run the SQL schema** — paste `supabase/schema.sql` into the Supabase SQL Editor
3. **Create a private storage bucket** named `resumes` in Supabase Storage (set to private)
4. **Set environment variables** in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_STORAGE_BUCKET=resumes
   AUTH_ADMIN_USER=admin
   AUTH_ADMIN_PASS=your-strong-password
   ```
5. **Optional notifications:**
   - Email: set `RESEND_API_KEY`, `NOTIFY_EMAIL_FROM`, `NOTIFY_EMAIL_TO`
   - Slack: set `SLACK_WEBHOOK_URL`

### Routes

| Route | Description |
|---|---|
| `/referrals` | Public page — referral form (top) + jobs list (below) |
| `/referrals/admin` | Basic Auth protected admin — expandable referral table, job management |
| `GET /api/jobs` | Public API — list active jobs |
| `POST /api/referrals` | Public API — submit referral (FormData with resume) |
| `POST/PATCH/DELETE /api/admin/jobs` | Admin API — CRUD for jobs |
| `GET /api/admin/referrals` | Admin API — list referrals, CSV export (`?format=csv`) |
| `DELETE /api/admin/referrals/:id` | Admin API — delete a referral entry |
| `POST /api/ai/extract-job` | Admin API — extract structured job from raw JD text |
| `POST /api/ai/analyze-resume` | Admin API — analyze resume against matched job |
| `POST /api/ai/generate-feedback` | Admin API — generate candidate feedback from analysis |
| `PATCH /api/ai/generate-feedback` | Admin API — mark feedback as shared with candidate |

### Features
- Referral form with client + server validation (Zod), tag input for tech stacks, file upload
- Composite job reference: provide a job link (URL) and/or job ID with company name
- Job card click auto-fills "Job ID with Company" field and smooth-scrolls to form
- Real-time job updates via Supabase Realtime channels
- Resume upload to private Supabase Storage (signed URLs for admin access only)
- Honeypot + IP-based rate limiting (5 req/min) for anti-spam
- Email (Resend) and Slack webhook notifications on new submissions
- Admin panel (Basic Auth via middleware): expandable referral table, search by name/email, date filter, CSV export
- Admin actions: "Reoffered: Yes" / "Reoffered: No" — both DELETE the entry after confirmation
- Admin job management: create/edit/deactivate jobs

## AI Pipeline

Three AI-powered features enhance the admin workflow, powered by Google Gemini with automatic model fallback.

### AI Job Extraction
- **Endpoint:** `POST /api/ai/extract-job`
- **Input:** Raw job description text (up to 10,000 chars)
- **Output:** Structured job JSON with confidence score and fabrication warnings
- **Flow:** Paste JD in admin panel → AI extracts fields → auto-fills form → admin reviews and saves
- **Guards:** Fabrication check (company, experience verified against source text), Zod schema validation

### Resume Analysis
- **Endpoint:** `POST /api/ai/analyze-resume`
- **Input:** Referral ID (resume fetched from Supabase Storage)
- **Output:** Match score (0-100), skill alignment, experience fit, recruiter summary
- **Flow:** Click "Analyze" button on referral row → AI reads resume + matches job → stores results in JSONB
- **Guards:** Hiring-decision language check on summary/concerns

### Candidate Feedback
- **Endpoint:** `POST /api/ai/generate-feedback`
- **Input:** Referral ID + tone (encouraging/balanced/constructive)
- **Output:** Strengths, growth areas, suggestions, shareable message with disclaimer
- **Flow:** Click "Generate Feedback" → auto-chains analysis if needed → admin reviews → shares with candidate
- **Guards:** Score leakage check, hiring-decision language check, static disclaimer appended

### Shared Infrastructure
- `lib/ai/gemini.ts` — Gemini API caller with model fallback chain (gemini-2.5-flash-lite → gemini-2.0-flash → gemini-1.5-flash → gemini-pro)
- `lib/ai/schemas.ts` — Zod schemas for all AI inputs/outputs with confidence calculators
- `lib/ai/prompts.ts` — System prompts with constitution constraints
- `lib/ai/resume-parser.ts` — PDF text extraction via pdfjs-dist

### AI Configuration
| Variable | Default | Description |
|----------|---------|-------------|
| `LLM_API_KEY` | — | API key for an OpenAI-compatible provider (Groq `gsk_…`, OpenAI `sk-…`, OpenRouter, …) |
| `LLM_BASE_URL` | `https://api.openai.com/v1` | Provider endpoint, e.g. `https://api.groq.com/openai/v1` |
| `LLM_MODEL` | `openai/gpt-oss-120b` (Groq) | Primary chat model. Groq's `llama-3.x-*-versatile` models are decommissioned — use `openai/gpt-oss-120b` |
| `LLM_MODEL_FALLBACKS` | `openai/gpt-oss-20b` | Comma-separated backup models tried automatically if the primary fails |
| `GEMINI_API_KEY` | — | Final fallback used when every `LLM_MODEL`/`LLM_MODEL_FALLBACKS` entry fails |
| `AI_FEATURES_ENABLED` | `true` | Kill switch for all AI endpoints |
| `AI_RATE_LIMIT_PER_MINUTE` | `10` | Max AI requests per admin per minute |

The chat/AI stack tries `LLM_MODEL` first, then each `LLM_MODEL_FALLBACKS` entry in order, then the Gemini model chain — so a single deprecated model can never take the assistant offline.

### SQL Migration
Before using AI features, run this migration in the Supabase SQL Editor:
```sql
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS raw_jd text,
  ADD COLUMN IF NOT EXISTS ai_extracted_json jsonb;

ALTER TABLE public.referral_requests
  ADD COLUMN IF NOT EXISTS ai_analysis jsonb,
  ADD COLUMN IF NOT EXISTS feedback_payload jsonb;
```

### Constitution
All AI outputs are governed by `.devin/constitution.md`:
- No fabricated data (salary, company, experience)
- No hiring-decision language in any AI output
- No internal score leakage in candidate-facing content
- Admin review required before publishing feedback

## Deploy
- **Vercel (recommended):** import repo → add env vars → deploy
- **Netlify:** build `npm run build`, add env vars
- **GitHub Pages:** `npm run export` → deploy `out/` (note: API routes require a server)
