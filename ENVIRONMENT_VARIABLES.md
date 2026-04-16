# Environment Variables Checklist

This document is the single source of truth for runtime configuration across:
- Frontend (`insurhi.com`)
- CMS (`insurhi-cms-admin`)
- Database (PostgreSQL)

Do not commit real secrets to git. Use placeholders in `.env.example` and set real values in local env files / deployment platforms.

---

## 1) Frontend (`insurhi.com`)

Used by the Next.js website deployment.

| Variable | Local | Preview | Production | Required | Notes |
|---|---|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3002` | `https://<preview-domain>` | `https://www.insurhi.com` | Yes | Canonical/sitemap/robots base URL. |
| `PAYLOAD_PUBLIC_SERVER_URL` | `http://localhost:3000` | `https://<cms-preview-domain>` | `https://<cms-production-domain>` | Yes | CMS API base URL used by frontend data fetches. |
| `CMS_CONTENT_SOURCE` | `api` | `api` or `static` | `static` (if local CMS only) | Recommended | `static` reads `content/cms-content.json` and does not call live CMS API. |
| `CMS_CONTENT_FILE_PATH` | `content/cms-content.json` | same | same | Optional | Override exported snapshot file path when `CMS_CONTENT_SOURCE=static`. |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Optional | Optional | Optional | No | AdSense client id, e.g. `ca-pub-xxxxxxxxxxxxxxxx`. |

---

## 2) CMS (`insurhi-cms-admin`)

Used by Payload app and admin panel deployment.

| Variable | Local | Preview | Production | Required | Notes |
|---|---|---|---|---|---|
| `PAYLOAD_SECRET` | strong random string | strong random string | strong random string | Yes | Must be private and long. |
| `DATABASE_URL` | `postgresql://postgres@127.0.0.1:5432/insurhi` | managed PG URL | managed PG URL | Yes | Full Postgres connection string. |
| `PAYLOAD_PUBLIC_SERVER_URL` | `http://localhost:3000` | `https://<cms-preview-domain>` | `https://<cms-production-domain>` | Yes | Public URL of CMS service itself. |
| `CMS_ADMIN_EMAIL` | `admin@insurhi.com` | your admin email | your admin email | Recommended | Used by seed/bootstrap scripts. |
| `CMS_ADMIN_PASSWORD` | local strong password | strong password | strong password | Recommended | Used by seed/bootstrap scripts. Rotate after setup. |

---

## 3) Database (PostgreSQL)

Primary source is `DATABASE_URL`. If your provider requires discrete fields, map accordingly:

| Field | Local Example | Notes |
|---|---|---|
| Host | `127.0.0.1` | Managed providers will provide host. |
| Port | `5432` | Keep default unless provider differs. |
| DB Name | `insurhi` | Separate DB per environment recommended. |
| User | `postgres` | Use least-privilege in production where possible. |
| SSL | local off, cloud on | Many providers require `sslmode=require`. |

---

## 4) Local Development Reference

### Frontend (`/Users/jianglanbo/Cursor/insurhi.com/.env.local`)

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3002
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_ADSENSE_CLIENT_ID=
```

### CMS (`/Users/jianglanbo/Cursor/insurhi-cms-admin/.env`)

```env
DATABASE_URL=postgresql://postgres@127.0.0.1:5432/insurhi
PAYLOAD_SECRET=replace-with-strong-secret
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
CMS_ADMIN_EMAIL=admin@insurhi.com
CMS_ADMIN_PASSWORD=ChangeMe123!
```

---

## 5) Deployment Platform Mapping

### Vercel (frontend project)
- Set all frontend variables from section 1.
- Ensure `NEXT_PUBLIC_SITE_URL` is `https://www.insurhi.com` in production.

### CMS host (Railway/Render/Fly/etc.)
- Set all CMS variables from section 2.
- Confirm `DATABASE_URL` points to correct environment DB.

---

## 6) Verification Checklist

- Frontend can fetch CMS data without `403`/`500`.
- `robots.txt` and `sitemap.xml` use `www.insurhi.com`.
- Updating an article in CMS reflects on frontend detail page.
- Local boot command works:
  - `npm run dev:all` (from `insurhi.com`)

