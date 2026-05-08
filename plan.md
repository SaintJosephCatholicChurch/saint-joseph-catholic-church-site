## Plan: Admin UI Consolidation

This follow-on plan starts from the current repo state after the completed dependency-upgrade sequence above. The goal is to reduce repeated admin CSS, stop page components from owning their own bespoke styling shells, and converge the remaining CMS-owned editing UI into the admin boundary.

The intended end state is:

- `src/admin/` owns the canonical editing UI surface.
- shared admin primitives handle the repeated cards, panels, lists, tabs, alerts, pickers, and preview shells.
- page-level editor files mostly compose those primitives instead of declaring custom-styled wrappers inline.
- the legacy `src/cms/` editing/help surface is either removed or reduced to short-lived compatibility shims while ownership flips to admin.

**Execution rule**

- Complete exactly one checkpoint at a time.
- Update this plan as each checkpoint lands, including concise notes about what was extracted, what still remains duplicated, and any deliberate deferrals.
- Validate the touched slice immediately after each checkpoint before widening scope.
- Prefer admin-owned semantic primitives over a large low-level token dump.
- Do not preserve a long-lived dual ownership model between `src/admin/` and `src/cms/`; admin is the target boundary.

**Checkpoint progress**

1. `[x]` Checkpoint 1: Admin foundation primitives
   Scope: Establish the shared admin card and panel vocabulary implied by the current editor surfaces.
   Includes: shared section cards, repeater cards, selectable list cards, workspace panels, and the first pass of removing duplicated wrapper styling from editor files.
   Excludes: CMS ownership moves and deeper editor-state refactors.
   Notes: Complete. `src/admin/components/AdminCards.tsx` now owns the shared section, repeater, selectable-card, and workspace-panel primitives, and the foundation-level wrapper duplication has been removed from `StructuredContentEditor.tsx`, `ComplexStructuredContentEditor.tsx`, `DocumentContentEditor.tsx`, `BulletinMediaEditor.tsx`, and `AdminMediaLibrary.tsx`. The local homepage card wrapper in `ComplexStructuredContentEditor.tsx` has been folded into `AdminSectionCard`, and the remaining duplicated preview chrome, support-field surfaces, and sortable-accordion details are intentionally deferred to later checkpoints. Validation passed with repo-wide `npm run type-check`, the repo lint script, a broader `npx cross-env NODE_ENV=development eslint "**/*.{ts,tsx}"` pass, and a live `/admin` route smoke check on the running dev server.
2. `[x]` Checkpoint 2: Document and bulletin workspace standardization
   Scope: Remove the duplicated list/detail shell and record-workspace styling shared by the document and bulletin editors.
   Includes: list sidebars, record headers, action bars, mobile back flows, editor/preview tab chrome, loading/error/success alert stacks, and selection-card presentation.
   Excludes: migrating TinyMCE or schedule/times ownership out of `src/cms/`.
   Notes: Complete. `src/admin/components/AdminWorkspace.tsx` now owns the shared status stacks, compact back/action bars, detail tabs, list sidebar shell, scrollable sidebar list body, record header, and record workspace panel used by both `DocumentContentEditor.tsx` and `BulletinMediaEditor.tsx`, and the duplicated list/detail shell styling has been removed from both editors. Repo-wide `npm run type-check` and the broader `npx cross-env NODE_ENV=development eslint "**/*.{ts,tsx}"` pass are clean after the refactor. Validation covered connected-mode document selection-to-URL sync on the running `/admin` route, preview-mode document list filtering, mobile editor/preview tab switching, mobile back flow, and reversible save/reset behavior, plus preview-mode bulletin dirty/reset, reversible save, and back-to-list behavior.
3. `[ ]` Checkpoint 3: Structured editor card and repeater consolidation
   Scope: Finish moving the duplicated structured-editor wrapper logic into shared admin primitives.
   Includes: structured section cards, repeater cards, sortable accordion repeater chrome, and any remaining page-local card styling in the structured editors.
   Excludes: public-site preview redesigns.
4. `[ ]` Checkpoint 4: Picker, preview, and support-surface standardization
   Scope: Converge the helper surfaces that still carry one-off styling.
   Includes: `AdminFilePathField.tsx`, `AdminImagePathField.tsx`, `AdminMediaLibrary.tsx`, `AdminPagePreviewFrame.tsx`, `DocumentPreview.tsx`, and the shared preview/tabs treatment used by the admin editors.
   Excludes: changing content contracts or server behavior.
5. `[ ]` Checkpoint 5: TinyMCE/editor ownership flip into admin
   Scope: Move the shared rich-text editor implementation out of the CMS boundary.
   Includes: `src/cms/widgets/editor/`, TinyMCE bundle/plugins/transforms, and the import seams currently used by `AdminHtmlEditor.tsx`.
   Excludes: broad editor feature changes beyond the ownership move and any compatibility fixes required to keep current behavior.
