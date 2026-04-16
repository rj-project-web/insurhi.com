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

## Release process

- See `RELEASE_SOP.md` for the standard production release flow.
- Monitoring runbook: `MONITORING_RUNBOOK.md`
- Rollback runbook: `ROLLBACK_RUNBOOK.md`

## Static publish workflow (local CMS -> Git -> CI)

For "CMS + PostgreSQL local only" publishing, use exported JSON snapshot instead of runtime CMS API:

1. Run and publish content in local CMS (`http://localhost:3000/admin`).
2. Export local CMS content into this repo:

```bash
npm run export:cms-content
```

Or run one command to export + lint + build:

```bash
npm run publish:static
```

3. Commit and push `content/cms-content.json`.
4. In Vercel, set:
   - `CMS_CONTENT_SOURCE=static`
   - (optional) `CMS_CONTENT_FILE_PATH=content/cms-content.json`
5. Redeploy. Build uses exported snapshot, so production no longer depends on live CMS API.

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
