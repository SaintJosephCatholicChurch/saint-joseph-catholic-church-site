## Plan: Incremental Site Dependency Upgrades

This plan is organized into explicit phases that can be completed one at a time. The intended execution model is: implement exactly one phase, run that phase’s verification, mark that phase complete in this plan, and stop. A later prompt such as "implement the next phase" should mean: find the first unchecked phase, execute only that phase’s scope, update this plan to mark it done, and then stop without starting the following phase.

**Execution rule**

- Complete exactly one phase per implementation run.
- Do not begin work from a later phase until every earlier phase is marked complete.
- When a phase finishes, update this plan by changing that phase from `[ ]` to `[x]` and add any important notes under that phase.
- Do not mark a phase complete until its required lint command has been run and all lint findings for the site repo have been resolved.
- If a phase reveals more work than expected, split that phase into substeps, but do not silently spill work into the next phase.

**Phases**

1. `[x]` Phase 1: Build the smoke-test baseline
   Scope: Add Playwright to `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site` with explicit desktop and mobile projects across Chromium, Firefox, and WebKit; create a production-like `webServer` flow that builds the static export and serves the generated output; add a one-shot typecheck and the visual-regression helpers needed for later gates.
   Includes: cross-browser setup, desktop and mobile viewport/device setup, test config, deterministic serving strategy, screenshot and snapshot utilities, layout assertion helpers, non-watch TypeScript verification, package scripts, test helpers and fixtures.
   Excludes: dependency upgrades.
   Notes: Implemented with `playwright.config.ts`, `scripts/serve-export.mjs`, and baseline fixtures/helpers under `tests/smoke/`; added six explicit desktop/mobile browser projects, a one-shot `type-check`, and smoke scripts for browser install, static serving, and test execution. Verified with `npm run type-check`, `npm run smoke:install -- chromium firefox webkit`, and `npm run smoke:test:update`; this generated initial proof snapshots for the custom `404` shell only, while network interception and broader route coverage remain intentionally deferred to Phases 2 and 3.
2. `[x]` Phase 2: Make external dependencies deterministic
   Scope: Intercept or mock the public-site network dependencies used by smoke tests so the suite is stable, non-destructive, and visually consistent enough for screenshot comparison.
   Includes: mock-only handling for contact, ask, and parish-registration form submissions so they never hit the real deployed endpoints or send real emails; interception for daily-readings RSS and SoundCloud requests; interception for live-stream API calls; interception for Google Calendar-backed event requests; stabilization or masking of inherently dynamic embed surfaces where needed so layout and screenshot assertions stay trustworthy.
   Excludes: real backend/serverless calls, CMS coverage.
   Notes: Implemented centralized Playwright request interception in `tests/smoke/fixtures.ts` for church API calls, Google Calendar, Facebook embeds, and SoundCloud, with a fail-closed fallback for unexpected church API requests; added `tests/smoke/deterministic-dependencies.spec.ts` to prove mocked homepage/widget dependencies and to verify that contact, ask, and parish-registration submissions are trapped by smoke-only endpoints rather than live services. Verified with `npx playwright test tests/smoke/deterministic-dependencies.spec.ts` and `npm run type-check`. Public form smoke tests are now guarded against sending real emails.
3. `[x]` Phase 3: Cover the public-site smoke journeys
   Scope: Add the actual smoke scenarios for the public site on both desktop and mobile viewports.
   Includes: homepage and global navigation, responsive drawer/header/footer behavior, `/mass-confession-times`, `/events`, `/news` list plus one article, `/parish-bulletins` list plus one detail page, `/search`, `/staff`, `/live-stream`, `/contact`, `/ask`, `/test-parish-registration`, and a custom 404 path; per-route assertions that key content is present and visible; best-effort layout and visual assertions using screenshots or snapshots to detect content disappearing, major spacing shifts, broken responsive behavior, obvious color/theme drift, and other user-noticeable regressions.
   Excludes: CMS/admin routes.
   Notes: Expanded `tests/smoke/baseline.spec.ts` to cover the remaining public journeys, including ask, contact, test parish registration, news list-to-detail, custom 404 recovery, and the mobile drawer sweep, while keeping route-level visibility assertions aligned with the actual responsive DOM. Added targeted screenshot stability controls for tall pages and masked the shared footer logo region to remove browser-specific rendering noise without weakening route content checks; also reduced local Playwright worker count and increased timeout in `playwright.config.ts` so the full multi-project smoke gate runs reliably on this workstation. Verified with `npm run type-check`, `npx playwright test --update-snapshots`, and a final clean `npx playwright test`; the full suite passed with 133 tests and 5 intentional project skips.
