# Copilot Instructions

## Admin preview standardization

- For page-style admin previews under `src/admin/`, compose `AdminPagePreviewFrame` instead of creating local preview shells.
- `AdminPagePreviewFrame` owns the full-size outer preview surface, horizontal centering, the `page` container, and vertical overflow handling.
- Each preview should declare only its width constraint through `pageSx`, using `width: '100%'` and a preview-specific `maxWidth` value.
- Do not add preview-local `overflow: auto`, `overflowY: auto`, `container: 'page / inline-size'`, or centering wrappers unless the nested content itself has a separate behavior requirement.
- If a preview needs a narrower content column inside the page frame, use a local wrapper with only `width: '100%'` and `maxWidth`; let the shared frame and container handle centering.
