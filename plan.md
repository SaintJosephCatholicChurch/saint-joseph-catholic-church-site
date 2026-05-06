## Plan: Remaining Site Dependency Upgrades

This plan starts from the current repo state after the completed smoke-baseline work, the Next 15 and React 19 hop, the App Router migration, and the Pages Router cleanup. Those completed phases have been removed so this file now tracks only the dependency work that still remains.

The active admin surface is now part of this plan. That means dependencies used by `src/admin/` and `src/cms/` are in scope, but the admin area does not need smoke coverage during the upgrade run. Public smoke coverage stays in place as the regression gate for the site, and admin validation is deferred to the end of the dependency-upgrade sequence.

**Execution rule**

- Complete exactly one phase per implementation run.
- Do not begin work from a later phase until every earlier phase is marked complete.
- When a phase finishes, update this plan by changing that phase from `[ ]` to `[x]` and add any important notes under that phase.
- Do not mark a phase complete until its required verification has been run.
- If a phase reveals more work than expected, split that phase into explicit substeps or a new later phase, but do not silently spill work into the next phase.

**Phases**

1. `[x]` Phase 1: Core runtime hop from Next 15 to Next 16
   Scope: Upgrade the main runtime one major step while preserving the current static-export deployment model.
   Includes: `next`, `eslint-config-next`, and `@next/eslint-plugin-next`; any required Next 16 config or behavior changes; and explicit documentation of the bundler path chosen for this repo.
   Excludes: PWA/build add-on package upgrades.
   Notes: Upgraded `next`, `eslint-config-next`, and `@next/eslint-plugin-next` to `16.2.2`, and added the minimum ESLint compatibility adjustments required by that hop (`eslint` 9 flat config, `@typescript-eslint` 8.46.3, and `eslint-plugin-import` 2.32.0) without broadening runtime scope. Locked the repo to the documented webpack path in `package.json` (`next dev --webpack`, `next build --webpack`, including the analyze build), removed the unsupported Next 16 `eslint` config key, and gated the production PWA wrapper behind `NEXT_ENABLE_PWA=true` so Phase 2 can revalidate it explicitly. Verified with `npm install`, `npm run build`, `npm run lint`, `npm run type-check`, targeted Playwright snapshot refreshes after manual review of the approved Next 16 visual drift, and a final clean `npm run smoke:gate` (`133 passed`, `5 skipped`). The lint gate still reports 10 existing warnings with no errors; those warnings were preserved rather than expanded in this phase.
2. `[x]` Phase 2: Build pipeline and bundler add-ons
   Scope: Upgrade or remove the packages coupled directly to the Next build pipeline after Next 16 is stable.
   Includes: `@ducanh2912/next-pwa`, `@svgr/webpack`, `yaml-loader`, `webpack`, and removal of stale build-only dependencies when they are proven unused.
   Excludes: TinyMCE and other editor-runtime upgrades beyond the loader/build-path work required to keep them building.
   Notes: Removed the dead `@svgr/webpack` and `yaml-loader` path after confirming there are no current `.svg` or `.yml` source imports exercising those rules, and replaced the live TinyMCE `raw-loader` inline CSS imports with webpack 5 `asset/source` imports via `?raw` so the CMS bundle keeps receiving CSS strings without the deprecated loader. Kept the explicit webpack build path and retained the top-level `webpack` package because `@ducanh2912/next-pwa` still declares a webpack peer dependency; updated that package to the current patch release in this phase (`5.106.2`). Verified with `npm install`, repeated focused `npm run build` checks on the touched webpack slice, and a final clean `npm run smoke:gate` (`133 passed`, `5 skipped`). The lint baseline is now down to 8 existing warnings, with no new warnings introduced by this phase.
3. `[x]` Phase 3: MUI main stack from v5 to v6
   Scope: Upgrade the core Material UI stack one major step across both the public site and the admin area.
   Includes: `@mui/material`, `@mui/system`, `@mui/icons-material`, Emotion package alignment, and the direct styling/theme fixes required in `src/components/`, `src/admin/`, and `src/cms/`.
   Excludes: MUI v7 and MUI X pickers.
   Notes: Upgraded `@mui/material`, `@mui/system`, and `@mui/icons-material` to `6.5.0`. The site and admin code paths type-checked clean without source-level MUI compatibility edits, so the only follow-up work in this phase was smoke-harness stabilization: the search smoke test now scopes its page-title assertion to the main `h1`, screenshot capture now waits for the mocked daily readings text before taking baselines, and the approved mobile `events` and `search-results` snapshots were refreshed for minor MUI-rendering drift. Verified with `npm install`, `npm run type-check`, focused Playwright reruns for the affected mobile and Firefox desktop smoke cases, and a final clean `npm run smoke:gate` (`133 passed`, `5 skipped`). The existing lint baseline remains 8 warnings with no errors. The direct `@mui/base` dependency has already been removed; if it still appears in the lockfile, treat it as transitive fallout from the remaining MUI stack until those packages are upgraded.