4. `[x]` Phase 4: Freeze and verify the baseline gate
   Scope: Make the baseline operational and documented before any dependency changes begin.
   Includes: full static export build, full desktop-and-mobile cross-browser smoke run, approval of the initial visual baselines, baseline script cleanup, documentation of intentional exclusions or masked regions, and confirmation that the smoke gate is the required precondition for every upgrade phase.
   Excludes: dependency changes.
   Notes: Added a dedicated `npm run smoke:gate` script so the pre-upgrade gate is one command covering `type-check`, a clean `lint` pass, static export build, and the full Playwright desktop/mobile cross-browser suite. Documented the gate in `README.md`, including the rule that every later dependency phase starts from this smoke gate, the masked screenshot regions (`iframe` embeds and the shared footer logo), the intentional CMS/admin exclusion, the single-project mobile drawer sweep, and the requirement that snapshot updates happen only after manual review. Verified with `npm run smoke:gate`; the full baseline suite passed cleanly with the existing approved snapshots.
5. `[x]` Phase 5: React preflight to 18.3
   Scope: Upgrade `react` and `react-dom` from 18.2 to 18.3 and align `@types/react` and `@types/react-dom`, while staying on Next 14.
   Includes: runtime package bump, type package bump, fixes for any new React warnings that surface during the baseline gate.
   Excludes: Next major upgrade.
   Notes: Upgraded `react` and `react-dom` to `18.3.1`, moved `@types/react` to `18.3.26`, and added an explicit `@types/react-dom` pin at `18.3.7` while keeping `next` on `14.2.2`. Cleared narrow smoke-test verification blockers in `tests/smoke/fixtures.ts`, `tests/smoke/deterministic-dependencies.spec.ts`, the TinyMCE CMS plugin registrations, and the Playwright baseline type imports so the Phase 5 verification could run lint-clean. Verified with `npm install`, `npm run type-check`, `npm run lint`, and a final clean `npm run smoke:test` after the production build path.
6. `[x]` Phase 6: Core runtime hop from Next 14 to Next 15 and React 19
   Scope: Upgrade the main runtime one major step.
   Includes: `next`, `react`, `react-dom`, `eslint-config-next`, and `@next/eslint-plugin-next`; use the official Next 15 and React 19 migration guides and codemods where they reduce churn.
   Excludes: Next 16 and Next-coupled plugin upgrades.
   Notes: Upgraded `next` to `15.5.15`, `react`/`react-dom` to `19.2.5`, aligned `eslint-config-next` and `@next/eslint-plugin-next` to `15.5.15`, and moved `@types/react` / `@types/react-dom` to React 19-compatible versions. Fixed the narrow React 19 fallout by adding explicit `null` ref initialization in calendar/navigation components, renaming Playwright fixture callback parameters that the upgraded Hooks lint rule misclassified, tightening the `/news` smoke readiness check to wait for real article content, and removing deferred summary rendering in `PostSummary` so the mobile WebKit news baseline is deterministic again. Verified with `npm install`, `npm run type-check`, `npm run lint`, `npm run build`, a targeted `npx playwright test tests/smoke/baseline.spec.ts --project=desktop-chromium -g "news page keeps a stable visual baseline"`, a targeted `npx playwright test tests/smoke/baseline.spec.ts --project=mobile-webkit -g "news page keeps a stable visual baseline"`, and a final clean `npm run smoke:test` with 133 passed tests and 5 intentional skips; the existing Next build warnings about the large PWA precache chunk and `/search` page data remain unchanged and are deferred.
7. `[ ]` Phase 7: App Router foundation and coexistence scaffold
   Scope: Introduce the App Router shell after Next 15 is stable, while keeping the existing Pages Router live during the migration window.
   Includes: create `src/app/` with a root layout, move global CSS import responsibilities and document-level metadata into App Router-compatible structure, extract any required provider or client-only wrappers, and document the route-by-route migration rules for the remaining phases.
   Excludes: replacing any existing production route path.
   Notes: The official guide recommends incremental migration with `app` and `pages` coexisting. Keep `src/pages/_app.tsx` and `src/pages/_document.tsx` until the last Pages Router route is removed, because App Router layout styles do not apply back to `pages/*` routes during coexistence.
