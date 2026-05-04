## Plan: Incremental Site Dependency Upgrades

This plan is organized into explicit phases that can be completed one at a time. The intended execution model is: implement exactly one phase, run that phase’s verification, mark that phase complete in this plan, and stop. A later prompt such as "implement the next phase" should mean: find the first unchecked phase, execute only that phase’s scope, update this plan to mark it done, and then stop without starting the following phase.

**Execution rule**

- Complete exactly one phase per implementation run.
- Do not begin work from a later phase until every earlier phase is marked complete.
- When a phase finishes, update this plan by changing that phase from `[ ]` to `[x]` and add any important notes under that phase.
- If a phase reveals more work than expected, split that phase into substeps, but do not silently spill work into the next phase.

**Phases**

1. `[x]` Phase 1: Build the smoke-test baseline
   Scope: Add Playwright to `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site` with explicit desktop and mobile projects across Chromium, Firefox, and WebKit; create a production-like `webServer` flow that builds the static export and serves the generated output; add a one-shot typecheck and the visual-regression helpers needed for later gates.
   Includes: cross-browser setup, desktop and mobile viewport/device setup, test config, deterministic serving strategy, screenshot and snapshot utilities, layout assertion helpers, non-watch TypeScript verification, package scripts, test helpers and fixtures.
   Excludes: dependency upgrades.
   Notes: Implemented with `playwright.config.ts`, `scripts/serve-export.mjs`, and baseline fixtures/helpers under `tests/smoke/`; added six explicit desktop/mobile browser projects, a one-shot `type-check`, and smoke scripts for browser install, static serving, and test execution. Verified with `npm run type-check`, `npm run smoke:install -- chromium firefox webkit`, and `npm run smoke:test:update`; this generated initial proof snapshots for the custom `404` shell only, while network interception and broader route coverage remain intentionally deferred to Phases 2 and 3.
2. `[ ]` Phase 2: Make external dependencies deterministic
   Scope: Intercept or mock the public-site network dependencies used by smoke tests so the suite is stable, non-destructive, and visually consistent enough for screenshot comparison.
   Includes: mock-only handling for contact, ask, and parish-registration form submissions so they never hit the real deployed endpoints or send real emails; interception for daily-readings RSS and SoundCloud requests; interception for live-stream API calls; interception for Google Calendar-backed event requests; stabilization or masking of inherently dynamic embed surfaces where needed so layout and screenshot assertions stay trustworthy.
   Excludes: real backend/serverless calls, CMS coverage.
   Notes: This phase must guarantee that public form smoke tests cannot trigger real emails.
3. `[ ]` Phase 3: Cover the public-site smoke journeys
   Scope: Add the actual smoke scenarios for the public site on both desktop and mobile viewports.
   Includes: homepage and global navigation, responsive drawer/header/footer behavior, `/mass-confession-times`, `/events`, `/news` list plus one article, `/parish-bulletins` list plus one detail page, `/search`, `/staff`, `/live-stream`, `/contact`, `/ask`, `/test-parish-registration`, and a custom 404 path; per-route assertions that key content is present and visible; best-effort layout and visual assertions using screenshots or snapshots to detect content disappearing, major spacing shifts, broken responsive behavior, obvious color/theme drift, and other user-noticeable regressions.
   Excludes: CMS/admin routes.
   Notes: This phase should validate major UX continuity at a high-confidence level, not just happy-path functionality.
4. `[ ]` Phase 4: Freeze and verify the baseline gate
   Scope: Make the baseline operational and documented before any dependency changes begin.
   Includes: full static export build, full desktop-and-mobile cross-browser smoke run, approval of the initial visual baselines, baseline script cleanup, documentation of intentional exclusions or masked regions, and confirmation that the smoke gate is the required precondition for every upgrade phase.
   Excludes: dependency changes.
   Notes: After this phase, the repo should have a repeatable pre-upgrade verification gate that is strong enough to catch both functional and user-visible layout regressions.
5. `[ ]` Phase 5: React preflight to 18.3
   Scope: Upgrade `react` and `react-dom` from 18.2 to 18.3 and align `@types/react` and `@types/react-dom`, while staying on Next 14.
   Includes: runtime package bump, type package bump, fixes for any new React warnings that surface during the baseline gate.
   Excludes: Next major upgrade.
   Notes: This phase is meant to surface React 19 issues early with minimal framework churn.