4. `[x]` Phase 4: MUI main stack from v6 to v7
   Scope: Upgrade Material UI another major step after v6 is stable.
   Includes: exports-field package layout changes, deprecated API removals, theme behavior differences, and any resulting public-site or admin-shell import/styling fixes.
   Excludes: date pickers.
   Notes: Upgraded `@mui/material`, `@mui/system`, and `@mui/icons-material` to `7.3.10`. Reviewed the official MUI v7 migration guide and confirmed the repo does not currently rely on the removed or renamed core APIs called out there, including deep nested package imports, `Grid2`/`GridLegacy`, `StyledEngineProvider`, `onBackdropClick`, and `InputLabel size="normal"`, so the phase completed without source-level compatibility edits. Verified with `npm install`, `npm run type-check`, and a final clean `npm run smoke:gate` (`133 passed`, `5 skipped`). The existing lint baseline remains 8 warnings with no errors, and admin-specific manual UX testing remains deferred until the final handoff phase.
5. `[x]` Phase 5: Date stack and MUI X pickers
   Scope: Upgrade the shared date stack used by the public calendar surfaces and admin/CMS editors.
   Includes: `@mui/x-date-pickers` and `date-fns` together, `date-fns-tz` if needed for compatibility, adapter import changes, and picker API fixes.
   Excludes: FullCalendar major changes.
   Notes: Upgraded `@mui/x-date-pickers` to `8.28.4` and `date-fns` to `4.1.0`, and switched the public and admin `LocalizationProvider` imports from `AdapterDateFnsV3` to the v8 `AdapterDateFns` path. The existing `DateCalendar` and `TimePicker` call sites continued to type-check without additional picker API changes, and `date-fns-tz` was not needed for compatibility in this phase. After manual review of a small mobile Chromium date-picker rendering drift on `/events`, refreshed the approved `events-mobile` snapshot for that one project. Verified with `npm install`, `npm run type-check`, the focused Playwright rerun for the mobile Chromium events baseline, and a final clean `npm run smoke:gate` (`133 passed`, `5 skipped`). The existing lint baseline remains 8 warnings with no errors.
6. `[x]` Phase 6: FullCalendar family
   Scope: Upgrade the FullCalendar ecosystem in lockstep after the shared date stack is stable.
   Includes: all `@fullcalendar/*` packages, the custom mobile and upcoming-event plugins, Google Calendar integration, and any event-rendering fixes required by the upgrade.
   Excludes: unrelated MUI or admin-editor packages.
   Notes: Upgraded `@fullcalendar/core`, `@fullcalendar/daygrid`, `@fullcalendar/google-calendar`, `@fullcalendar/list`, `@fullcalendar/react`, and `@fullcalendar/timegrid` in lockstep from `6.1.11` to `6.1.20`. Reviewed the official FullCalendar v6 upgrade documentation before implementation and confirmed the current public calendar surfaces and custom mobile/upcoming plugins stay within the existing v6 React/plugin contract, so this phase completed without source-level compatibility edits. Verified with `npm install`, focused `npm run type-check`, and a final clean `npm run smoke:gate` (`133 passed`, `5 skipped`). The existing lint baseline remains 8 warnings with no errors.
7. `[ ]` Phase 7: Admin editor stack
   Scope: Upgrade the rich-text and editor packages that are concentrated in the admin and CMS surfaces.
   Includes: `tinymce`, `@tinymce/tinymce-react`, `@ephox/katamari`, the bundled editor code under `src/cms/widgets/editor/`, the custom TinyMCE plugins, and the admin HTML/document editors.
   Excludes: drag-and-drop packages except for compatibility fixes that are unavoidable while keeping the editors working.
   Notes: This phase is intentionally admin-heavy. Do not add smoke coverage for these surfaces; rely on repo-wide verification during the upgrade run and defer hands-on admin testing until the final phase.
8. `[ ]` Phase 8: Admin interaction and content-builder stack
   Scope: Upgrade the packages that power admin drag-and-drop editing, preview sanitization, and content-builder utilities.
   Includes: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `dompurify`, `uuid`, and the affected content/times editors under `src/admin/` and `src/cms/`.
   Excludes: unrelated public-site utility libraries.
   Notes: Keeping this after the MUI and TinyMCE work should reduce the number of overlapping breakpoints in the admin surface.
9. `[ ]` Phase 9: Remaining public-site and script utility batches
   Scope: Upgrade the non-framework runtime libraries that remain after the major platform work is complete.
   Includes: `@fortawesome/*`, `fast-xml-parser`, `react-window`, `react-slideshow-image`, `react-schemaorg`, `schema-dts`, `pdf.js-extract`, and the remaining safe public or script utility upgrades surfaced by `npm outdated`.
   Excludes: developer toolchain packages and admin-only editor stacks.
   Notes: Keep each package family to one major hop at a time. If a utility upgrade touches only scripts, document that clearly in the phase notes instead of broadening the phase scope.