8. `[x]` Phase 7: App Router foundation and coexistence scaffold
   Scope: Introduce the App Router shell after Next 15 is stable, while keeping the existing Pages Router live during the migration window.
   Includes: create `src/app/` with a root layout, move global CSS import responsibilities and document-level metadata into App Router-compatible structure, extract any required provider or client-only wrappers, and document the route-by-route migration rules for the remaining phases.
   Excludes: replacing any existing production route path.
   Notes: Added `src/app/layout.tsx` as the coexistence root layout, moved the shared global CSS imports and document-level metadata there for future App Router routes, and added `src/app/AppClientBootstrap.tsx` to carry the existing production-only React devtools disable side effect into the App Router path. Documented the route-by-route coexistence rules in `src/app/README.md`, left `src/pages/_app.tsx` and `src/pages/_document.tsx` intact for the live Pages Router surface, and excluded the generated `next-env.d.ts` file from ESLint so the required lint gate stays clean with Next's typed-routes reference. Verified with `npm run type-check`, `npm run lint`, and a final clean `npm run smoke:gate`; the existing large PWA precache chunk and `/search` page-data build warnings remain unchanged and deferred.
9. `[ ]` Phase 8: App Router homepage route
   Scope: Migrate `/` first as the highest-traffic route and the first proof that the App Router shell matches current production behavior.
   Includes: move the homepage route to `src/app/page.tsx`, split server and client concerns as needed, preserve homepage widget behavior and mocks, and rerun full homepage smoke coverage on desktop and mobile.
   Excludes: any non-homepage route.
   Notes: Follow the migration guide's low-churn path when needed by moving the old page body into a Client Component and importing it into the new App Router page.
10. `[ ]` Phase 9: App Router content-page route family
    Scope: Migrate the content-backed static page family currently served by `src/pages/[page].tsx`.
    Includes: replace `getStaticPaths` with `generateStaticParams`, replace `getStaticProps` with App Router-compatible server data loading, preserve sidebar/static data parity, and smoke-test several representative page slugs.
    Excludes: search, news, bulletins, and events.
    Notes: This phase moves many URLs at once, so verification should cover a representative sample of content pages rather than only one slug.
11. `[ ]` Phase 10: App Router search route
    Scope: Migrate `/search` as its own phase because it mixes prebuilt content indexing with client-side query-string behavior.
    Includes: move searchable data preparation to App Router-compatible server code, keep the query-state and results UI in a Client Component, and verify query parameter, no-results, and result-highlighting behavior.
    Excludes: other collection routes.
    Notes: Preserve the current URL-driven search behavior exactly before moving on.
12. `[ ]` Phase 11: App Router low-complexity informational routes
    Scope: Migrate the simpler standalone public pages with low data complexity.
    Includes: `/mass-confession-times`, `/staff`, and `/help`; extraction of any shared page chrome helpers used by these routes; and desktop/mobile smoke parity for each route.
    Excludes: form routes, live stream, and collection routes.
    Notes: Keep this phase intentionally small and only move these routes once the homepage, content pages, and search are stable.
13. `[ ]` Phase 12: App Router form-driven public routes
    Scope: Migrate the public form surfaces as a dedicated safety phase.
    Includes: `/contact`, `/ask`, and `/test-parish-registration`; preservation of the deployed API endpoints in `src/constants.ts`; and smoke confirmation that all form submissions remain intercepted and never call live services.
    Excludes: serverless API changes.
    Notes: These routes stay grouped because the smoke harness already treats them as one shared non-destructive behavior class.
14. `[ ]` Phase 13: App Router live-stream route
    Scope: Migrate `/live-stream` separately because it depends on API-driven runtime behavior and embedded content.
    Includes: App Router replacement for the current live-stream shell, continued mock coverage for live-stream API calls, and smoke checks for fallback and successful-render states.
    Excludes: calendar/events work.
    Notes: Keep this isolated so live-stream-specific regressions are not conflated with forms or calendar behavior.
