# Dependency Upgrade Plan

This plan covers both repositories in this workspace:

- `saint-joseph-catholic-church-site`
- `church-website-serverless-api`

## 1) Scope And Current State

### Website repo: `saint-joseph-catholic-church-site`

Minor/patch updates were already applied. Remaining outdated packages are major-version upgrades (or migration-sensitive tooling updates).

### Serverless repo: `church-website-serverless-api`

Minor/patch updates were already applied. Remaining outdated packages are:

- `@sparticuz/chromium` `138.0.2 -> 143.0.4`
- `nodemailer` `7.0.13 -> 8.0.2`

## 2) Safety Rules For Every Upgrade Batch

1. Create a branch in each repo before major upgrades.
2. Upgrade in small, compatible groups (framework first, then ecosystem packages).
3. Run validation after each group:
   - Website: `npm run lint && npm run build`
   - Serverless: `npm run live`
4. If a batch fails, revert only that batch and continue with lower-risk items.

## 3) Recommended Upgrade Order

## Phase A: Framework Stack (Website)

### A1. Next.js + React + React DOM + Next ESLint plugin + eslint-config-next

- Packages:

  - `next` `14.2.35 -> 16.1.6`
  - `react` `18.3.1 -> 19.2.4`
  - `react-dom` `18.3.1 -> 19.2.4`
  - `@next/eslint-plugin-next` `14.2.35 -> 16.1.6`
  - `eslint-config-next` `14.2.35 -> 16.1.6`

- Migration guides:

  - Next.js codemods guide: https://nextjs.org/docs/app/guides/upgrading/codemods
  - Next.js v15 upgrade guide: https://nextjs.org/docs/app/guides/upgrading/version-15
  - Next.js v16 upgrade guide: https://nextjs.org/docs/app/guides/upgrading/version-16

- Command sequence:

  1. `npx @next/codemod@canary upgrade major`
  2. `npm install`
  3. `npm run lint && npm run build`

- Notes:
  - Expect async request API updates (`cookies`, `headers`, `params`, `searchParams`) from Next 15+.
  - Keep `@types/react` on v18 until framework/app code is stable, then move types to v19.

## Phase B: MUI Family (Website)

### B1. Material UI core

- Packages:

  - `@mui/material` `5.18.0 -> 7.3.9`
  - `@mui/system` `5.18.0 -> 7.3.9`
  - `@mui/icons-material` `5.18.0 -> 7.3.9`

- Migration guides:
  - MUI migration hub: https://mui.com/material-ui/migration/
  - MUI v5 -> v6 guide: https://mui.com/material-ui/migration/upgrade-to-v6/
  - MUI v6 -> v7 guide: https://mui.com/material-ui/migration/upgrade-to-v7/

### B2. Date pickers

- Package:

  - `@mui/x-date-pickers` `7.29.4 -> 8.27.2`

- Migration guides:

  - MUI X migration hub: https://mui.com/x/migration/
  - MUI X v8 migration: https://mui.com/x/migration/migration-pickers-v7/
  - If holding Material UI v5/v6 temporarily: https://mui.com/x/migration/usage-with-material-ui-v5-v6/

- Notes:
  - MUI X v8 is aligned to modern MUI; do this after core MUI upgrade.

## Phase C: Lint/Type Toolchain (Website)

### C1. ESLint ecosystem

- Packages:

  - `eslint` `8.57.1 -> 10.0.3`
  - `@typescript-eslint/eslint-plugin` `7.18.0 -> 8.57.0`
  - `@typescript-eslint/parser` `7.18.0 -> 8.57.0`
  - `eslint-config-prettier` `9.1.2 -> 10.1.8`
  - `eslint-plugin-unicorn` `52.0.0 -> 63.0.0`

- Migration guides:
  - ESLint v9 migration: https://eslint.org/docs/latest/use/migrate-to-9.0.0
  - typescript-eslint docs: https://typescript-eslint.io/
  - eslint-config-prettier changelog: https://github.com/prettier/eslint-config-prettier/blob/main/CHANGELOG.md
  - eslint-plugin-unicorn releases: https://github.com/sindresorhus/eslint-plugin-unicorn/releases

### C2. Type package alignment

- Packages:

  - `@types/node` `18.19.130 -> 25.5.0`
  - `@types/react` `18.3.28 -> 19.2.14`
  - `@types/uuid` `9.0.8 -> 10.0.0`

- Notes:
  - Align `@types/react` only after React 19 is in place.
  - `@types/dompurify` is deprecated (stub). Remove it instead of upgrading.

