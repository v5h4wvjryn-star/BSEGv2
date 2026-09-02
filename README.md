# Blue Star Equity Group — Website

Source for [bluestarequitygroup.com](https://bluestarequitygroup.com).

Blue Star Equity Group is a privately held investment and holding company
focused on operating businesses, commercial real estate, and strategic
investments.

The site is a single-page static brochure. It has no backend, no forms, no
analytics, and no client-side data collection — contact is handled entirely
through `mailto:` links.

## Tech stack

| | |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Hosting | GitHub Pages (custom domain via `CNAME`) |
| CI/CD | GitHub Actions (`.github/workflows/deploy.yml`) |

## Project structure

```
BSEGv2/
├── .github/workflows/deploy.yml   GitHub Pages build and deploy
├── functions/                     Firebase Cloud Functions (not used by the site)
├── public/
│   ├── star-icon.svg              Favicon
│   ├── apple-touch-icon.png       Generated — see tools/
│   ├── og-image.png               Generated — see tools/
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── App.jsx                    Entire site
│   ├── main.jsx                   Entry point
│   └── index.css                  Tailwind imports and global styles
├── tools/
│   ├── og-image.html              Source artwork for the generated PNGs
│   └── generate-images.mjs        Rasterizes it with headless Chromium
├── index.html                     HTML shell, metadata, JSON-LD
└── CNAME                          Custom domain
```

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
npm run preview  # serve the production build locally
```

## Page structure

One page, anchor-navigated. Every section is directly linkable:

| Anchor | Section |
|---|---|
| `#home` | Hero |
| `#about` | About Blue Star |
| `#focus` | What We Do — operating businesses, commercial real estate, strategic investments |
| `#real-estate` | Commercial Real Estate |
| `#approach` | How We Invest |
| `#sellers` | Thinking About Selling Your Business? |
| `#contact` | Contact |

For example, `https://bluestarequitygroup.com/#real-estate` links straight to
the commercial real estate section.

There is deliberately **no client-side router**. GitHub Pages serves no SPA
fallback, so real paths such as `/real-estate` would 404 on a direct load.
Anchors work on a direct load; routes would not.

## Editing content

Nearly all copy lives in `src/App.jsx`, most of it in arrays near the top of
each section component: `AT_A_GLANCE`, `FOCUS_AREAS`, `RE_CATEGORIES`,
`PRINCIPLES`, `CONTACT_ROUTES`. The contact addresses are constants at the top
of the file.

When editing copy, keep to what is factually supportable. The site intentionally
makes no claims about assets under management, fund size, transaction history,
returns, portfolio companies, employees, offices, or outside investors.

## Regenerating the social image

`public/og-image.png` (1200×630) and `public/apple-touch-icon.png` (180×180) are
committed build artifacts, generated from `tools/og-image.html`:

```bash
npm run images
# or, with a specific browser:
CHROME_BIN=/path/to/chrome node tools/generate-images.mjs
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site
and publishes `dist/` to GitHub Pages. No manual step is required.

### Note on `_headers` and `_redirects`

These two files are in Netlify / Cloudflare Pages format. **GitHub Pages ignores
both**, so the security headers listed in `_headers` are *not* currently being
sent, and the redirects in `_redirects` are handled by GitHub Pages' own
behaviour instead (HTTPS enforcement is a repository Pages setting; the apex and
`www` handling comes from DNS). The files are kept so the configuration is not
lost if hosting ever moves to a platform that reads them. Sending real security
headers would require a host that supports them, such as Cloudflare Pages or
Netlify.

## Unused subsystems

`functions/`, `firebase.json`, and `firestore.rules` support a careers portal
and admin job-posting UI that were built but never wired into the public site.
The public site does not load Firebase and does not depend on any of this.

The front-end source for those features is not duplicated in the working tree;
git history preserves it (see commit `63bc24f` and earlier). Do not revive any
of it without review — the historical copy contains superseded portfolio,
insurance, and financing claims that must not be republished.

## Security

This repository is **public**. Do not commit API keys, tokens, passwords,
one-time codes, or any other credential. Use GitHub Actions repository secrets
for CI and `firebase functions:config:set` for Cloud Functions configuration.

See the caution at the top of [EMAIL_AUTH_SETUP.md](EMAIL_AUTH_SETUP.md)
regarding a key that was previously committed.

## Contact

- Website: <https://bluestarequitygroup.com>
- Email: info@bluestarequitygroup.com

---

© Blue Star Equity Group. All rights reserved.
