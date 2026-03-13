# Copilot Instructions

## Purpose

This repository is the public website for Saint Joseph Catholic Church, built with Next.js and TypeScript and exported as a static site.

## Tech Stack

- Next.js 14 with React 18
- TypeScript (`.ts` and `.tsx`)
- MUI + Emotion for UI
- Content-driven pages from `content/` JSON and markdown-like sources
- Static CMS integration under `src/cms/`

## Core Workflow

1. Prefer surgical edits over broad rewrites.
2. Preserve current file and folder structure unless explicitly asked.
3. Keep existing coding style: single quotes, no trailing commas, concise functions.
4. Do not change behavior outside the user request.

## Repository-Specific Rules

- Keep route behavior compatible with the existing Next setup in `next.config.mjs`.
- Respect existing path alias usage (`@/*` -> `src/*`) from `tsconfig.json`.
- Preserve data contracts defined in `src/interface.ts` when editing content loaders, components, or APIs.
- Keep UI changes aligned with existing MUI + Emotion patterns already used in the codebase.
- Avoid editing generated service worker artifacts in `public/sw.js` and `public/workbox-*.js` unless explicitly requested.
- Treat files under `content/` as source-of-truth content; do not rename keys unless all consuming code is updated.
- For redirect work, prefer using the existing script flow (`scripts/generate-redirects.ts`) instead of ad hoc logic.

## Validation Commands

Run relevant checks after changes:

- `npm run lint`
- `npm run build`
- `npm run dev` (for local smoke verification when needed)

## Dependency and API Guidance

- Prefer existing dependencies before adding new packages.
- If external library behavior is version-sensitive or unclear, use Context7 to verify exact APIs before coding.
- Keep security-sensitive values in environment variables; never hardcode secrets.

## Content and SEO Safety

- Preserve existing structured content fields used for homepage, schedules, bulletins, and metadata.
- Avoid accidental regressions in canonical URLs, schema metadata, or sitemap-related behavior when editing page rendering logic.

## Out of Scope by Default

Unless explicitly requested, do not:

- Reformat unrelated files.
- Migrate major frameworks or library versions.
- Rename large sets of files or routes.
- Modify deployment infrastructure settings (`netlify.toml`, PWA settings, or build pipeline) beyond the requested task.