15. `[ ]` Phase 14: App Router events route
    Scope: Migrate `/events` on its own because it combines FullCalendar integration with external data dependencies.
    Includes: route move, any App Router-compatible data-loading adjustments, continued Google Calendar mocking, and desktop/mobile smoke coverage for calendar visibility and key interactions.
    Excludes: news and bulletin routes.
    Notes: Do not mix this with the later FullCalendar dependency-upgrade phase; this is router migration only.
16. `[ ]` Phase 15: App Router news route family
    Scope: Migrate the full news tree as one route family.
    Includes: `/news`, `/news/page/*`, `/news/tags/*`, and `/news/[post]`; App Router param generation, metadata parity, pagination/tag verification, and list-to-detail smoke checks.
    Excludes: bulletin routes.
    Notes: Treat the news tree as one migration unit because its list and detail routes share data-loading conventions.
17. `[ ]` Phase 16: App Router bulletin route family
    Scope: Migrate the bulletin listing and detail route family.
    Includes: `/parish-bulletins` and `/parish-bulletins/[date]`; static param generation, file-backed bulletin data loading, and representative visual smoke coverage for list and detail views.
    Excludes: news and admin.
    Notes: Keep bulletins separate from news so file-backed rendering regressions are easier to isolate.
18. `[ ]` Phase 17: App Router special and CMS-adjacent routes
    Scope: Migrate the remaining Pages Router surfaces that need bespoke handling.
    Includes: custom 404 handling, `/admin`, and any route-level metadata or no-SSR CMS bootstrapping adjustments required for App Router; public smoke verification plus manual admin/CMS sanity checks.
    Excludes: Static CMS package upgrades.
    Notes: `/admin` should move late because it is outside the public smoke baseline and may need a client-only wrapper under App Router.
19. `[ ]` Phase 18: Pages Router cleanup and removal
    Scope: Remove leftover Pages Router-only setup after every required route is live under `src/app`.
    Includes: deletion of obsolete `src/pages` route files, retirement of `_app.tsx` and `_document.tsx`, cleanup of unused `getStaticProps` and `getStaticPaths` helpers, removal of compatibility shims, and a final route-inventory audit.
    Excludes: Next 16 upgrade.
    Notes: This phase is complete only when the production route surface no longer depends on the Pages Router.
20. `[ ]` Phase 19: Core runtime hop from Next 15 to Next 16
    Scope: Upgrade to Next 16 as a separate phase.
    Includes: Next 16 config and behavior adjustments, removal or replacement of any deprecated/removed Next APIs encountered in this repo.
    Excludes: PWA/build add-on upgrades.
    Notes: Because `next.config.mjs` uses `output: 'export'`, a custom `webpack` function, and `next-remove-imports`, the first Next 16 adoption should stay on an explicit webpack-compatible build path until proven stable.
21. `[ ]` Phase 20: Upgrade Next-coupled build add-ons
    Scope: Upgrade the packages that are tightly coupled to the Next build pipeline after Next 16 is stable.
    Includes: `@ducanh2912/next-pwa`, `next-remove-imports`, `@svgr/webpack`, `yaml-loader`, `raw-loader`, and related `next.config.mjs` changes.
    Excludes: MUI and application feature libraries.
    Notes: Keep bundler-mode decisions explicit in this phase.
22. `[ ]` Phase 21: MUI main stack from v5 to v6
    Scope: Upgrade the core Material UI stack one major step.
    Includes: `@mui/material`, `@mui/system`, `@mui/icons-material`, Emotion packages, and any directly coupled theming/styling fixes.
    Excludes: MUI v7 and MUI X pickers v8.
    Notes: Audit `@mui/base` carefully here because it is currently on a beta track and may need migration, replacement, or removal rather than a simple bump.
23. `[ ]` Phase 22: MUI main stack from v6 to v7
    Scope: Upgrade Material UI another major step after v6 is stable.
    Includes: exports-field package layout changes, grid/grid2 rename issues, removed deprecated APIs, theme behavior differences, and any resulting import or styling fixes.
    Excludes: date pickers.
    Notes: Keep this phase isolated from the pickers upgrade.