6. `[ ]` Checkpoint 6: Schedule/times ownership flip into admin
   Scope: Move the schedule/times widget family out of the CMS boundary and make admin the canonical owner.
   Includes: `src/cms/widgets/times/`, the schedule widget root currently imported by `ComplexStructuredContentEditor.tsx`, and any supporting types or utility seams required by the move.
   Excludes: redesigning the schedule UX beyond the minimum standardization needed by the admin layer.
7. `[ ]` Checkpoint 7: Help and remaining CMS surface migration
   Scope: Fold the remaining CMS-owned help surface and any leftover admin-facing CMS pieces into the admin boundary.
   Includes: the help pages currently consumed by `AdminShell.tsx`, import path cleanup, and deletion or deprecation of obsolete CMS entrypoints.
   Excludes: public help or documentation rewrites outside the admin editing experience.
8. `[ ]` Checkpoint 8: Boundary cleanup and final convergence
   Scope: Remove obsolete duplication, collapse stale ownership seams, and finish the broad admin refactor.
   Includes: deleting superseded `src/cms/` surfaces where appropriate, cleaning dead exports and duplicate helpers, and sweeping remaining page-local admin styling that should now compose shared primitives.
   Excludes: unrelated public-site cleanup.

**Relevant files**

- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\admin\AdminShell.tsx` — admin shell/theme entry point and the current help import seam.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\admin\components\AdminCards.tsx` — shared admin card and panel primitives introduced as the foundation layer.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\admin\DocumentContentEditor.tsx` — list/detail workspace duplication and editor/preview split behavior.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\admin\BulletinMediaEditor.tsx` — parallel record-workspace shell and selectable-card usage.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\admin\StructuredContentEditor.tsx` — section-card and menu-repeater usage.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\admin\ComplexStructuredContentEditor.tsx` — structured card usage plus the schedule/times import seam.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\admin\AdminMediaLibrary.tsx` — shared media workspace surface.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\admin\AdminFilePathField.tsx` — file-picker display surface.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\admin\AdminImagePathField.tsx` — image-picker display surface.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\admin\AdminPagePreviewFrame.tsx` — shared preview container surface.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\admin\AdminHtmlEditor.tsx` — current admin wrapper around CMS-owned TinyMCE internals.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\cms\widgets\editor\BundledEditor.tsx` — current TinyMCE bundle ownership root.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\cms\widgets\editor\htmlTransforms.ts` — current editor transform seam imported by admin.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\cms\widgets\times\TimesWidgetControl.tsx` — current schedule/times ownership root.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\src\cms\pages\help\Help.tsx` — current help ownership root consumed by admin.
- `s:\Repositories\SaintJosephCatholicChurch\saint-joseph-catholic-church-site\admin-manual-test-checklist.md` — manual regression checklist to reuse or expand for the final admin pass.

**Verification**

1. After each checkpoint, run the narrowest validation that can falsify the current refactor slice before widening scope.
2. For visual/admin-only extractions where no narrower executable check exists, use file diagnostics plus a live route check in the running admin dev server.
3. Checkpoint 2 must validate document selection in the URL, list filtering, mobile back flows, preview switching, and save/reset behavior.
4. Checkpoint 3 must validate section saves, repeater add/remove/reorder flows, and structured preview rendering.
5. Checkpoints 5 through 7 must validate that the moved help/editor/times surfaces still render and save through the admin route after ownership flips.
6. Before marking the overall plan complete, run `npm run build`, `npm run smoke:gate`, and the manual admin checklist, then explicitly note any remaining pre-existing typecheck issues that are outside the refactor slice.

**Decisions**

- The dependency-upgrade sequence above is complete; this section tracks the post-upgrade admin consolidation work.
- Visual cleanup is allowed, but the goal is consistency and reuse, not an unrelated redesign.
- `src/admin/` is the target ownership boundary for the editing UI.
- The remaining admin-facing `src/cms/` surface may be deprecated or removed as part of this work instead of being preserved indefinitely.
- Public content contracts, route URLs, and backend/serverless behavior stay out of scope unless a checkpoint explicitly requires a compatibility fix.

**Further considerations**

1. The highest-value abstractions are semantic workspace primitives, not raw style tokens. If a new abstraction does not remove meaningful duplication from multiple admin surfaces, it should probably stay local.
2. Keep the page components readable. Shared hooks or helpers are useful only when they reduce repetition without obscuring content-specific save and validation logic.
3. Remove `src/cms/` ownership in deliberate steps. The last phase should delete obsolete boundaries only after the admin route no longer depends on them and validation has passed.
