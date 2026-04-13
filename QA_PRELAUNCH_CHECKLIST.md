# Insurhi Pre-Launch QA Checklist

## 1) Build and baseline checks
- [x] `npm run build` passes
- [x] Route generation includes key pages, `robots.txt`, and `sitemap.xml`
- [x] No linter blockers in changed files

## 2) Key path regression (local prod server)
- [x] `/` returns `200`
- [x] `/insurance` returns `200`
- [x] `/insurance/auto` returns `200`
- [x] `/guides` returns `200`
- [x] `/claims` returns `200`
- [x] `/robots.txt` returns `200`
- [x] `/sitemap.xml` returns `200`

## 3) SEO endpoint checks
- [x] `robots.txt` includes:
  - `User-Agent: *`
  - `Allow: /`
  - `Host: https://insurhi.com`
  - `Sitemap: https://insurhi.com/sitemap.xml`
- [x] `sitemap.xml` includes:
  - Core static routes
  - Category routes (`/insurance/*`)

## 4) Canonical and metadata spot check
- [x] Home page includes `<link rel="canonical" href="https://insurhi.com">`
- [x] Home page includes title and description metadata
- [x] Home page includes `WebSite` JSON-LD

## 5) UA-based dynamic rendering check
- [x] Mobile UA and desktop UA return different hero copy
- [x] Core semantics remain aligned (same page purpose and category links)

## 6) Vercel pre-deploy checklist (manual)
- [ ] Install/login Vercel CLI or deploy via Vercel dashboard
- [ ] Project settings:
  - [ ] Framework: Next.js
  - [ ] Root directory: repository root
- [ ] Environment variables:
  - [ ] `NEXT_PUBLIC_SITE_URL=https://insurhi.com`
  - [ ] `PAYLOAD_PUBLIC_SERVER_URL=<payload-api-base-url>`
  - [ ] `NEXT_PUBLIC_ADSENSE_CLIENT_ID=<optional>`
  - [ ] (CMS side) `DATABASE_URL`, `PAYLOAD_SECRET`, `PAYLOAD_PUBLIC_SERVER_URL`
- [ ] Domain binding:
  - [ ] `insurhi.com`
  - [ ] `www.insurhi.com` (optional redirect policy)
- [ ] Verify after deployment:
  - [ ] `https://insurhi.com/robots.txt`
  - [ ] `https://insurhi.com/sitemap.xml`
  - [ ] Home + category + guides + claims routes load normally

## 7) Go / No-Go
- Current status: **Go for preview deployment**
- Production go-live dependency: **complete Vercel setup and env injection**