24. `[ ]` Phase 23: Date stack and MUI X pickers
    Scope: Upgrade `@mui/x-date-pickers` from v7 to v8 together with `date-fns` from v3 to v4.
    Includes: adapter import changes, picker API changes, slot/theme updates, and any application fixes needed for the date stack.
    Excludes: unrelated MUI components.
    Notes: This is where current `AdapterDateFnsV3` usage is expected to change.
25. `[ ]` Phase 24: FullCalendar family
    Scope: Upgrade the FullCalendar ecosystem one major version at a time, with all `@fullcalendar/*` packages kept in lockstep.
    Includes: custom mobile view plugin fixes, Google Calendar integration verification, and event interaction regression checks.
    Excludes: unrelated utility packages.
    Notes: If multiple major hops are required, keep them as explicit substeps inside this phase and verify after each hop.
26. `[ ]` Phase 25: Remaining public-site utility batches
    Scope: Upgrade the remaining public-site libraries in small logical batches.
    Includes: content/data parsing libraries, UI widget libraries, SEO/schema libraries, and general utilities.
    Excludes: developer toolchain and CMS-adjacent packages.
    Notes: Keep each package to one major hop at a time and use official migration docs or release notes at execution time.
27. `[ ]` Phase 26: Developer toolchain modernization
    Scope: Upgrade the local toolchain after the runtime and main UI stack are stable.
    Includes: ESLint 8 to 9, `@typescript-eslint` packages, TypeScript, Prettier, and removal of deprecated `babel-eslint`.
    Excludes: CMS-adjacent runtime packages.
    Notes: Doing this late keeps lint/type noise from obscuring framework regressions.
28. `[ ]` Phase 27: CMS-adjacent packages, excluding Static CMS
    Scope: Upgrade packages that are outside the public smoke suite and will still need manual CMS checks.
    Includes: TinyMCE, `@dnd-kit`, and any other CMS-adjacent libraries except `@staticcms/*`.
    Excludes: `@staticcms/*` entirely.
    Notes: After this phase, public smoke tests still run, but CMS validation remains manual by design.
29. `[ ]` Phase 28: Final dependency sweep
    Scope: Re-run outdated dependency inventory and pick up leftovers.
    Includes: remaining minors, patches, and any still-unfinished single-major packages that fit the already-established grouping rules.
    Excludes: new scope expansion.
    Notes: If a high-impact group still has another major remaining, create a new explicit phase instead of folding it into cleanup.

**Per-phase completion checklist**

1. Read the official migration guide or release notes for that phase’s dependency group before implementation.
2. Implement only the current unchecked phase.
3. Run that phase’s verification steps, including the required lint command, and resolve every lint finding before moving on.
4. Update this plan by marking the phase `[x]` and adding concise notes about what changed, any follow-up constraints, and any intentionally deferred work.
5. Stop after completing that one phase.

**Guide checkpoints**

- Playwright Installation: https://playwright.dev/docs/intro
- React 19 Upgrade Guide: https://react.dev/blog/2024/04/25/react-19-upgrade-guide
- Next.js 15 Upgrade Guide: https://nextjs.org/docs/app/guides/upgrading/version-15
- Next.js App Router Migration Guide: https://nextjs.org/docs/app/guides/migrating/app-router-migration#migrating-from-pages-to-app
- Next.js 16 Upgrade Guide: https://nextjs.org/docs/app/guides/upgrading/version-16
- Material UI v6 Guide: https://mui.com/material-ui/migration/upgrade-to-v6/
- Material UI v7 Guide: https://mui.com/material-ui/migration/upgrade-to-v7/
- MUI X Pickers v7 to v8 Guide: https://mui.com/x/migration/migration-pickers-v7/
- ESLint v9 Migration Guide: https://eslint.org/docs/latest/use/migrate-to-9.0.0
- For later utility batches, use the official release notes or migration guide for each package at the moment that batch is executed.

**Relevant files**

- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\package.json` — dependency inventory, scripts, and future smoke-test and verification commands.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\next.config.mjs` — static export, webpack customization, PWA wrapping, and the highest-risk Next 16 config surface.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\global.d.ts` — type augmentation surface that may need React or package-layout adjustments later.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\app\` — target App Router surface that will coexist with `src/pages/` during migration.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\pages\_app.tsx` — current global wrapper to mirror into App Router layout/provider structure.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\pages\_document.tsx` — current document/head shell to translate into App Router layout and metadata.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\constants.ts` — external API endpoints used by public forms.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\components\pages\custom\contact\ContactForm.tsx` — mock-only public form smoke target.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\components\pages\custom\ask\AskForm.tsx` — mock-only public form smoke target.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\components\pages\custom\parish-membership\ParishRegistrationForm.tsx` — mock-only form smoke target and server response behavior surface.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\components\widgets\DailyReadings.tsx` — third-party network-dependent homepage widget to stabilize in smoke tests.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\components\events\CalendarView.tsx` — FullCalendar and Google Calendar integration surface.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\components\pages\custom\live-stream\LiveStreamView.tsx` — live-stream shell behavior.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\components\pages\custom\live-stream\useLiveStreamUrl.ts` — API-driven live-stream URL fetching.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\pages\[page].tsx` — the largest content-page migration unit for App Router.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\pages\search.tsx` — query-string-driven route that needs an explicit server/client split under App Router.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\pages\admin.tsx` — late-stage CMS/admin migration surface that likely remains client-only.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\pages\` — legacy route inventory to retire during the Pages Router cleanup phase.

**Verification**

1. Phase 1 through Phase 4 gate: install Playwright browsers, run the static export build, serve the generated site, and run the full desktop-and-mobile Chromium/Firefox/WebKit smoke suite with network interception enabled for all email- or submission-producing form flows.
2. Phase 1 through Phase 4 gate: require visual/layout assertions on key routes in addition to route-level functional checks, using screenshots or snapshots plus structural visibility assertions to catch content disappearance, major spacing shifts, broken responsiveness, and obvious style drift.
3. Phase 5 and later gate: fresh install, targeted dependency upgrade, one-shot TypeScript check, a clean ESLint run with no unresolved findings, static export build, then the full visual smoke suite.
4. App Router migration gates, Phases 7 through 18: after each route-family move, run the most targeted smoke coverage for the migrated route immediately, then rerun the full visual smoke suite before marking the phase complete.
5. App Router cleanup gate, Phase 18: verify that no required production route still depends on `src/pages/`, that removing `_app.tsx` and `_document.tsx` does not change the exported site behavior, and that static export output remains intact.
6. Next 16 gate: explicitly verify the chosen bundler mode. If webpack is retained initially, keep it explicit in scripts until the custom webpack config and plugins are either removed or proven under Turbopack.
7. MUI and FullCalendar gates: in addition to the global smoke suite, pay extra attention to forms, navigation, calendar rendering, layout breakpoints, and visible component styling because those are the most likely UX regressions for these groups.
8. CMS-adjacent gate: run the public smoke suite and then perform your manual CMS verification before moving on, because those packages are intentionally outside the Playwright scope.

**Decisions**

- Scope is the site repo only. The serverless API repo is excluded from this plan.
- The smoke suite should be cross-browser from the start: Chromium, Firefox, and WebKit.
- The smoke suite should cover both desktop and mobile viewports from the start.
- The smoke gate should include visual/layout checks, not just functional assertions, so upgrade regressions that users would notice are caught early.
- `@staticcms/*` stays out of this effort entirely.
- Public smoke tests should stub unstable third-party dependencies rather than rely on live network services, and form smoke tests must never call the live contact or parish-registration endpoints.
- The Pages Router to App Router migration should begin only after the Next 15 upgrade is stable and should finish before the Next 16 upgrade begins.
- During App Router migration, `src/app/` and `src/pages/` may coexist temporarily, but each phase should move only the named route family and should not leave duplicate production path ownership ambiguous.
- Next 16 should be adopted conservatively because the current site still relies on static export plus custom webpack configuration.

**Further Considerations**

1. If a later dependency batch turns out to contain more major hops than expected, split that phase again rather than broadening a single implementation run.
2. If `@mui/base` is unused in application code, removing it may be lower risk than carrying it through multiple framework upgrades.
3. If the Playwright suite becomes slow in daily work, keep the full desktop-and-mobile cross-browser visual suite as the release gate and allow a narrower fast path for local iteration while preserving the full gate for phase completion.
4. Visual baselines should only be updated intentionally after manual review, not casually regenerated during dependency upgrades, or the suite will stop protecting against detrimental UI drift.