6. `[ ]` Phase 6: Core runtime hop from Next 14 to Next 15 and React 19
   Scope: Upgrade the main runtime one major step.
   Includes: `next`, `react`, `react-dom`, `eslint-config-next`, and `@next/eslint-plugin-next`; use the official Next 15 and React 19 migration guides and codemods where they reduce churn.
   Excludes: Next 16 and Next-coupled plugin upgrades.
   Notes: Keep this hop isolated so any runtime regressions are attributable.
7. `[ ]` Phase 7: Core runtime hop from Next 15 to Next 16
   Scope: Upgrade to Next 16 as a separate phase.
   Includes: Next 16 config and behavior adjustments, removal or replacement of any deprecated/removed Next APIs encountered in this repo.
   Excludes: PWA/build add-on upgrades.
   Notes: Because `next.config.mjs` uses `output: 'export'`, a custom `webpack` function, and `next-remove-imports`, the first Next 16 adoption should stay on an explicit webpack-compatible build path until proven stable.
8. `[ ]` Phase 8: Upgrade Next-coupled build add-ons
   Scope: Upgrade the packages that are tightly coupled to the Next build pipeline after Next 16 is stable.
   Includes: `@ducanh2912/next-pwa`, `next-remove-imports`, `@svgr/webpack`, `yaml-loader`, `raw-loader`, and related `next.config.mjs` changes.
   Excludes: MUI and application feature libraries.
   Notes: Keep bundler-mode decisions explicit in this phase.
9. `[ ]` Phase 9: MUI main stack from v5 to v6
   Scope: Upgrade the core Material UI stack one major step.
   Includes: `@mui/material`, `@mui/system`, `@mui/icons-material`, Emotion packages, and any directly coupled theming/styling fixes.
   Excludes: MUI v7 and MUI X pickers v8.
   Notes: Audit `@mui/base` carefully here because it is currently on a beta track and may need migration, replacement, or removal rather than a simple bump.
10. `[ ]` Phase 10: MUI main stack from v6 to v7
    Scope: Upgrade Material UI another major step after v6 is stable.
    Includes: exports-field package layout changes, grid/grid2 rename issues, removed deprecated APIs, theme behavior differences, and any resulting import or styling fixes.
    Excludes: date pickers.
    Notes: Keep this phase isolated from the pickers upgrade.
11. `[ ]` Phase 11: Date stack and MUI X pickers
    Scope: Upgrade `@mui/x-date-pickers` from v7 to v8 together with `date-fns` from v3 to v4.
    Includes: adapter import changes, picker API changes, slot/theme updates, and any application fixes needed for the date stack.
    Excludes: unrelated MUI components.
    Notes: This is where current `AdapterDateFnsV3` usage is expected to change.
12. `[ ]` Phase 12: FullCalendar family
    Scope: Upgrade the FullCalendar ecosystem one major version at a time, with all `@fullcalendar/*` packages kept in lockstep.
    Includes: custom mobile view plugin fixes, Google Calendar integration verification, and event interaction regression checks.
    Excludes: unrelated utility packages.
    Notes: If multiple major hops are required, keep them as explicit substeps inside this phase and verify after each hop.
13. `[ ]` Phase 13: Remaining public-site utility batches
    Scope: Upgrade the remaining public-site libraries in small logical batches.
    Includes: content/data parsing libraries, UI widget libraries, SEO/schema libraries, and general utilities.
    Excludes: developer toolchain and CMS-adjacent packages.
    Notes: Keep each package to one major hop at a time and use official migration docs or release notes at execution time.
14. `[ ]` Phase 14: Developer toolchain modernization
    Scope: Upgrade the local toolchain after the runtime and main UI stack are stable.
    Includes: ESLint 8 to 9, `@typescript-eslint` packages, TypeScript, Prettier, and removal of deprecated `babel-eslint`.
    Excludes: CMS-adjacent runtime packages.
    Notes: Doing this late keeps lint/type noise from obscuring framework regressions.
15. `[ ]` Phase 15: CMS-adjacent packages, excluding Static CMS
    Scope: Upgrade packages that are outside the public smoke suite and will still need manual CMS checks.
    Includes: TinyMCE, `@dnd-kit`, and any other CMS-adjacent libraries except `@staticcms/*`.
    Excludes: `@staticcms/*` entirely.
    Notes: After this phase, public smoke tests still run, but CMS validation remains manual by design.
