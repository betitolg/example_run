# CLAUDE.md

This file provides context for AI assistants working in this repository.

## Project Overview

**running-club-saas** is a multi-tenant SaaS application for managing running clubs. Club owners and coaches can create clubs, invite members, schedule training sessions, and track attendance. Members can join clubs via public invite links.

The UI language is **Spanish** — all user-facing text, code comments, and display strings should be written in Spanish.

Multi-tenant isolation is enforced at the database layer: every table scopes data by `club_id`, and Supabase Row Level Security (RLS) policies ensure users can only access data belonging to their club(s).

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

- **No test suite** — no Jest, Vitest, or Playwright installed.
- **No Prettier** — no code formatter is configured; only ESLint is set up.
- **No pre-commit hooks** — no Husky or lint-staged.
- **No CI/CD pipeline** — no GitHub Actions or other automation.

When adding these, follow the existing ESLint flat config pattern (`eslint.config.mjs`).
