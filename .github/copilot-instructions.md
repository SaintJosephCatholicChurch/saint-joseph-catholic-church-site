# Copilot / agent instructions

This file is kept in sync with Cursor: `AGENTS.md` (full repo map) and `.cursor/rules/*.mdc` (focused rules). When changing agent guidance, update all three.

## Core conventions

- Next.js 16 App Router **static export**. Do not add Next API routes, Pages Router files, or request-time SSR data.
- Keep **webpack** (`next dev --webpack` / `next build --webpack`). Leave PWA off unless `NEXT_ENABLE_PWA=true` is set on purpose.
- Production builds ignore TypeScript errors; always run `npm run type-check`. `npm run lint` only covers `**/*.ts`.
- Prefer relative imports. Use `import type { X } from '...'`. Prettier: single quotes, no trailing commas, print width 120.
- Import MUI as a default or 2nd-level path, never `@mui/material` barrel imports and never `@mui/*/*/*`.
- Domain types live in `src/interface.ts`. Content lives in `content/` and is persisted through `src/admin/content/`.
- Do not treat `src/app/README.md`, `README.md`'s `local-cms` step, or stale paths in `plan.md` as current. Trust the source tree.
- Full map of folders, routes, CMS paths, and gotchas: `AGENTS.md`.

## Admin preview standardization

- For page-style admin previews under `src/admin/`, compose `AdminPagePreviewFrame` instead of creating local preview shells.
- `AdminPagePreviewFrame` owns the full-size outer preview surface, horizontal centering, the `page` container, and vertical overflow handling.
- Each preview should declare only its width constraint through `pageSx`, using `width: '100%'` and a preview-specific `maxWidth` value.
- Do not add preview-local `overflow: auto`, `overflowY: auto`, `container: 'page / inline-size'`, or centering wrappers unless the nested content itself has a separate behavior requirement.
- If a preview needs a narrower content column inside the page frame, use a local wrapper with only `width: '100%'` and `maxWidth`; let the shared frame and container handle centering.
- Reuse public components with `inCMS` / `adminSelection`. Feed draft data into previews, not live `src/lib` imports, when the editor owns that data.
- New structured sections should use `AdminContentSectionPage` plus `ContentSectionsEditorBase`.

## Where things live

- Routes: `src/app/` (App Router is production; `src/pages/` is unused leftover).
- Public UI: `src/components/` (custom pages under `src/components/pages/custom/`).
- CMS UI: `src/admin/` (client-only; `/admin` loads `AdminShell` with `ssr: false`).
- Content loaders: `src/lib/`. Content files: `content/` (JSON + HTML-in-MDX). Path map: `SITE_CONTENT_PATHS` in `src/admin/content/contentRepository.ts`.
- Events are Google Calendar, not `content/`. Ministries are ordinary MDX pages.
- Hosting: CircleCI deploys `./out` to Netlify. No GitHub Actions.
- Public `<main>` uses `container: page / inline-size`. Use `getContainerQuery` so admin previews follow pane width.
