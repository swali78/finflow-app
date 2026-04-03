# TaxHacker — Full Project Overview

## 🧠 What is TaxHacker?
A **self-hosted AI accounting app** for freelancers and small businesses. You upload receipts/invoices → AI extracts data → stores structured transactions → you export/report.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v3 + Radix UI components (shadcn/ui) |
| **Database** | PostgreSQL 17 via **Prisma ORM** |
| **Auth** | `better-auth` (email/password + sessions) |
| **AI / LLM** | LangChain with OpenAI / Google Gemini / Mistral |
| **File Storage** | Local filesystem (`UPLOAD_PATH`) |
| **PDF Processing** | pdf2pic + sharp + Ghostscript + GraphicsMagick |
| **Email** | Resend |
| **Payments** | Stripe (subscription plans) |
| **Export** | fast-csv, JSZip, @react-pdf/renderer |
| **Error Tracking** | Sentry |
| **Deployment** | Docker + Docker Compose |
| **Dev Server** | `npm run dev` at `http://localhost:7331` |

---

## 🗂 Database Models (Prisma)

| Model | Purpose |
|-------|---------|
| `User` | Account info, business details, Stripe, AI balance, storage |
| `Session` / `Account` / `Verification` | Auth via better-auth |
| `Setting` | Key-value config per user (LLM keys, base currency, etc.) |
| `Category` | Expense/income categories with custom LLM prompts |
| `Project` | Group transactions by client/project |
| `Field` | Custom columns with AI extraction prompts |
| `File` | Uploaded files (receipts, invoices, PDFs) |
| `Transaction` | Core: name, merchant, total, currency, category, project, items (JSON), custom `extra` JSON |
| `Currency` | Supported currencies per user |
| `AppData` | Per-user app-specific JSON storage |
| `Progress` | Background job progress tracking |

---

## 📁 App Pages / Routes

```
app/
├── (auth)/         → Login, Register, Forgot password
├── (app)/
│   ├── dashboard/  → Stats & summary charts
│   ├── transactions/ → Full transaction table, filters, editing
│   ├── files/      → Uploaded files list
│   ├── unsorted/   → Files pending review / AI processing
│   ├── import/     → Bulk CSV import
│   ├── export/     → Export filtered data as CSV/ZIP
│   ├── settings/   → LLM keys, currency, AI prompts, categories, projects, fields
│   └── apps/       → Mini-apps panel (extensible)
├── api/
│   ├── auth/       → better-auth handler
│   ├── currency/   → Historical exchange rate lookup
│   ├── progress/   → SSE progress stream for background jobs
│   └── stripe/     → Stripe webhook handler
└── landing/        → Public landing page
```

---

## ⚙️ API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /api/auth/[...]` | Login, register, sessions (better-auth) |
| `GET  /api/currency`   | Get historical exchange rates |
| `GET  /api/progress`   | Server-Sent Events for job progress |
| `POST /api/stripe`     | Stripe webhook (subscription events) |

> Most data mutations use **Next.js Server Actions** (not REST APIs) — defined in `models/*.ts` files.

---

## 🔧 Core Functions & Server Actions

### `models/transactions.ts`
- `getTransactions(userId, filters)` — paginated/filtered list
- `createTransaction(data)` — create new
- `updateTransaction(id, data)` — update
- `deleteTransaction(id)` — delete

### `models/files.ts`
- `uploadFile(file, userId)` — store file, create DB record
- `deleteFile(id)` — remove file + disk

### `models/categories.ts` / `projects.ts` / `fields.ts`
- CRUD for categories, projects, custom fields

### `models/settings.ts`
- `getSetting(userId, code)` / `updateSetting(userId, code, value)` — key-value settings

### `models/stats.ts`
- Totals by category, project, period — used by dashboard

### `models/backups.ts`
- Full data export + ZIP archive with files

### `models/export_and_import.ts`
- CSV import/export logic

### `lib/files.ts`
- File handling utilities (save, preview generation)

### `lib/config.ts`
- Reads env vars, validates configuration

### `lib/cache.ts`
- In-memory caching utilities

### `lib/stats.ts`
- Stats aggregation helpers

### `lib/uploads.ts`
- Handles multipart upload saving

---

## 🤖 AI Module (`ai/`)

| File | Purpose |
|------|---------|
| `ai/analyze.ts` | Main entry: runs LLM analysis on a file |
| `ai/prompt.ts` | Builds the system + user prompt from settings/fields |
| `ai/schema.ts` | Zod schema for structured LLM output |
| `ai/attachments.ts` | Prepares file (image/PDF page) for LLM input |
| `ai/providers/` | OpenAI / Gemini / Mistral adapters via LangChain |

**Flow:**
1. File uploaded → stored on disk
2. `ai/analyze.ts` converts file → image(s)
3. Prompt built from system config + custom field prompts
4. LLM returns structured JSON (name, merchant, total, currency, items, custom fields)
5. Transaction created automatically

---

## 🧩 Components

```
components/
├── agents/       → AI agent UI (run analysis, show progress)
├── auth/         → Login/register forms
├── dashboard/    → Charts and stats cards
├── export/       → Export UI
├── files/        → File uploader, file card
├── forms/        → Reusable form fields
├── import/       → CSV import UI
├── settings/     → Settings panels (LLM, currencies, fields, etc.)
├── sidebar/      → Navigation sidebar
├── transactions/ → Transaction table, filters, edit drawer
├── unsorted/     → Unsorted files queue
└── ui/           → shadcn/ui primitive components
```

---

## 🌿 Environment Variables

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Session signing key |
| `UPLOAD_PATH` | Where files are stored on disk |
| `SELF_HOSTED_MODE` | `true` = auto-login, unlock all features |
| `OPENAI_API_KEY` / `GOOGLE_API_KEY` / `MISTRAL_API_KEY` | LLM provider keys |
| `STRIPE_SECRET_KEY` | Stripe payments |
| `RESEND_API_KEY` | Email sending |

---

## ✂️ What to Keep for a Minimalist Version

If you want to strip this down to a **minimal app**, here's what to keep vs. cut:

### ✅ Keep (Core Value)
- Upload file → AI scan → Transaction saved
- Transaction list with filter/search
- Categories & projects
- Export to CSV

### ❌ Remove / Simplify
- Stripe payments / subscriptions
- Sentry error tracking
- Multi-LLM provider choice (pick one, e.g. Gemini)
- Custom fields system
- Email (Resend)
- Progress SSE streaming (use simple loading state)
- AppData model (not needed for basic use)
- Landing page
- Docs page
- Business details / logo on User

### 🟡 Simplify
- Settings → just LLM API key + base currency
- Auth → single user (SELF_HOSTED_MODE=true removes need for full auth)
- Dashboard → simple total expense/income card instead of full charts
