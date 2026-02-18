# CLAUDE.md

This file provides context for AI assistants working in this repository.

## Project Overview

**RunClub SaaS** is a multi-tenant SaaS platform for the integral management of running clubs. It combines an admin panel for club managers with a member-facing portal/app, creating a connected ecosystem that fosters community, simplifies payments, and turns training into a social, gamified experience.

**Value proposition:** One platform to manage members, collect fees, organize events, and motivate runners with challenges and rankings — no spreadsheets or scattered apps.

**Target market:** Latin America and Spain. More than 15,000 active running clubs in the region lack a specialized tool. Clubs are the tenants; runners are the end users.

The UI language is **Spanish** — all user-facing text, code comments, and display strings should be written in Spanish.

Multi-tenant isolation is enforced at the database layer: every table scopes data by `club_id`, and Supabase Row Level Security (RLS) policies ensure users can only access data belonging to their club(s).

---

## Product Modules

The platform is divided into four MVP modules plus planned future phases. Use this map when deciding where new features belong.

### MVP Modules (Phase 1 — current focus)

| Module | Key features | DB tables involved |
|---|---|---|
| **Member Management** | Registration, profiles, history, categories, roles, CSV export | `profiles`, `memberships`, `clubs` |
| **Payments & Subscriptions** | Recurring plans (monthly/quarterly/annual), automatic billing, financial dashboard, invoices | *(planned: `subscriptions`, `payments`)* |
| **Events & Races** | Event creation with capacity/price, registrations, results, auto-generated PDF certificates, public calendar | `events`, `attendance` |
| **Gamification** | Points (km, events, streaks, recruiting), global/category rankings, monthly challenges, badges, social leaderboard | *(planned: `points`, `challenges`, `badges`)* |

### Future Phases

| Phase | Period | Key deliverables |
|---|---|---|
| Phase 2 — Growth | Months 4–6 | iOS/Android app (React Native + Expo), analytics dashboard, GPS routes, Strava/Garmin integrations |
| Phase 3 — Scale | Months 7–12 | Club marketplace, white-label for federations, public API, integration with race timing systems |

### Domain Terminology

Use these Spanish terms consistently throughout the codebase and UI:

| Term | Meaning |
|---|---|
| **club** | The tenant/organisation (a running club) |
| **corredor / miembro** | A runner / club member |
| **admin / gestor** | Club administrator |
| **entrenador** | Coach (role between admin and runner) |
| **sesión / evento** | Training session or race event |
| **asistencia** | Attendance |
| **cuota** | Membership fee |
| **reto** | Monthly gamification challenge |
| **insignia** | Achievement badge |
| **racha** | Activity streak |
| **puntos** | Points earned through activity |

---

## Pricing Model

Understanding the pricing tiers helps when building plan-gated features:

| Plan | Price | Members | Notes |
|---|---|---|---|
| Gratis | $0/mo | ≤ 20 | Basic features, RunClub branding |
| Starter | $29/mo | ≤ 75 | Payments, events, gamification |
| Pro | $79/mo | ≤ 300 | Analytics, mobile app, priority support |
| Enterprise | $199+/mo | Unlimited | White-label, API, dedicated manager |

When implementing plan-gated features, add a `plan` field check on the club record. Always degrade gracefully — show an upgrade prompt rather than an error.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.6 (App Router) |
| UI | React 19 |
| Language | TypeScript 5 (`strict: true`) |
| Backend / Auth | Supabase (`@supabase/ssr`, `@supabase/supabase-js`) |
| Database | PostgreSQL via Supabase (with RLS) |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`) |
| Icons | `@heroicons/react`, `lucide-react` |
| Class utilities | `clsx`, `tailwind-merge` |

---

## Development Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Run production server
npm run lint     # Run ESLint (v9 flat config)
```

There is no test suite yet. No Prettier configuration exists.

---

## Environment Setup

Copy `env.example` to `.env.local` and fill in the values:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Both variables are browser-exposed (`NEXT_PUBLIC_` prefix). No server-only secrets are currently required beyond Supabase's anon key + RLS.

---

## Directory Structure

```
/
├── app/
│   ├── (dashboard)/              # Route group: authenticated pages
│   │   ├── actions.ts            # createClubAction
│   │   ├── layout.tsx            # Sidebar layout (nav + logout)
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # Main dashboard (bento grid)
│   │   │   ├── members/
│   │   │   │   ├── page.tsx      # Members table
│   │   │   │   ├── InviteModal.tsx
│   │   │   │   ├── MemberActionsMenu.tsx
│   │   │   │   └── RoleChangeButton.tsx
│   │   │   └── sessions/
│   │   │       ├── page.tsx      # Sessions list
│   │   │       ├── actions.ts
│   │   │       ├── new/page.tsx  # Create session form
│   │   │       └── [id]/
│   │   │           ├── page.tsx  # Session detail + attendance
│   │   │           └── AttendanceRow.tsx
│   │   └── members/
│   │       └── actions.ts        # Member management actions
│   ├── (public)/                 # Route group: unauthenticated pages
│   │   ├── actions.ts
│   │   ├── layout.tsx
│   │   └── club/[slug]/
│   │       ├── page.tsx          # Public club profile
│   │       └── JoinClubButton.tsx
│   ├── auth/
│   │   ├── actions.ts            # login / signup Server Actions
│   │   ├── callback/route.ts     # OAuth callback
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   └── AuthForm.tsx      # Login/signup toggle form
│   │   └── signout/route.ts
│   ├── globals.css
│   ├── layout.tsx                # Root layout (lang="es")
│   └── page.tsx                  # Root redirect (→ /dashboard or /auth/login)
├── components/
│   └── CreateClubForm.tsx        # Club creation form (client component)
├── middleware.ts                  # Session refresh + route protection
├── types/
│   └── database.ts               # Full TypeScript DB schema (Row/Insert/Update)
└── utils/
    └── supabase/
        ├── client.ts             # Browser Supabase client
        ├── server.ts             # Server Supabase client (cookie-based)
        └── types.ts              # Re-exports from types/database.ts
```

