# Parish Registration Form Plan

This plan is for implementing a production-ready parish registration flow that replaces the current PDF-only workflow while fitting the existing architecture in this workspace.

It covers both repositories:

- `saint-joseph-catholic-church-site`
- `church-website-serverless-api`

## 1) Current State And Constraints

### Website repo reality

- The public site is a Next.js Pages Router app with `output: 'export'` in `next.config.mjs`.
- The current parish membership page is content-driven via `content/pages/parish-membership.mdx` and linked from `content/menu.json`.
- Existing forms on the site are client-side React components that post directly to the separate API host at `https://api.stjosephchurchbluffton.org/.netlify/functions/...`.
- The current contact and ask forms use MUI form controls already present in the site repo. Reusing those is lower risk than introducing a second form library.

### Backend reality

- The actual email-sending logic lives in the separate `church-website-serverless-api` repo as Netlify functions.
- `contact.mjs` uses `nodemailer` and shared CORS handling via `netlify/functions/util/response.mjs`.
- Current cross-origin form submissions avoid preflight by using `mode: 'no-cors'`, which means the frontend cannot inspect the real success/failure response.

### Architectural implication

- Despite the request mentioning a Next.js API route, that is not the best fit for the current production setup.
- Because the site uses static export, features that require dynamic request handling are not available in the website build output. Next.js static export only supports static `GET` route handlers and does not support request-dependent route handlers, server actions, rewrites, or other server-only features. Source: Next.js Static Exports docs, https://nextjs.org/docs/app/guides/static-exports
- Recommended implementation: keep the form UI in the site repo and add a new Netlify function in the serverless repo for submission validation, PDF generation, and email delivery.

## 2) What Exists Today That Will Be Replaced

The current parish membership experience is a static content page that tells users to call the office or download a PDF:

- `content/pages/parish-membership.mdx`
- `public/files/parishregistrationform.pdf`

The menu already points to `/parish-membership`, so the safest migration is to preserve that URL and replace the page implementation behind it.

## 3) PDF Field Audit And Required Scope

Text extracted from `public/files/parishregistrationform.pdf` shows the existing paper form includes these fields and labels in addition to the prompt's field list:

- `Env#`
- `Add2`
- adult `Role` (Head of House, Husband, Wife, etc.)
- adult `First Language`
- adult `(Maiden) & Birthplace`
- adult `Catholic?` separate from sacrament checkboxes/dates
- child `H.S. Grad Yr`
- wording differences such as `First Name(s)` and `First Name / Nickname`

Decision: all fields from the current PDF must be retained in the new system. The web UI may use clearer labels where helpful, but every paper-form field must exist in both the submission payload and the generated PDF.

## 4) Recommended End State

### User-facing behavior

- `/parish-membership` becomes a real registration page instead of a PDF download page.
- The page renders a mobile-first web form with clear sections:
  - Family Information
  - Adult Member 1
  - Adult Member 2
  - Children / Dependents
  - Additional Notes / Priest Visit
- Submission shows actual loading, success, and failure states.
- On success, the parish office receives:
  - a structured summary email
  - a generated PDF attachment that mirrors the existing form layout closely enough for office use

There will be no legacy PDF fallback link on the page. The new experience completely replaces the old PDF-download workflow.

### Technical shape

- Frontend stays in `saint-joseph-catholic-church-site`.
- Submission endpoint, validation, PDF generation, and email delivery live in `church-website-serverless-api`.
- The frontend uses standard CORS-enabled `fetch`, not `no-cors`, so it can surface real errors.
- The PDF is generated on the server with `pdf-lib`.

## 5) File-Level Plan

## Phase A: Replace The Parish Membership Page In The Site Repo

### A1. Preserve URL and navigation

- Add a dedicated page component at `src/pages/parish-membership.tsx`.
- Keep the existing menu item in `content/menu.json` unchanged so the `/parish-membership` route remains stable.
- Either:
  - leave `content/pages/parish-membership.mdx` in place but note it is now shadowed by the dedicated route, or
  - replace its content with an editor note if the team wants to avoid CMS confusion.

Preferred option: keep the MDX file for now and document in code comments or plan notes that the explicit page route now owns this slug. That is the least disruptive change.

### A2. Add a custom page view and form component

Proposed new site files:

- `src/pages/parish-membership.tsx`
- `src/components/pages/custom/parish-membership/ParishRegistrationView.tsx`
- `src/components/pages/custom/parish-membership/ParishRegistrationForm.tsx`
- `src/components/pages/custom/parish-membership/parishRegistration.types.ts`
- `src/components/pages/custom/parish-membership/parishRegistration.constants.ts`
- `src/components/pages/custom/parish-membership/parishRegistration.initialState.ts`
- `src/components/pages/custom/parish-membership/parishRegistration.validation.ts`

Keep this structure small and boring. Avoid over-abstracting repeated field markup until after the first working version exists.

### A3. Match site conventions

