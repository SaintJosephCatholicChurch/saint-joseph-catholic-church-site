# Admin Manual Test Checklist

Use this checklist after the dependency-upgrade sequence is complete and before new admin feature work resumes.

## Prerequisites

- Start the site locally with `npm run dev`.
- Open `/admin` in a browser with access to the configured GitHub and Netlify auth flows.
- Use a disposable content change or a safe branch so each save/publish step can be reverted after validation.

## 1. Shell, routing, and auth

- Load `/admin` and confirm the shell renders without console or runtime errors.
- Verify the desktop collapse/expand control and the mobile drawer both work.
- Switch through every admin view: Church Details, Homepage, Bulletins, News, Pages, Site Config, Events, and Help.
- Confirm sign-in or connect flow succeeds and that save-capable screens no longer show an unauthenticated state.

## 2. Document editing and TinyMCE flows

- Open an existing News item and an existing Page entry.
- Edit metadata fields such as title, slug, summary, or description.
- In the rich-text editor, exercise headings, bold/italic, lists, links, and at least one media or embed action that is normally used.
- Save the change, reload the editor, and confirm the content persists and renders correctly in preview.

## 3. Structured content builders and previews

- In Church Details, Homepage, and Site Config, update representative text, link, image, and repeatable-list fields.
- Exercise add, reorder, and remove flows in at least one drag-and-drop content builder.
- In the times editor widgets, add or reorder a section, day, or note block and confirm the generated structure stays stable after save.
- Confirm the relevant preview surface updates correctly for homepage, documents, and structured content.

## 4. Bulletin and media management

- Open the bulletin/media editor and load an existing bulletin entry.
- Upload or replace one media asset, confirm thumbnail or preview rendering, then remove or revert it.
- If the PDF bulletin import flow is used in normal operations, run one end-to-end upload/import smoke pass and verify generated media paths resolve.
- Save changes, refresh the editor, and confirm the saved bulletin metadata and asset references still load.

## 5. Save, publish, and cleanup

- Verify save or publish buttons show the expected loading, success, and error states.
- Confirm preview links or preview frames still reflect the latest saved content.
- Revisit Events and Help after the editing flows to confirm non-editing admin views still load normally.
- Revert temporary validation changes or commit only the intended content updates.
