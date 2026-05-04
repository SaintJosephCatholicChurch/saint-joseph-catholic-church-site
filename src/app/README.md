# App Router Migration Rules

- `src/pages/` remains the production route owner until a later phase explicitly moves a route family.
- Keep `src/pages/_app.tsx` and `src/pages/_document.tsx` in place until Phase 18 removes the last Pages Router route.
- Import shared global CSS in both router roots during coexistence: `src/pages/_app.tsx` for `pages/*` and `src/app/layout.tsx` for future `app/*` routes.
- Put App Router-wide client-only side effects and wrappers under `src/app/` and compose them from `src/app/layout.tsx`.
- Move exactly one route family per phase so `src/app/` never creates ambiguous ownership for an existing production path.
- Do not add `src/app/page.tsx` until Phase 8, when the homepage migration begins.
