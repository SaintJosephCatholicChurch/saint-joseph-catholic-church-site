# Plan: Run the old (Static CMS) and new admin side by side

## Problem

`main` ships the old Static CMS admin at `/admin`. `feature/new-admin` replaces it with a custom admin (`src/admin`). It also upgrades the stack: Next 16, MUI 7, TinyMCE 8, x-date-pickers 8, and ESLint 9.

We want both admins in the repo and in production at the same time, so parish staff can try the new one and switch back at any time. Requirements:

- The old admin works and looks the same as today. The only addition is a small **"Try the new admin"** control.
- The new admin gets a **"Switch to old admin"** control, so nobody can get stuck.
- The `@staticcms/lite` package is not modified.
- Rollout: run both side by side → collect feedback and train users → cut over by deleting the old admin. The end state is what `feature/new-admin` already has.

## Confirmed decisions

| Topic                    | Decision                                                                                                                                                                            |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Working branch           | New integration branch `feature/admin-coexistence`, created off `feature/new-admin`                                                                                                 |
| URLs                     | Old admin stays at **`/admin`** (bookmarks, OAuth, and `#/collections/...` hash links keep working, and it remains the "never stuck" fallback). New admin goes to **`/new-admin`**. |
| Old-admin switch control | Same-tab **sidebar link** plus a small **floating pill** that also shows on the login screen                                                                                        |
| Old-admin editor         | **Upgrade to TinyMCE 8** by reusing the new admin's `BundledEditor` (details in Phase 1)                                                                                            |
| Logins                   | **Separate.** Users sign in once in each admin; the two sessions are independent.                                                                                                   |
| Deployment               | Out of scope; the user deploys manually (see deployment notes at the end)                                                                                                           |
| `/help` public page      | Unchanged from the feature branch (new admin's Help). The old admin's in-CMS Help keeps its old content.                                                                            |

## Coexistence architecture

```
/admin        → src/app/admin/page.tsx     → AdminPageView    → dynamic(src/cms/CMSView, ssr:false)        [OLD]
/new-admin    → src/app/new-admin/page.tsx → NewAdminPageView → AdminErrorBoundary → dynamic(src/admin/AdminShell, ssr:false) [NEW]

Old → New : sidebar "Try the New Admin" (Static CMS additional-link page that does location.replace) + floating pill <a href>
New → Old : "Switch to old admin" <a href> on login page, app bar, mobile drawer, and error boundary
```

- **Use full page loads for every switch** (plain `<a href>` or `location`), never Next `<Link>`/`router`. The two admins must never run in the same page session:
  - Static CMS mounts its own root (`#nc-root`) and injects global CSS.
  - Both admins use the global `window.tinymce`.
- **Path constants** live in `src/admin/adminConfig.ts`:
  - `ADMIN_BASE_PATH = '/new-admin'`
  - `LEGACY_ADMIN_PATH = '/admin'`

  At cutover `ADMIN_BASE_PATH` becomes `/admin` and `LEGACY_ADMIN_PATH` is deleted.

- **Import direction is one way:** old code (`src/cms`, `src/components/previews`) may import from `src/admin`, never the reverse. Cutover is then just deleting the old directories.
- **Static export:** Next emits `out/admin.html` and `out/new-admin.html`. Netlify serves both as pretty URLs, the same way `/admin` works today. No server routes are needed.

### Facts verified while planning

- Content files (`content/**`) are **identical** on `main` and `feature/new-admin`. The only model change is an optional `pdfs?: string[]` on bulletins (plus a `clientId` that is never persisted).
- Static CMS lite renders additional links whose `data` is a URL string with a hardcoded `target="_blank"` (`components/navbar/NavLink.tsx`). Additional links whose `data` is a **component** render in-app at `#/page/<id>`. That's how we get same-tab navigation without touching the package.
- The Static CMS sidebar appears only after login, on collection screens (on mobile, in the bottom-nav drawer). That's why the floating pill is needed for the login screen.
- Static CMS stores its session in `localStorage['static-cms-user']`. The new admin uses `site-admin-connected-session` / `site-admin-preview-session`. They don't collide.
- The new admin is path-agnostic: every navigation uses `usePathname()`. The only hardcoded admin URL is `AdminShell.tsx` ~line 915 (`href="/admin?view=help"`).
- The new admin has no React error boundary. It does have a `beforeunload` unsaved-changes guard (`src/admin/unsavedChanges.tsx`), so a full-page switch link prompts before discarding edits. Static CMS has its own guard.
- New-admin caches are safe across switches. In-memory caches reset on a full page load. sessionStorage bulletin/document caches are checked against current file SHAs, and persisted GitHub responses revalidate with ETags.
- The old admin's code compiles on the new stack with only the fixes listed in Phase 1:
  - Its MUI imports are all 2nd-level paths that exist in MUI 7 (no Grid, `components`, or `InputProps` usage).
  - dnd-kit and date-fns APIs it uses are unchanged.
  - Every shared helper and component it imports still exists.
- The old editor plugins (`bible-autolink`, `cms-file`, `cms-image`, `telephone-autolink`) are byte-identical to the new admin's TinyMCE 8 copies, apart from a type-only tweak.
- The new `src/admin/components/editor/BundledEditor.tsx` has the **same props** as the old one (`onOpenMediaLibrary`, `theme`, `init`). It is the TinyMCE 8 port of the same file.
- `@staticcms/lite@2.0.2` declares only `react`/`react-dom` ^19.2 as peers and pins its own MUI internally (nested install). The repo's `.npmrc` has `legacy-peer-deps=true`.

---

## Phase 1: Restore the old admin and split the routes (one session)

Goal: the integration branch builds, with the old admin at `/admin` and the new admin at `/new-admin`. No switch controls yet.

1. **Branch:** confirm `git status` is clean, then `git switch -c feature/admin-coexistence feature/new-admin`.
2. **Restore old-admin files verbatim from `main`** (do **not** restore the old `BundledEditor.tsx` or the `plugins/` folder):
   ```
   git checkout main -- src/cms/CMSView.tsx src/cms/config.ts src/cms/pages src/cms/widgets/times \
     src/cms/widgets/editor/EditorControl.tsx src/cms/widgets/editor/EditorPreview.tsx src/components/previews
   ```
3. **Dependencies:**
   - Run `npm install --save-exact @staticcms/lite@2.0.2`.
   - Restore the dev script `"local-cms": "npx @staticcms/proxy-server@^4"`. In development, `CMSView` sets `local_backend = true`, which needs this proxy.
   - Commit `package-lock.json`.
4. **Minimal compatibility fixes.** Make only these changes, plus anything `type-check` surfaces, fixed the smallest way possible:
   - `src/cms/widgets/editor/EditorControl.tsx`:
     - Change `import BundledEditor from './BundledEditor'` to import `../../../admin/components/editor/BundledEditor`.
     - Keep everything else as is: Static CMS media hooks, `fromEditorToStorage`, and the init/menu/toolbar config.
   - `src/admin/components/editor/BundledEditor.tsx`: add `import 'tinymce/plugins/autoresize';`. The old editor's `init.plugins` enables `autoresize`, and TinyMCE 8 still ships it. Registering it has no effect on the new admin, whose init doesn't list it. Without the import, TinyMCE 8 tries to fetch the plugin by URL, fails, and the old editor loses its auto-height behavior.
   - `src/cms/widgets/times/TimesWidget.tsx`: change `@mui/x-date-pickers/AdapterDateFnsV3` to `@mui/x-date-pickers/AdapterDateFns`. v8 removed the V3 entry, and `AdapterDateFns` supports date-fns 3 and 4.
   - `src/components/previews/HomePagePreview.tsx`: `HomepageView` now requires two more props. Pass `churchDetails` (from `../../lib/church_details`) and `privacyPolicyUrl={config.privacy_policy_url}` (from `../../lib/config`), the same way `src/app/HomepagePage.tsx` does.
5. **ESLint:** in `eslint.config.mjs`, add a temporary `globalIgnores(['src/cms/**', 'src/components/previews/**'])` with the comment `// Legacy Static CMS admin, kept as-is during coexistence; delete at cutover`. This keeps the restored files close to `main` for easy diffing. `tsc` still type-checks them.
6. **Path constants (`src/admin/adminConfig.ts`):** add `ADMIN_BASE_PATH = '/new-admin'` and `LEGACY_ADMIN_PATH = '/admin'`. In `AdminShell.tsx`, replace `href="/admin?view=help"` with `` `${ADMIN_BASE_PATH}?view=help` ``.
7. **Route split:**
   - `src/app/client-pages/SpecialPageViews.tsx`:
     - Restore `AdminPageView` to `main`'s version (dynamic `../../cms/CMSView`, `ssr:false`, `key="admin"`).
     - Add `NewAdminPageView`: dynamic `../../admin/AdminShell`, `ssr:false`, `key="new-admin"`.
   - `src/app/admin/page.tsx`: keep as is. It renders `AdminPageView` with the `noindex` metadata already present on the feature branch; metadata isn't visible to users.
   - Add `src/app/new-admin/page.tsx`. It mirrors `src/app/admin/page.tsx` with `url: '/new-admin'`, `title: 'New Admin'`, and `robots: { index: false, follow: false }`, and renders `NewAdminPageView`.
8. **Agent guidance:** add a short "Admin coexistence period" note to `AGENTS.md`, `.github/copilot-instructions.md`, and the relevant `.cursor/rules/*.mdc`. The note says:
   - `/admin` is the legacy Static CMS (`src/cms`, `src/components/previews`). Keep it working; don't extend it.
   - `/new-admin` is `src/admin`. All new work goes there.

   This keeps later agent sessions from "fixing" the restored code. Fix statements like "no Static CMS" and "`/admin` loads AdminShell" so they read correctly for now; Phase 4 does the full rewrite.

9. **Validate:**
   - `npm run type-check`
   - `npm run lint`
   - `npx --no-install eslint` on the changed `src/app/**` / `src/admin/**` `.tsx` files
   - `npm run build`
   - Confirm `out/admin.html` and `out/new-admin.html` exist.
   - Quick `npm run dev` smoke test: `/admin` shows the Static CMS login; `/new-admin` shows the new login.

Acceptance:

- Build is green.
- The old admin renders at `/admin`: Static CMS chrome, collections, and previews.
- The new admin is fully functional at `/new-admin`.
- Public routes are unchanged.

## Phase 2: Switch controls and safety net (one session)

Goal: users can move between admins with one click and never get stuck.

**Old admin (`src/cms/CMSView.tsx`). Additions only; nothing existing changes:**

1. Register an icon, for example `CMS.registerIcon('new-admin', ...)` using an existing FontAwesome free-solid icon such as `faWandMagicSparkles` (confirm it exists in FA 7).
2. Add `src/cms/pages/new-admin/NewAdminRedirect.tsx`. On mount it calls `window.location.replace(ADMIN_BASE_PATH)`. It renders "Opening the new admin…" plus a plain fallback `<a href>`.
3. Call `CMS.registerAdditionalLink({ id: 'new-admin', title: 'Try the New Admin', data: NewAdminRedirect, options: { icon: 'new-admin' } })`:
   - Register it **before** the Events and Help links, so it's the first extra link under the collections.
   - `replace` means the Back button won't bounce the user back into the redirect.
4. Add a **floating pill** to `CMSView`'s returned JSX (it sits outside Static CMS's `#nc-root`): `<a href={ADMIN_BASE_PATH}>Try the new admin</a>`.
   - Style it with a scoped `<style jsx>`: `position: fixed`, small, high-contrast, in the site's burgundy (`#7f232c`).
   - Default position is bottom-left.
   - Pick a z-index below Static CMS modals and dialogs; check the media library, the delete confirmation, and toasts.
   - Below Static CMS's mobile breakpoint, lift the pill above the bottom navigation bar (measure the breakpoint in the browser).
   - Check with the browser tools on the login screen, collection list, entry editor, media library, and mobile width.
   - If the pill covers editor controls, hide it on editor routes (`#/collections/*/entries/*`, `#/collections/*/new`) using a `hashchange` listener. The sidebar link is still there as the fallback.

