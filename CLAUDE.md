# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
bun run dev          # Start dev server (port 3000 by default)
bun run build        # Production build
bun run start        # Start production server

# Testing
bun run test         # Run all tests (browser + unit, headless)
bun run test:ui      # Run tests with Vitest UI
bun run e2e          # Run Playwright E2E tests
bun run e2e:ui       # Run E2E tests with UI

# Run a single test file
bun run test -- src/components/ui/calendar.browser.spec.tsx

# Linting & formatting
bun run lint         # tsc --noEmit + oxlint
bun run format       # oxfmt (formatter)

# Database
bun run dk:init      # Start Docker (PostgreSQL)
bun run db:init      # Push schema + seed (first-time setup)
bun run db:push      # Sync Prisma schema to DB
bun run db:seed      # Seed database
bun run db:ui        # Open Prisma Studio

# Code generation
bun run gen:icons    # Regenerate icon components from SVG sources
```

Git hooks (via lefthook): `format` runs on pre-commit, `lint` runs on pre-push.

## Architecture

**Framework**: TanStack Start (React 19, SSR via Nitro) with TanStack Router for file-based routing.

**Path alias**: `@/` maps to `src/`.

### Routing

Routes live in `src/routes/` and are auto-generated into `src/routeTree.gen.ts` — never edit the gen file manually. The structure:

- `__root.tsx` — root layout with `<html>`, SSR language init, Vercel integrations
- `_layout.tsx` — shared layout wrapper (nav, page shell)
- `_layout/cv.tsx`, `_layout/index.tsx` — actual pages, pre-fetch data in `loader` using `queryClient.ensureQueryData`

### Server / API

- **oRPC** (`src/server/orpc.ts`) — typed RPC framework. `publicProcedure()` is the base builder with auth, logger, DB timing, and demo-mode middlewares applied.
- Routes are declared in `src/server/router.ts` and served at `/api/rpc`.
- Add new routers by creating `src/server/routers/<name>.ts` and registering them in `router.ts`.
- OpenAPI spec is auto-generated from oRPC routes (`src/server/openapi.ts`).

### Data Fetching

The oRPC client (`src/lib/orpc/client.ts`) wraps TanStack Query via `createORPCReactQueryUtils`. Import `orpc` from there and use `orpc.<router>.<procedure>.queryOptions(...)` — this gives full type safety end-to-end from Prisma → oRPC handler → React component.

### State / Providers

`src/providers.tsx` wraps the app with `ThemeProvider` (next-themes, dark/light via `class`) and `QueryClientProvider`. Toasts use `sonner`.

### Internationalization

- Two languages: `en` (default) and `fr`, defined in `src/locales/`.
- Namespaces: `common`, `cv`, `auth`, `layout`, etc. — each is a JSON file under `src/locales/en/` and `src/locales/fr/`.
- Language detection from cookies (30-day TTL). SSR reads language server-side to avoid hydration mismatches.
- DB content has bilingual fields (e.g., `positionEn` / `positionFr`); the server router accepts a `locale` input and returns the correct field.

### UI Components

- `src/components/ui/` — shadcn/ui components (base style, Tailwind CSS v4, CSS variables for theming)
- `src/components/form/` — form field wrappers (react-hook-form + Zod)
- `src/components/icons/` — generated from SVGs via `@svgr/cli`; run `gen:icons` after adding new SVGs to `svg-sources/`
- Tailwind utility: `cn()` from `@/lib/tailwind/utils`

### Feature Organization

Features live in `src/features/<name>/`. Each feature contains:
- `page-<name>.tsx` — page component (used by the route)
- `components/` — feature-specific components
- `schema.ts` — Zod schemas shared between client and server

### Environment Variables

Validated at startup with `@t3-oss/env-core`:
- Client vars (prefixed `VITE_`): `src/env/client.ts`
- Server vars: `src/env/server.ts`

Copy `.env.example` to `.env` for local dev. Key vars: `DATABASE_URL`, `VITE_BASE_URL`, `VITE_IS_DEMO`.

### Testing Conventions

Vitest runs two projects:
- **browser** — files matching `*.browser.{test,spec}.*`, run in Chromium via Playwright. Use for component tests.
- **unit** — files matching `*.unit.{test,spec}.*`, run in Node. Use for pure logic.

E2E tests are in `e2e/` using Playwright directly, not Vitest.

### Styling Conventions

Prefer Tailwind design tokens over arbitrary values. Use spacing (`p-4`, `gap-2`), color (`text-muted-foreground`, `bg-primary`), and typography (`text-sm`, `font-semibold`) tokens wherever a token exists. Only reach for arbitrary values (`px-[13px]`, `#3d3d3d`) when no token fits — and never use raw hex colors when a CSS variable or Tailwind color token covers the intent.

### Linting Rules Worth Knowing

- Filenames must be `kebab-case` (enforced by oxlint unicorn rule)
- Unused vars must be prefixed with `_` to be ignored
- Import order is enforced: internal `@/` imports before relative imports
