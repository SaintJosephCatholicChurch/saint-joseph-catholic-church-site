# Agent guide: Saint Joseph Catholic Church site

Parish website for [stjosephchurchbluffton.org](https://stjosephchurchbluffton.org/). Next.js 16 App Router static site plus a custom GitHub-backed admin CMS.

Cursor also loads focused rules from `.cursor/rules/`. GitHub Copilot reads `.github/copilot-instructions.md`. When you change agent guidance, update **all three**: this file, the matching `.mdc` rule, and the Copilot file.

---

## What this repo is

A statically exported Next.js app. Parish content is JSON and MDX in `content/`, committed to Git. Staff edit it in `/admin`, which writes through the GitHub Contents API (Netlify GitHub OAuth) or a local preview mode that never pushes.

There is no Sanity, Payload, Prisma, Supabase, Firebase, Tailwind, NextAuth, or i18n. Events come from Google Calendar, not from `content/`. Contact, parish registration, and live-stream status hit `api.stjosephchurchbluffton.org` (separate Netlify functions), not routes in this app.

---

## How to work in this codebase

1. Read the matching `.cursor/rules/*.mdc` for the files you are touching.
2. Prefer editing **public components** and feeding draft data into admin previews. Do not fork markup for the CMS.
3. Persist through `src/admin/content/` adapters. Do not write `content/` files ad hoc from admin UI.
4. Match Prettier (`singleQuote`, `trailingComma: 'none'`, `printWidth: 120`) and ESLint (`import/order`, `consistent-type-imports`, MUI import restrictions).
5. Verify with `npm run type-check`. `npm run lint` only lints `**/*.ts`, not `.tsx`. Use `npm run build` before treating a UI change as done. Use `npm run smoke:gate` before dependency upgrades.

Do not follow `src/app/README.md` (it still describes a Pages Router migration that already finished). `README.md` documents `npm run local-cms`, which is not a script. `plan.md` is a Times-editor checklist; several paths in it are stale (`ComplexStructuredContentEditor`, `src/admin/times/`). Trust the tree.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2, React 19, **webpack** (`next dev --webpack` / `next build --webpack`) |
| Output | `output: 'export'` → `out/` |
| UI | MUI 7 + Emotion; Font Awesome; no public ThemeProvider |
| Admin theme | `createTheme` in `src/admin/AdminShell.tsx` (burgundy `#7f232c`, gold `#b88d49`) |
| Rich text | TinyMCE 8 (`src/admin/components/editor/`) |
| Calendar | FullCalendar + Google Calendar plugin |
| Content | File-based JSON + MDX (`gray-matter`, `js-yaml`) |
| Admin persistence | GitHub Contents API or local preview repo |
| Hosting | Netlify via CircleCI deploying `./out` |
| PWA | `@ducanh2912/next-pwa`, gated by `NEXT_ENABLE_PWA=true` (off by default) |
| Tests | Playwright smoke + visual snapshots in `tests/smoke/` |

Keep webpack until custom `?raw` loaders and PWA are revalidated. Leave PWA off unless enabling it on purpose. `next.config.mjs` sets `typescript.ignoreBuildErrors` in production — local `type-check` is the real TS gate.

---

## Directory map

```
content/          CMS source of truth (JSON + MDX + bulletin metadata)
public/           Static assets, fonts, bulletin PDFs/images, global CSS
src/app/          Production App Router (routes, metadata, client page views)
src/admin/        Custom CMS UI (client-only)
src/components/   Public-site React UI, grouped by domain
src/lib/          Build-time content loaders
src/util/         Shared hooks/utils (container queries, sanitize, fetch)
src/interface.ts  Shared domain types
src/constants.ts  Layout constants, API URLs, WordPress-era REDIRECTS
src/pages/        Empty leftover dirs — not used
scripts/          Bulletin PDF→images, static export server, redirects
tests/smoke/      Playwright public-site smoke + screenshots
.circleci/        CI build + Netlify deploy
.cursor/rules/    Cursor agent rules
.github/          Copilot instructions (kept in sync; no GitHub Actions)
```

---

## Where to look first

| Goal | Start here |
|---|---|
| Public route | `src/app/<route>/page.tsx` → `src/app/client-pages/` → `src/components/` |
| Shared page chrome | `src/app/AppPageShell.tsx` → `src/components/Layout.tsx` → `src/components/pages/PageView.tsx` |
| Domain types | `src/interface.ts` |
| Content files | `content/` |
| Content loaders | `src/lib/` |
| Admin shell / nav | `src/admin/AdminShell.tsx` |
| Admin section editor | `src/admin/content-sections/<section>/` |
| Admin preview frame | `src/admin/AdminPagePreviewFrame.tsx` |
| Preview click → editor | `src/admin/content-sections/components/adminPreviewSelection.ts` |
| Save / load / validate | `src/admin/content/contentRepository.ts` + `writable*.ts` + `validation.ts` |
| Auth | `src/admin/AdminAuthProvider.tsx`, `src/admin/adminConfig.ts` |
| Lint / format | `eslint.config.mjs`, Prettier block in `package.json` |
| CI / deploy | `.circleci/config.yml` |
| Smoke tests | `tests/smoke/`, `playwright.config.ts` |

---

## Routing

**App Router is production.** Every live route is `src/app/**/page.tsx`. `src/pages/` has leftover empty folders only.

Typical flow:

```
src/app/<route>/page.tsx          # server: generateMetadata, generateStaticParams
  → src/app/client-pages/*.tsx    # 'use client' views
    → src/app/AppPageShell.tsx    # Layout + PageView + Footer
      → src/components/*
```

Client view bundles:

- `src/app/client-pages/PublicPageViews.tsx` — content pages, search, staff, contact, ask, times, live stream, registration, help, events
- `src/app/client-pages/NewsPageViews.tsx`
- `src/app/client-pages/BulletinPageViews.tsx`
- `src/app/client-pages/SpecialPageViews.tsx` — admin (`dynamic(..., { ssr: false })`) and 404

Routes:

| Path | Role |
|---|---|
| `/` | Homepage |
| `/[page]` | MDX content pages (`dynamicParams = false`) |
| `/news`, `/news/page/[page]`, `/news/[post]`, `/news/tags/[[...tag]]` | News |
| `/parish-bulletins`, `/parish-bulletins/[date]` | Bulletins |
| `/events` | FullCalendar |
| `/mass-confession-times` | Schedule |
| `/staff`, `/contact`, `/ask`, `/live-stream`, `/search` | Feature pages |
| `/admin` | CMS (client-only) |
| `/help` | Help (also used from admin) |
| `/test-parish-registration` | Registration test page |

Helpers: `src/app/routeData.ts` (static props), `src/app/routeMetadata.ts` (`buildPageMetadata`).

404 applies `REDIRECTS` from `src/constants.ts` client-side (legacy WordPress paths).

---

## Content model

Git file CMS. Canonical path map: `SITE_CONTENT_PATHS` in `src/admin/content/contentRepository.ts`.

| File | Edited in admin as |
|---|---|
| `content/config.json` | Site Config |
| `content/church_details.json` | Church Details |
| `content/homepage.json` | Homepage |
| `content/times.json` | Times (Mass / confession) |
| `content/staff.json` | Staff |
| `content/menu.json` | Menu And Logo |
| `content/styles.json` | Styles |
| `content/meta/tags.json` | Tags |
| `content/pages/*.mdx` | Pages |
| `content/posts/*.mdx` | News |
| `content/bulletins/*.json` | Bulletin records |

MDX shape is HTML, not JSX:

```yaml
---
slug: parish-history
title: Parish History
date: 2022-09-01
---
<h2>...</h2>
<p>...</p>
```

Posts may also have `image` and `tags`. Slug in frontmatter is what routing uses; filenames usually match.

**Not file CMS:** Events (Google Calendar). Admin “Events” is an external calendar link. Ministries are ordinary MDX pages (for example `content/pages/lay-ministries.mdx`), not a typed entity.

Media: `public/files`, `public/staff`, `public/bulletins` (`SITE_MEDIA_RULES`). Bulletin PDFs are processed by `scripts/pdf-to-images.ts` (`npm run bulletins` / `bulletins-ci`).

---

## Admin CMS

Route `/admin` → `src/app/admin/page.tsx` → `AdminPageView` dynamically imports `AdminShell` with `ssr: false`.

### Auth

- **Connected:** Netlify GitHub OAuth (`src/admin/services/netlifyGitHubAuth.ts`). Needs push access to `SaintJosephCatholicChurch/saint-joseph-catholic-church-site`.
- **Preview:** local session, writes to `sessionStorage` against `previewManifest.generated.json`. No GitHub push.
- Sessions: `localStorage` keys in `ADMIN_SESSION_KEYS`. GitHub `repo` tokens live there for connected sessions (XSS on `/admin` equals write access). `ADMIN_AUTH.siteId` prefers `NEXT_PUBLIC_NETLIFY_SITE_ID`, then hostname fallback in `netlifyGitHubAuth.ts`. Set the env var in production.
- No RBAC beyond “can push to the repo”. Help view does not require auth.

### Views

Query-driven: `?view=church|homepage|bulletins|news|pages|siteConfig|help`. Church tabs: `?churchTab=details|staff|times`. Use `useAdminQueryParamState` for panel/tab state.

### Section pattern

```
src/admin/content-sections/<name>/
  *Section.tsx     # wires editor + preview into AdminContentSectionPage
  *Editor.tsx      # form
  *Preview.tsx     # public component + draft data inside AdminPagePreviewFrame
```

`AdminContentSectionPage`: desktop split editor | preview; mobile tabs. Persistence: `ContentSectionsEditorBase` + `writable*.ts`.

Writers:

- `writableStructuredContent.ts` — church details, site config, menu, tags, styles
- `writableComplexContent.ts` — homepage, times, staff
- `writableDocumentsContent.ts` — pages/posts MDX
- `writableBulletinsMediaContent.ts` — bulletins + media library

### Previews

Compose `AdminPagePreviewFrame`. It owns overflow, centering, and `container: 'page / inline-size'`. Put width on `pageSx`. See `.cursor/rules/admin-page-previews.mdc`.

Current consumers: Homepage, Times, Staff, Menu, Church Details, Document previews.

Interactive selection: `data-admin-field-key` + `handleAdminPreviewSelectionClick` in `adminPreviewSelection.ts`. Click-to-focus only when editor and preview are visible together; tabbed mobile layouts stay passive.

Reuse public components with `inCMS` / `adminSelection`. Feed **draft** data, not live `src/lib` imports, when the editor owns that data.

TinyMCE lives under `src/admin/components/editor/` (cms-image, cms-file, bible-autolink, telephone-autolink plugins). Sortable repeaters: `AdminSortableAccordionRepeaterCard` in `AdminCards.tsx`.

---

## Public components

Grouped by domain under `src/components/`: `carousel`, `common`, `events`, `homepage`, `layout`, `logo`, `meta`, `navigation`, `pages` (including `pages/custom/`), `posts`, `schedule`, `search`, `widgets`.

Custom feature pages: `src/components/pages/custom/<feature>/`. Forms are local `useState` plus hand-rolled validators (parish registration: `parishRegistration.validation.ts`). No Formik/Zod.

`src/components/base/` leftover dirs are unused; use MUI directly.

---

## Styling and layout

- Global CSS: `public/styles/global.css` (Open Sans / Oswald / Roboto, `#f5f4f3` background).
- CSS modules: `public/styles/content.module.css`, `carousel-content.module.css`.
- Component styles: MUI `styled` / `sx`.
- Public `<main>` sets `container: page / inline-size`. `getContainerQuery(query, inCMS)` rewrites `@media` → `@container page` when `inCMS` is true (the default) so previews follow pane width.
- Images: `images: { unoptimized: true }` because of static export.
- Max content width: `MAX_APP_WIDTH` (`1200`) in `src/constants.ts`.

MUI imports (ESLint-enforced):

```ts
import Button from '@mui/material/Button';           // good
import type { SxProps } from '@mui/material/styles'; // good
import { Button } from '@mui/material';              // banned barrel
import Foo from '@mui/material/Button/Foo';          // banned 3rd-level
```

---

## Data fetching

Build time: `fs` + `gray-matter` in `src/lib/pages.ts` / `posts.ts` / `bulletins.ts`; JSON imports for config/homepage/menu/etc. Module-level caches skip in development. Dynamic routes use `generateStaticParams` and `dynamicParams = false`.

Runtime (browser only):

- Contact / ask → `CONTACT_URL`
- Parish registration → `PARISH_REGISTRATION_URL`
- Live stream → `https://api.stjosephchurchbluffton.org/.netlify/functions/live`
- Events → FullCalendar Google Calendar
- Admin → GitHub REST (`GitHubRepoClient`) or `PreviewRepoClient`

No Next.js API routes. Static export forbids them.

---

## Scripts, CI, verification

| Script | Purpose |
|---|---|
| `npm run dev` | Webpack dev server |
| `npm run build` | Static export to `out/` |
| `npm run type-check` | `tsc --noEmit` (use this; production build ignores TS errors) |
| `npm run lint` | ESLint `**/*.ts` only |
| `npm run prettier` | Format `src/**/*.{js,jsx,ts,tsx}` |
| `npm run smoke:gate` | type-check + lint + build + Playwright (required before dependency upgrades) |
| `npm run smoke:test` | Playwright against exported site |
| `npm run smoke:test:update` | Update visual baselines **after manual review only** |
| `npm run bulletins` / `bulletins-ci` | PDF → images |
| `npm run smoke:install -- chromium firefox webkit` | One-time Playwright browsers |

CI is **CircleCI**, not GitHub Actions. `main` → Netlify prod `./out`; `beta` → Netlify branch deploy. `netlify.toml` is not what production deploy uses.

Smoke suite:

- Public routes only. CMS/admin is manual.
- Masks iframes and the footer logo in screenshots.
- Mobile drawer sweep runs only on `mobile-chromium`.
- Intercepts church/third-party APIs so contact, ask, and registration never send real email.

TypeScript: `strict: true`, `noImplicitAny: true`, **`strictNullChecks: false`**. Path alias `@/*` → `src/*` exists; the repo mostly uses relative imports (also the VS Code preference).

---

## Gotchas

1. Static export: no API routes, no request-time SSR.
2. Keep webpack; leave PWA off by default.
3. `src/pages/` is dead. `src/app/README.md` is obsolete.
4. MDX files are HTML-in-MDX, not React MDX components.
5. Container queries matter for preview fidelity. Use `getContainerQuery`.
6. Lint does not cover `.tsx`.
7. Production `next build` can ignore TS errors (`ignoreBuildErrors`).
8. Admin OAuth `siteId` prefers `NEXT_PUBLIC_NETLIFY_SITE_ID`; hostname fallback is last resort. Connected tokens stay in `localStorage`.
9. `previewManifest.generated.json` is a large generated snapshot for offline admin preview — treat it as generated.
10. TinaCMS is a mental model for Times field paths only, not a dependency.
11. `content/logo.json` may still exist on disk; menu now owns logo in admin drafts.
12. Do not add Tailwind, a headless CMS, or Pages Router routes.