- Use the existing `PageLayout`, `Container`, and MUI `TextField`, `Select`, `Button`, `FormControl`, and checkbox/radio controls already used elsewhere.
- Follow current style conventions: single quotes, concise functions, styled components via MUI `styled`, and no unrelated refactors.
- Do not introduce a new form library.

### A4. Form data model

Use a single payload shape that matches the requested contract and is easy to extend:

- `family`
- `adults`
- `children`
- `additional`

Recommended shape:

- `family.registrationDate`
- `family.envelopeNumber`
- `family.lastName`
- `family.firstNames`
- `family.mailingName`
- `family.address`
- `family.addressLine2`
- `family.city`
- `family.state`
- `family.zip`
- `family.homePhone`
- `family.emergencyPhone`
- `family.familyEmail`
- `adults[0..1]`
- `children[]`
- `additional.priestVisitRequested`
- `additional.priestVisitDetails`

Each adult/child record should contain normalized sacrament data instead of ad hoc booleans spread through the tree. Recommended shape:

- `sacraments.baptism.received`
- `sacraments.baptism.date`
- `sacraments.eucharist.received`
- `sacraments.eucharist.date`
- `sacraments.reconciliation.received`
- `sacraments.reconciliation.date`
- `sacraments.confirmation.received`
- `sacraments.confirmation.date`

This will keep PDF rendering and email summary generation predictable.

Because all paper-form fields must remain, the model should also explicitly retain:

- `adults[n].role`
- `adults[n].gender`
- `adults[n].dateOfBirth`
- `adults[n].maritalStatus`
- `adults[n].validCatholicMarriage`
- `adults[n].parishStatus`
- `adults[n].occupationEmployer`
- `adults[n].workPhoneOrCell`
- `adults[n].email`
- `adults[n].firstLanguage`
- `adults[n].maidenName`
- `adults[n].birthplace`
- `adults[n].isCatholic`
- `children[n].firstName`
- `children[n].lastName`
- `children[n].gender`
- `children[n].birthdate`
- `children[n].relationshipToHeadOfHousehold`
- `children[n].school`
- `children[n].highSchoolGraduationYear`
- `children[n].firstLanguage`
- `children[n].isCatholic`

Note: the prompt asked for a simplified `children` shape, but the confirmed requirement is to retain every field from the current PDF. The implementation should therefore prefer PDF fidelity over simplifying the child/adult record structure.

### A5. Controlled form behavior

- Use a single top-level state object with small helper updaters for:
  - family fields
  - adult field updates by index
  - child add/update/remove
  - sacrament toggles and dates
- Auto-fill registration date with today's date on initial render.
- Keep two fixed adult panels.
- Keep children as a dynamic array with add/remove actions.
- Include the adult `Role` field explicitly in the UI.
- Preserve every current paper-form field in the UI, even if some are tucked behind secondary labels or grouped rows for readability.

### A6. Validation rules

- Required fields at minimum:
  - `family.lastName`
  - `family.address`
  - `family.familyEmail`
- Preserve all other paper-form fields as present in the payload even when optional.
- Validate email format.
- Normalize date inputs to a single `YYYY-MM-DD` representation in the frontend payload.
- If a sacrament date is entered, ensure the corresponding `received` value is true.
- If `priestVisitRequested` is false, clear or ignore `priestVisitDetails`.

Recommended UX:

- inline field-level error text after submit attempt
- disable submit during request
- success message after a `200` response
- visible error banner if submission fails

### A7. Frontend endpoint integration

- Add a new constant in `src/constants.ts` for the new endpoint, for example:
  - `PARISH_REGISTRATION_URL = 'https://api.stjosephchurchbluffton.org/.netlify/functions/parish-registration'`
- Use normal `fetch` with `Content-Type: application/json`.
- Parse the response body and surface actual server errors to the user.

Do not use `mode: 'no-cors'` here because the required UX depends on seeing the real result.

## Phase B: Add A New Netlify Function In The Serverless API Repo

### B1. New function entry point

Add:

- `netlify/functions/parish-registration.mjs`

Responsibilities:

1. Handle `OPTIONS` for preflight.
2. Accept `POST` JSON.
3. Validate and sanitize the submission.
4. Generate the PDF.
5. Send the email with PDF attachment.
6. Return structured JSON success/failure responses.

### B2. Update shared response handling for real CORS

Current response handling only sets `access-control-allow-origin`.

For this feature, update `netlify/functions/util/response.mjs` so cross-origin JSON form posts work cleanly:

- add `access-control-allow-methods`
- add `access-control-allow-headers`
- optionally add a helper for JSON responses

The new function should reply successfully to `OPTIONS` requests.

This is required because `application/json` POST requests from `www.stjosephchurchbluffton.org` to `api.stjosephchurchbluffton.org` will preflight.

### B3. Break the serverless logic into small helpers

Proposed helper files:

- `netlify/functions/util/parish-registration/validate.mjs`
- `netlify/functions/util/parish-registration/sanitize.mjs`
- `netlify/functions/util/parish-registration/pdf.mjs`
- `netlify/functions/util/parish-registration/email.mjs`
- `netlify/functions/util/parish-registration/summary.mjs`

