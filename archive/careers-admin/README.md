# Archived: careers portal and admin job-posting UI

This folder holds the previous single-file implementation of the site
(`App.legacy.jsx`) purely as a reference for the careers/admin features that
were built but never wired into the public site.

**Nothing in this folder is compiled, imported, or deployed.** It sits outside
`src/`, so Vite never resolves it and Tailwind never scans it. It has no effect
on the production bundle.

## What is in here

`App.legacy.jsx` contains, alongside the old marketing sections:

- `PortfolioSection` — a portfolio-companies grid with "Now Hiring" indicators
- `CareersSection` — searchable/filterable public job listings
- `PrivateJobPost` / `AuthBox` / `PostJobForm` / `ManageJobsList` — an
  email-plus-one-time-code admin UI for posting and closing roles

These components were defined but never rendered by the old `App` component, so
Rollup tree-shook them and they never reached the published site.

## If this is ever revived

Read these first:

1. **`PrivateJobPost` has a latent crash.** It renders `{AUTHORIZED_EMAIL}`,
   which is never defined in the file. The moment the component is actually
   mounted it throws a `ReferenceError`. The authorised-email list lives
   server-side in `functions/index.js`; the client should display the address
   the user typed, not a client-side constant.
2. **`firebase` is no longer a dependency** of the web app. It was removed from
   `package.json` when the public site was reduced to a static brochure. Reviving
   any of this means adding it back.
3. **Do not restore the old portfolio content.** The archived
   `portfolioCompanies` array describes entities as an insurance brokerage and as
   a provider of debt and equity financing. Both imply licensed activity and must
   not be republished without review.
4. The backend these components talked to (`functions/`, `firestore.rules`,
   `firebase.json`) is still in the repository and is unrelated to the public
   website.

## Redactions applied

This repository is public, so the archived file was scrubbed of copy that would
misrepresent Blue Star if someone browsed the repo:

- the About paragraph asserting "superior returns" and describing Blue Star as an
  "active management private equity firm";
- entity descriptions implying licensed insurance brokerage and debt/equity
  lending activity;
- the four portfolio company names, replaced with neutral placeholders;
- the ambiguous "discuss investment opportunities" contact line.

The components' structure and behaviour are untouched. The original text remains
in git history (at commit `63bc24f` and earlier) if it is ever genuinely needed.
