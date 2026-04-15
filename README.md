# Insurhi Web App

Next.js 14+ starter for `insurhi.com`, including:
- Tailwind CSS + shadcn/ui
- Core route skeleton for insurance, guides, claims, and legal pages
- Shared site layout with header/footer
- AdSense-ready placeholder components

## Requirements

- Node.js 20+
- npm 10+

## Local development

```bash
npm install
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

### Run frontend + CMS together

```bash
npm run dev:all
```

This starts:
- Frontend: `http://localhost:3002`
- CMS Admin (`insurhi-cms-admin`): `http://localhost:3000/admin`

## CMS architecture decision

- Official CMS project: `insurhi-cms-admin`
- Deprecated folder inside this repo: `cms-deprecated`
- See `CMS_DECISION.md` for details.

## Build and lint

```bash
npm run lint
npm run build
```

## Environment setup

Copy `.env.example` to `.env.local` and fill in project values.

## Current route skeleton

- `/`
- `/insurance`
- `/insurance/[slug]` (`auto`, `life`, `home`, `pet`, `medicare`, `renters`)
- `/guides`
- `/claims`
- `/resources`
- `/about`
- `/contact`
- `/privacy-policy`
- `/terms`
