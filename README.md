# Saint Joseph Catholic Church Site

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/SaintJosephCatholicChurch/saint-joseph-catholic-church-site/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/SaintJosephCatholicChurch/saint-joseph-catholic-church-site/tree/main)
[![MADE BY Next.js](https://img.shields.io/badge/MADE%20BY%20Next.js-000000.svg?style=flat&logo=Next.js&labelColor=000)](https://nextjs.org/)

## Live Site

https://stjosephchurchbluffton.org/

## Production Build

Run `npm run build`

## Smoke Gate

Run `npm run smoke:install -- chromium firefox webkit` once on a machine before the first smoke run.

Use `npm run smoke:gate` as the required pre-upgrade gate before starting any dependency phase in `plan.md`. That command runs the one-shot TypeScript check, requires a clean ESLint pass with no unresolved findings, verifies the static export build, and then runs the full desktop-and-mobile Chromium, Firefox, and WebKit Playwright smoke suite against the exported site.

The current Next 16 runtime phase keeps both `npm run dev` and `npm run build` on the explicit webpack path via `next dev --webpack` and `next build --webpack`. Keep that bundler choice in place until the Phase 2 build-pipeline work has either removed or revalidated the custom webpack loaders.

The production-only PWA wrapper is intentionally gated behind `NEXT_ENABLE_PWA=true` during this phase. Leave it off by default until the Phase 2 build-pipeline work revalidates `@ducanh2912/next-pwa` on the Next 16 build path.

Use `npm run smoke:test:update` only when intentionally approving visual baseline changes after manual review. Snapshot updates are not part of normal upgrade runs.

Current intentional smoke baseline constraints:

- Public-site routes only. CMS and admin flows stay outside the Playwright gate and still require manual verification.
- The suite masks embedded iframes and the shared footer logo in screenshots because those regions are the main source of cross-browser rendering noise.
- The mobile drawer sweep runs only on `mobile-chromium`; the other five projects skip that test intentionally because it verifies shared navigation behavior rather than browser-specific rendering.
- Third-party and church API dependencies are intercepted in Playwright so contact, ask, and parish-registration smoke coverage never calls live services or sends real emails.

## Local Development

1. Install dependencies: `npm install`
2. Start local authication service for cms `npm run local-cms`
3. Start dev build `npm run dev`

## License

MIT
