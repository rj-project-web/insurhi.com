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