10. `[ ]` Phase 10: Developer toolchain modernization
    Scope: Upgrade the local toolchain after the runtime and main UI/editor stacks are stable.
    Includes: ESLint 8 to 9, `@typescript-eslint/*`, TypeScript, Prettier, resolver and lint plugins, `@emotion/eslint-plugin`, and removal of deprecated `babel-eslint`.
    Excludes: runtime library changes except the compatibility adjustments strictly required by the toolchain migration.
    Notes: Keep the ESLint 9 migration explicit even though newer majors exist. If the toolchain phase is still too large, split it into an ESLint ecosystem substep and a TypeScript/dev-utilities substep before continuing.
11. `[ ]` Phase 11: Final dependency sweep and admin handoff
    Scope: Re-run the outdated inventory, finish any leftovers, and prepare the repo for manual admin validation.
    Includes: remaining minors and patches, removal of proven-unused dependencies, verification that no stale upgrade placeholders remain in `package.json`, and a concise admin manual-test checklist for the post-upgrade work.
    Excludes: new feature work.
    Notes: This is where deferred admin verification becomes required before resuming work on the new admin area. The goal is to finish the dependency program first, then do the hands-on admin pass once instead of mixing that manual work into every phase.

**Per-phase completion checklist**

1. Read the official migration guide or release notes for that phase’s dependency group before implementation.
2. Implement only the current unchecked phase.
3. Run a fresh install when dependency versions change.
4. Run any focused validation that directly exercises the touched slice.
5. Run `npm run smoke:gate` as the required public regression gate unless the phase notes explicitly establish a narrower temporary substep inside that phase before the final gate.
6. Update this plan by marking the phase `[x]` and adding concise notes about what changed, any follow-up constraints, and any intentionally deferred work.
7. Stop after completing that one phase.

**Guide checkpoints**

- Next.js 16 Upgrade Guide: https://nextjs.org/docs/app/guides/upgrading/version-16
- Material UI v6 Guide: https://mui.com/material-ui/migration/upgrade-to-v6/
- Material UI v7 Guide: https://mui.com/material-ui/migration/upgrade-to-v7/
- MUI X Pickers v7 to v8 Guide: https://mui.com/x/migration/migration-pickers-v7/
- ESLint v9 Migration Guide: https://eslint.org/docs/latest/use/migrate-to-9.0.0
- For the PWA/build, TinyMCE, DnD Kit, FullCalendar, and later utility batches, use the official release notes or migration guide for each package family at the moment that phase is executed.

**Relevant files**

- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\package.json` — current dependency inventory and verification scripts.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\next.config.mjs` — static export, custom webpack, and PWA wrapping; highest-risk surface for the Next 16 and build-pipeline phases.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\app\admin\page.tsx` — App Router admin route entry point.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\app\client-pages\SpecialPageViews.tsx` — client-only admin/CMS boundary to preserve during dependency work.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\admin\` — primary custom admin surface affected by MUI, TinyMCE, DOMPurify, and DnD Kit upgrades.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\cms\` — CMS/editor widgets and shared content-editing infrastructure.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\components\events\` — FullCalendar and shared picker usage.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\components\navigation\GiveButton.tsx` — active Font Awesome usage.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\components\pages\custom\bulletins\ParishBulletinsView.tsx` — active `react-window` usage.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\lib\rss.ts` — active `fast-xml-parser` usage.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\scripts\pdf-to-images.ts` — active `pdf.js-extract` usage.

**Verification**

1. Every dependency-upgrade phase still ends with the public regression gate: `npm run smoke:gate`.
2. The admin area is now in scope for dependency work, but it is not added to the Playwright smoke suite.
3. Admin-heavy phases should rely on typecheck, lint, build, and the public smoke gate during execution; manual admin validation is intentionally deferred until the dependency-upgrade sequence is complete.
4. Next 16 verification must explicitly confirm the chosen bundler mode and that the static export build path remains intact.
5. MUI, picker, and FullCalendar phases should pay extra attention to forms, navigation, calendar rendering, layout breakpoints, and visible styling regressions in the public smoke results.
6. The final phase must end with a dedicated manual admin pass covering shell navigation, document and page editing, TinyMCE editing, bulletin/media management, drag-and-drop content builders, previews, and save/publish flows before further admin feature work resumes.

**Decisions**

- Scope is the site repo only. The serverless API repo is excluded from this plan.
- Completed baseline, Next 15, App Router, and Pages Router cleanup work has been removed from this file instead of being retained as historical backlog.
- Public smoke tests remain the release gate for dependency phases.
- The active admin/CMS surface is custom `src/admin/` and `src/cms/`; there is no active `@staticcms/*` package surface in the current source tree.
- Admin-specific manual testing is intentionally deferred until after the dependency upgrades are complete.
- Next 16 should be adopted conservatively because the site still relies on static export plus custom webpack configuration and editor-related loader behavior.
- When a dependency is proven unused, remove it instead of carrying it forward to a later cleanup phase.

**Further considerations**

1. If a later dependency batch turns out to contain more major hops than expected, split that phase again rather than broadening a single implementation run.
2. `raw-loader` is still part of the CMS editor path and needs an intentional replacement or retention decision before loader cleanup is complete.
3. Visual baselines should only be updated intentionally after manual review, not casually regenerated during dependency upgrades, or the suite will stop protecting against detrimental UI drift.