## Phase D: Runtime Library Majors (Website)

Upgrade these one at a time with build checks after each:

1. `date-fns` `3.6.0 -> 4.1.0`
   - Changelog/releases: https://github.com/date-fns/date-fns/releases
2. `fast-xml-parser` `4.5.4 -> 5.5.5`
   - Docs: https://github.com/NaturalIntelligence/fast-xml-parser
3. `uuid` `9.0.1 -> 13.0.0`
   - README (ESM/CJS usage guidance): https://github.com/uuidjs/uuid
4. `tinymce` `6.8.6 -> 8.3.2`
   - Upgrade docs: https://www.tiny.cloud/docs/tinymce/latest/migration-from-6x/
5. `@tinymce/tinymce-react` `4.3.2 -> 6.3.0`
   - Repo/changelog: https://github.com/tinymce/tinymce-react
6. `@dnd-kit/sortable` `8.0.0 -> 10.0.0`
   - Releases: https://github.com/clauderic/dnd-kit/releases
7. Font Awesome packages:
   - `@fortawesome/fontawesome-svg-core` `6.7.2 -> 7.2.0`
   - `@fortawesome/free-regular-svg-icons` `6.7.2 -> 7.2.0`
   - `@fortawesome/free-solid-svg-icons` `6.7.2 -> 7.2.0`
   - `@fortawesome/react-fontawesome` `0.2.6 -> 3.2.0`
   - Docs: https://docs.fontawesome.com/web/use-with/react/
8. `react-window` `1.8.11 -> 2.2.7`
   - Releases: https://github.com/bvaughn/react-window/releases
9. Tooling/native stack:
   - `canvas` `2.11.2 -> 3.2.1`
   - `cross-env` `7.0.3 -> 10.1.0`
   - `netlify-cli` `17.38.1 -> 24.2.0`
   - `node-gyp` `10.3.1 -> 12.2.0`
   - `@npmcli/git` `3.0.2 -> 7.0.2`
   - Migration/release references:
     - canvas releases: https://github.com/Automattic/node-canvas/releases
     - cross-env releases: https://github.com/kentcdodds/cross-env/releases
     - netlify-cli releases: https://github.com/netlify/cli/releases
     - node-gyp releases: https://github.com/nodejs/node-gyp/releases

## Phase E: Serverless Repo Majors

### E1. Nodemailer

- Package: `nodemailer` `7.0.13 -> 8.0.2`
- Migration notes:
  - Changelog (contains v8 breaking changes): https://github.com/nodemailer/nodemailer/blob/main/CHANGELOG.md
  - Key break noted: error code rename (`NoAuth` -> `ENOAUTH`) and internal behavior changes.

### E2. Chromium package

- Package: `@sparticuz/chromium` `138.0.2 -> 143.0.4`
- Migration notes:
  - Releases/changelog source: https://github.com/Sparticuz/chromium/releases
  - Validate with `puppeteer-core` compatibility in `scripts/live.mjs` execution path.

## 4) Concrete Command Playbook

### Website repo

1. `cd s:/Repositories/SaintJosephCatholicChurch/saint-joseph-catholic-church-site`
2. `git checkout -b deps/major-upgrade-plan`
3. Phase A: run Next codemod, install, lint/build.
4. Phase B: upgrade MUI packages, install, lint/build.
5. Phase C: upgrade lint stack, run lint first, then build.
6. Phase D: upgrade each runtime major package individually with `npm install <pkg>@latest`, then `npm run lint && npm run build`.

### Serverless repo

1. `cd s:/Repositories/SaintJosephCatholicChurch/church-website-serverless-api`
2. `git checkout -b deps/major-upgrade-plan`
3. `npm install nodemailer@latest`
4. `npm run live`
5. `npm install @sparticuz/chromium@latest`
6. `npm run live`

## 5) Exit Criteria

Upgrade work is complete when:

1. `npm outdated` returns empty (or only intentionally pinned packages).
2. Website passes `npm run lint` and `npm run build`.
3. Serverless `npm run live` succeeds without runtime errors.
4. Any intentional holds are documented in `package.json` comments (or in PR notes).

## 6) Known Issues To Address During Upgrade

1. `@types/dompurify` should be removed (deprecated stub; dompurify ships types).
2. `scripts/live.mjs` currently fails with a path-argument runtime issue in CI mode; verify whether this is env/input-related or exposed by dependency behavior changes before finalizing serverless upgrades.
3. Keep `@mui/base` on `5.0.0-beta.40` unless there is an explicit migration to `@base-ui/react`.