16. `[ ]` Phase 16: Final dependency sweep
    Scope: Re-run outdated dependency inventory and pick up leftovers.
    Includes: remaining minors, patches, and any still-unfinished single-major packages that fit the already-established grouping rules.
    Excludes: new scope expansion.
    Notes: If a high-impact group still has another major remaining, create a new explicit phase instead of folding it into cleanup.

**Per-phase completion checklist**

1. Read the official migration guide or release notes for that phase’s dependency group before implementation.
2. Implement only the current unchecked phase.
3. Run that phase’s verification steps.
4. Update this plan by marking the phase `[x]` and adding concise notes about what changed, any follow-up constraints, and any intentionally deferred work.
5. Stop after completing that one phase.

**Guide checkpoints**

- Playwright Installation: https://playwright.dev/docs/intro
- React 19 Upgrade Guide: https://react.dev/blog/2024/04/25/react-19-upgrade-guide
- Next.js 15 Upgrade Guide: https://nextjs.org/docs/app/guides/upgrading/version-15
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
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\constants.ts` — external API endpoints used by public forms.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\components\pages\custom\contact\ContactForm.tsx` — mock-only public form smoke target.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\components\pages\custom\ask\AskForm.tsx` — mock-only public form smoke target.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\components\pages\custom\parish-membership\ParishRegistrationForm.tsx` — mock-only form smoke target and server response behavior surface.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\components\widgets\DailyReadings.tsx` — third-party network-dependent homepage widget to stabilize in smoke tests.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\components\events\CalendarView.tsx` — FullCalendar and Google Calendar integration surface.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\components\pages\custom\live-stream\LiveStreamView.tsx` — live-stream shell behavior.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\components\pages\custom\live-stream\useLiveStreamUrl.ts` — API-driven live-stream URL fetching.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\pages\` — route inventory for the public smoke scenarios.

**Verification**

1. Phase 1 through Phase 4 gate: install Playwright browsers, run the static export build, serve the generated site, and run the full desktop-and-mobile Chromium/Firefox/WebKit smoke suite with network interception enabled for all email- or submission-producing form flows.
2. Phase 1 through Phase 4 gate: require visual/layout assertions on key routes in addition to route-level functional checks, using screenshots or snapshots plus structural visibility assertions to catch content disappearance, major spacing shifts, broken responsiveness, and obvious style drift.
3. Phase 5 and later gate: fresh install, targeted dependency upgrade, one-shot TypeScript check, ESLint, static export build, then the full visual smoke suite.
4. Next 16 gate: explicitly verify the chosen bundler mode. If webpack is retained initially, keep it explicit in scripts until the custom webpack config and plugins are either removed or proven under Turbopack.
5. MUI and FullCalendar gates: in addition to the global smoke suite, pay extra attention to forms, navigation, calendar rendering, layout breakpoints, and visible component styling because those are the most likely UX regressions for these groups.
6. CMS-adjacent gate: run the public smoke suite and then perform your manual CMS verification before moving on, because those packages are intentionally outside the Playwright scope.

**Decisions**

- Scope is the site repo only. The serverless API repo is excluded from this plan.
- The smoke suite should be cross-browser from the start: Chromium, Firefox, and WebKit.
- The smoke suite should cover both desktop and mobile viewports from the start.
- The smoke gate should include visual/layout checks, not just functional assertions, so upgrade regressions that users would notice are caught early.
- `@staticcms/*` stays out of this effort entirely.
- Public smoke tests should stub unstable third-party dependencies rather than rely on live network services, and form smoke tests must never call the live contact or parish-registration endpoints.
- Next 16 should be adopted conservatively because the current site still relies on static export plus custom webpack configuration.

**Further Considerations**

1. If a later dependency batch turns out to contain more major hops than expected, split that phase again rather than broadening a single implementation run.
2. If `@mui/base` is unused in application code, removing it may be lower risk than carrying it through multiple framework upgrades.
3. If the Playwright suite becomes slow in daily work, keep the full desktop-and-mobile cross-browser visual suite as the release gate and allow a narrower fast path for local iteration while preserving the full gate for phase completion.
4. Visual baselines should only be updated intentionally after manual review, not casually regenerated during dependency upgrades, or the suite will stop protecting against detrimental UI drift.