Keep helpers pure where possible so they are easy to test manually and reason about.

## Phase C: Validation And Sanitization Strategy

### C1. Input validation on the server

The server must treat all incoming values as untrusted.

Validate:

- object shape
- required fields
- adults array length is exactly `2`
- children is an array
- all date strings are either empty or valid `YYYY-MM-DD`
- email fields are syntactically valid
- boolean-like fields are normalized to real booleans

Reject malformed input with `400` and a readable JSON error body.

### C2. Sanitization

- Trim strings.
- Collapse obviously redundant whitespace.
- Escape all user content before inserting it into the HTML email body.
- Keep raw strings safe for PDF output by avoiding HTML rendering entirely inside PDF generation.

This is an improvement over the existing contact form pattern, which interpolates raw user content into HTML.

## Phase D: PDF Generation

### D1. Dependency choice

- Add `pdf-lib` to `church-website-serverless-api/package.json`.

Reason:

- lightweight enough for a serverless function
- Node-compatible
- sufficient for a structured office PDF without needing HTML-to-PDF rendering

### D2. Rendering strategy

Do not attempt pixel-perfect recreation on the first pass.

Instead:

1. Create a clean sectioned PDF that mirrors the paper form's information hierarchy.
2. Preserve the familiar labels where possible.
3. Use consistent typography and spacing.
4. Allow the document to flow onto additional pages if the family has many children.

Recommended section order:

1. Header with parish name and submission date
2. Family information
3. Adult member 1
4. Adult member 2
5. Children / dependents table or stacked entries
6. Priest visit section

### D3. Handling the full field set

Because every current paper-form field must remain, the PDF helper should be driven by a central field map so the rendered labels can stay close to the original form while the web UI uses cleaner wording where appropriate.

That means:

- centralize field-to-label mapping in one file
- keep PDF layout code separate from validation code
- allow UI labels and PDF labels to diverge while writing to the same payload fields
- keep the original paper-form labels available for the generated PDF where they help office familiarity

## Phase E: Email Delivery

### E1. Reuse the existing mail transport approach

- Reuse the same `nodemailer` transport pattern already used in `contact.mjs`.
- Keep credentials environment-driven:
  - `GMAIL_USERNAME`
  - `GMAIL_PASSWORD`
- Add `PARISH_REGISTRATION_EMAIL` as the required recipient configuration for this feature.
- Allow `PARISH_REGISTRATION_EMAIL` to be a comma-separated list and split/trim it server-side before passing to `nodemailer`.

Do not route parish registration mail through `CONTACT_EMAIL`.

### E2. Email contents

Send:

- subject like `New Parish Registration Submission`
- HTML summary body with section headings
- attached PDF, for example `parish-registration-YYYY-MM-DD-lastname.pdf`

The body should summarize the submission in a way the office can scan quickly without opening the attachment.

### E3. Reply-to behavior

- Set `replyTo` to `family.familyEmail` when present and valid.
- If desired later, this can be expanded to include adult email addresses in the summary body rather than as multiple reply-to addresses.

## Phase F: Content And UX Migration

### F1. Replace the old content message

The new page should still explain what parish registration is for, but it should no longer send users away to download a PDF as the primary action.

Recommended content flow:

- short introductory paragraph
- note that the office will receive the registration directly
- registration form

### F2. Rollout strategy

Replace the old PDF-download workflow directly. No fallback PDF link is required on the new page.

## 6) Proposed Implementation Order

1. Confirm unresolved field questions listed below.
2. Add the new frontend page and typed form model in the site repo.
3. Add the new serverless function skeleton with proper CORS and JSON responses.
4. Add server-side validation and sanitization.
5. Add PDF generation helper and verify output locally.
6. Add email summary + attachment delivery.
7. Wire the site form to the endpoint and validate end-to-end.
8. Update the parish membership page copy and keep a temporary PDF fallback link.
9. Run final validation.

## 7) Validation Checklist

### Website repo

- `npm run lint`
- `npm run build`
- smoke test `/parish-membership` locally
- confirm mobile layout for at least narrow and desktop widths

### Serverless repo

- `npm run live`
- manual POST to the new function with a sample payload
- verify `OPTIONS` response for CORS preflight
- verify email sends and PDF attachment opens

### End-to-end

- submit a realistic family with two adults and at least two children
- verify success state in browser
- verify validation errors on missing last name, address, and family email
- verify the office email body is readable
- verify the PDF is readable and complete
- verify multi-child submissions do not truncate PDF content

## 8) Confirmed Decisions

1. All fields from the current paper PDF must remain in the new web form and generated PDF.
2. All fields should appear in the new experience; cleaner UI labels are allowed.
3. Adult `Role` is required and should stay in the UI and payload.
4. A clean multi-page generated PDF is acceptable.
5. Submission emails must go to `PARISH_REGISTRATION_EMAIL`, and that variable must support a comma-separated recipient list.
6. The new page fully replaces the PDF-download workflow with no fallback link.