---

## Architecture & Conventions

### Server vs Client Components

- **Default to Server Components**: page files are `async` functions that fetch data directly.
- Add `'use client'` at the top of a file only when the component needs interactivity, React hooks, or browser APIs.
- Add `'use server'` to mark Server Action files or inline actions.

### Server Actions

- Defined in co-located `actions.ts` files next to the route that uses them.
- Always return a typed result object: `{ success: boolean; error?: string }`.
- Called from Client Components using React 19's `useActionState` hook.

```ts
// Example pattern
'use server'
export async function myAction(prevState: State, formData: FormData) {
  // ...
  return { success: true }
}
```

### Authentication

- Always use `supabase.auth.getUser()` — **never** `supabase.auth.getSession()` (sessions can be stale).
- Auth is checked both in `middleware.ts` (route-level) and inside each protected page/layout (defense in depth).
- `middleware.ts` protects `/dashboard/*` and redirects already-authenticated users away from `/auth/*`.

**Supabase client selection:**
- Server Components and Server Actions → `utils/supabase/server.ts` (`createClient`)
- Client Components → `utils/supabase/client.ts` (`createClient`)

### Data Fetching

- Fetch data server-side inside page components (not in API routes).
- Use `Promise.all()` for concurrent independent queries:

```ts
const [members, sessions] = await Promise.all([
  supabase.from('memberships').select('...'),
  supabase.from('events').select('...'),
])
```

### TypeScript

- Full DB schema is typed in `types/database.ts` with separate `Row`, `Insert`, and `Update` interfaces per table. Re-exported from `utils/supabase/types.ts`.
- Path alias `@/*` resolves to the repository root.
- `strict: true` — no implicit `any`, null checks are required.

### Naming Conventions

| Artifact | Convention |
|---|---|
| React component files | PascalCase (`CreateClubForm.tsx`) |
| TypeScript types/interfaces | PascalCase |
| Functions and variables | camelCase |
| Database column names | snake_case (matches Postgres) |
| URL slugs | kebab-case |

### Styling

- **Dark theme throughout**: primary backgrounds are `bg-slate-950` and `bg-slate-900`.
- **Orange accent**: `orange-500` / `orange-600` for primary actions and highlights.
- Use `clsx()` combined with `tailwind-merge` (`twMerge`) for conditional className logic.
- Avoid inline styles; use Tailwind utility classes exclusively.

### Code Comments

Write all code comments in **Spanish**, consistent with the UI language:

```ts
// Obtener el perfil del usuario actual
const { data: perfil } = await supabase.from('profiles').select('*').single()
```

---

## Database Schema

| Table | Purpose |
|---|---|
| `profiles` | Extended user info (linked to `auth.users`) |
| `clubs` | Clubs (tenants); identified by `id` (UUID) and `slug` (URL-safe name) |
| `memberships` | Junction: user ↔ club with `role` (`owner` / `coach` / `runner`) and `status` |
| `events` | Training sessions/events belonging to a club |
| `attendance` | Records which members attended which events |

All tables with user data are scoped by `club_id`. RLS policies enforce this isolation at the database layer — always ensure new tables follow the same pattern.

See `types/database.ts` for the complete typed schema and `SUPABASE_SETUP.md` for RLS policy examples.

---

## What Does Not Exist Yet

### Engineering tooling
- **No test suite** — no Jest, Vitest, or Playwright installed.
- **No Prettier** — no code formatter is configured; only ESLint is set up.
- **No pre-commit hooks** — no Husky or lint-staged.
- **No CI/CD pipeline** — no GitHub Actions or other automation.

When adding these, follow the existing ESLint flat config pattern (`eslint.config.mjs`).

### Planned product modules (not yet built)
These are on the roadmap. Do not implement them speculatively — wait for an explicit task:

- **Payments** — Stripe integration for recurring subscriptions; regional gateways (Culqi for Peru, Conekta for Mexico)
- **Gamification tables** — `points`, `challenges`, `badges` tables and ranking logic
- **PDF generation** — participation certificates for events
- **Mobile app** — React Native + Expo (Phase 2)
- **Analytics dashboard** — retention, revenue, attendance metrics (Phase 2)
- **GPS routes** — Mapbox + Strava API integration (Phase 2)
- **Email / SMS** — Resend (transactional email) + Twilio (WhatsApp reminders) (Phase 2)
- **Marketplace** — sponsor listings, club store (Phase 3)
- **White-label / API** — Enterprise tier features (Phase 3)