**New admin:** 5. Add `src/admin/components/SwitchToOldAdminButton.tsx`, an MUI `Button` with `href={LEGACY_ADMIN_PATH}` (renders a plain `<a>`, so it's a full page load). Label it "Switch to old admin", or "Old admin" on `xs` if space is tight. 6. Place it in `AdminShell.tsx`:

- the login page action `Stack` (next to Connect GitHub / Help / Return to site)
- the app bar, next to "Return to site" (covers signed-in pages and the unauthenticated Help view)
- the mobile sidebar footer, above Logout

7. Add `src/admin/AdminErrorBoundary.tsx`:
   - A class component with no `AdminShell` import and no dependency on the admin theme provider.
   - In `NewAdminPageView`, wrap the dynamic `AdminShell` with it. It catches render errors **and** dynamic chunk-load failures.
   - Fallback UI: a short message, a "Switch to old admin" link, and a "Reload" button.
8. Validate:
   - `npm run type-check`
   - `npx --no-install eslint` on the changed new-admin and app `.tsx` files (old files are ignored)
   - `npm run build`
   - In the browser, check each switch path both ways, the Back-button behavior, and that each admin's unsaved-changes prompt fires when switching mid-edit.
   - Check the error boundary by temporarily throwing inside `AdminShell`; revert afterward.

Optional, only if requested: deep-link mapping between admins (for example `/admin#/collections/news` ↔ `/new-admin?view=news`). Not required for the "never stuck" goal.

## Phase 3: Content compatibility audit and guards (one session; can run in parallel with Phase 2)

Both admins commit straight to `main` through the GitHub API and edit the same files. Make sure alternating between them never loses data.

1. **Schema parity audit.** For each content area, compare the fields in `src/cms/config.ts` with the new admin's models, normalizers, and writers:
   - church details, site config, menu, tags, styles: `writableStructuredContent.ts`
   - homepage, times, staff: `writableComplexContent.ts`
   - pages and posts (MDX frontmatter): `writableDocumentsContent.ts` and `contentRepository.ts`
   - bulletins and media: `writableBulletinsMediaContent.ts`
   - validation: `validation.ts`

   Write down any key that either admin drops, renames, or reshapes. Known so far:
   - The new admin rebuilds homepage, staff, and times JSON from fixed draft shapes. Keys it doesn't model are dropped, and key order may change.
   - `clientId` is never written.
   - Dates are `yyyy-MM-dd` in both admins, and post `tags` are a string array in both.

2. **Round-trip check (temporary script, not committed).** Read every file under `content/` with the new admin's parse/normalize functions, serialize it back with its writers, and diff against the file on disk. Expect only formatting or key-order noise. Fix any real data loss in the **new** admin. If old-admin fields are missing from the new admin's model, add them to the new admin; that's needed for the final cutover anyway.
3. **Bulletins `pdf` / `pdfs`:**
   - Behavior today:
     - The new admin writes `pdf` = the first PDF, and writes `pdfs` only when a bulletin has more than one PDF.
     - `getBulletinPdfPaths` prefers `pdfs`.
     - The old admin edits only `pdf`.
   - Verify whether the old admin keeps the unknown `pdfs` key. The installed Static CMS implementation was inspected: entry drafts retain unknown keys and field serialization merges them back. No hidden field is needed. This was verified from package source, not a local-proxy browser save.
   - Either way, document: "Bulletins with multiple PDFs: edit them in the new admin."
   - Confirm `scripts/pdf-to-images.ts` (`bulletins-ci`) handles a single-PDF bulletin saved by the old admin.
4. **Media paths:** confirm both admins upload to the same folders and write the same public URL formats:
   - `public/files` → `/files/...`
   - `public/staff`
   - `public/bulletins`
5. **Serialization noise:** compare JSON indentation and trailing-newline output and YAML frontmatter style between the admins. If one-line config changes in the new writers would stop diffs flip-flopping between admins, make them. Otherwise just document the noise.
6. **Concurrency guidance:**
   - The new admin uses the Contents API with `sha`, so a conflicting save fails safely.
   - Static CMS writes through the Git Data API and can overwrite another person's save (last write wins).
   - User guidance: don't edit the same item in both admins at once, and reload after switching. A just-saved change can take up to a minute to appear because of GitHub API caching.

### Phase 3 audit findings

- The stored church details, site config, menu, styles, homepage, times, staff, pages, posts, and bulletin fields are represented by the new admin. `clientId` remains client-only. Top-level menu groups may have child links without their own URL; the new writer now accepts that shape while still requiring titles and destinations for leaf links.
- The legacy CMS had list-of-object definitions for `site_keywords` and tags even though committed content and the new admin use string arrays. Its config now stores those values as strings, with post tags using a multiple relation that also writes a string array.
- Static CMS keeps unconfigured fields in its entry draft and merges them back during field serialization. The legacy bulletin editor therefore retains `pdfs` when saving a record, but only exposes `pdf`; edit multi-PDF bulletins in the new admin. The image conversion script uses `getBulletinPdfPaths`, which falls back to the legacy single `pdf`.
- Both admins upload to `public/files`, `public/staff`, and `public/bulletins`, and use `/files`, `/staff`, and `/bulletins` public paths. Legacy bulletin values written as `public/bulletins/...` are normalized by the new admin to the equivalent `/bulletins/...` URL.
- A temporary writer round-trip covered all structured and complex JSON files, 17 pages, 64 posts, and 500 bulletins. It found no lost supported fields. Optional empty values can normalize between empty and omitted; the three existing page filenames and one post filename that differ from their frontmatter slugs are now preserved unless the slug is changed.
- Both JSON writers use two-space indentation; Static CMS omits the final newline, so the new admin does too. JSON key order may still differ because each admin builds objects differently. YAML frontmatter uses different serializers; page/post field ordering is aligned where practical, and remaining formatting differences are cosmetic.
- New-admin Help now warns users to edit an item in only one admin at a time, reload after switching, and use the new admin for multi-PDF bulletins.

## Phase 4: End-to-end verification and documentation (one session)

1. **Automated checks:**
   - `npm run type-check`
   - `npm run lint`
   - `npx --no-install eslint` on the changed `.tsx` files
   - `npm run build`
   - `npm run smoke:test` (public routes; no snapshot updates should be needed)
   - Optionally `npm run build-analyze` to confirm `@staticcms/lite` and TinyMCE are only in the admin chunks.
2. **Manual checklist:**
   - Old admin: `npm run dev` + `npm run local-cms`, plus a production-like check.
   - New admin: preview mode and connected mode.
   - **Old admin looks and behaves as it does in production today** (compare side by side with the live `/admin`):
     - login page
     - every collection list and editor
     - previews: homepage, times, church details, staff, menu, posts, pages
     - Times widget, including drag-and-drop and the time pickers (x-date-pickers v8 field markup changed)
     - HTML editor on TinyMCE 8:
       - toolbar, menus, and quickbars
       - insert image and file through the Static CMS media library
       - bible and telephone autolink
       - autoresize
       - code view
     - media library
     - Help page
     - Events link
   - **Switching:**
     - sidebar link: same tab, Back returns to the old admin
     - pill visibility on every screen and on mobile
     - new-admin login, app bar, and drawer buttons
     - error boundary fallback
     - unsaved-changes prompts in both directions
   - **Sessions:** logging in or out in one admin doesn't affect the other.
   - **Content round trip:** edit the same item in the old admin, then the new admin, then the old admin again, for each content type. Confirm no data loss, and that diffs contain only expected noise.
   - **Embeds:** TinyMCE 7+ defaults to `sandbox_iframes: true` and `convert_unsafe_embeds: true`, the same as the new admin. Spot-check pages with iframes (maps, video) after saving them in either admin.
3. **Documentation:**
   - Update `AGENTS.md`, `.github/copilot-instructions.md`, and `.cursor/rules/*.mdc` together (repo rule):
     - the coexistence architecture
     - the path constants
     - the "legacy: don't extend" rule
     - the ESLint ignore
     - the `local-cms` script
     - the cutover checklist pointer
   - Update `README.md`'s admin section.
4. **Optional:** a one-page guide for parish staff (where the buttons are, separate logins, don't edit the same item in both admins, how to send feedback). Keep it in the session folder unless the user wants it in the repo or in the new admin's Help.

## Phase 5: Cutover, after feedback (separate session, later)

Do this once staff are comfortable and reported issues are fixed.

1. Delete:
   - `src/cms/**` and `src/components/previews/**`
   - the `@staticcms/lite` dependency and the `local-cms` script
   - the ESLint legacy ignore
   - `LEGACY_ADMIN_PATH`, `SwitchToOldAdminButton` and its usages, and the error boundary's "Switch to old admin" link (keep the boundary with Reload)
   - the `autoresize` import in `BundledEditor`, if the new admin doesn't use it
2. Set `ADMIN_BASE_PATH = '/admin'`. Point `AdminPageView` back to `AdminShell`, the same as on `feature/new-admin` today. Delete `NewAdminPageView` and `src/app/new-admin/`.
3. Redirect `/new-admin` to `/admin` by adding `'/new-admin': '/admin'` to `REDIRECTS` in `src/constants.ts`. The 404 page already applies these client-side, so old bookmarks keep working.
4. Update all agent docs and the README to remove the coexistence notes.
5. Check `git diff feature/new-admin -- src package.json eslint.config.mjs`. The only remaining differences should be intentional fixes made during the feedback period.
6. Run the full `npm run smoke:gate`.

---

## Risks and notes

- **TinyMCE 8 in the old admin** (user's choice):
  - The editor UI changes a little (TinyMCE 8 skin).
  - The `template` plugin import is dropped. It was imported on `main` but never enabled in `init.plugins`, so no feature is lost.
  - Both admins now produce identical HTML.
- **Old-admin login on non-production hosts:** Static CMS uses the browser hostname as the Netlify `site_id`, because no `site_domain` is configured. Login works on the production domain and on localhost (via `cms.netlify.com`). It may fail on deploy-preview or branch-alias URLs. That's existing behavior and not a regression.
- **The new admin needs `NEXT_PUBLIC_NETLIFY_SITE_ID` at build time** for connected login in production. CircleCI currently doesn't pass it; see the deployment notes.
- **Bundle size:** Static CMS (about 6 MB unminified) loads only in the dynamic `/admin` chunk. Public pages are unaffected; verify in Phase 4.
- **Previews:** old-admin previews render the feature branch's public components. That's correct, because previews should match the site that gets deployed.
- **`<style jsx global>` in `CMSView`:** styled-jsx still ships with Next 16 and only runs in this client-only component. Confirmed at build time in Phase 1.
- **Every save in either admin commits to `main`** and triggers a CircleCI deploy, the same as today.

## Deployment notes (for the user; not part of the implementation todos)

- Production builds need `NEXT_PUBLIC_NETLIFY_SITE_ID` for the new admin's GitHub login. Either set it in the CircleCI project environment, or prefix the build with `NEXT_PUBLIC_NETLIFY_SITE_ID=$NETLIFY_SITE_ID` (CircleCI already has `$NETLIFY_SITE_ID`). Don't commit the value.
- No new server routes or redirects are needed for coexistence. `/new-admin` is just another static page.
