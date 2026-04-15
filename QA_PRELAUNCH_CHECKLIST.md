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
  - `Host: https://www.insurhi.com`（与 `NEXT_PUBLIC_SITE_URL` / `getSiteUrl()` 一致）
  - `Sitemap: https://www.insurhi.com/sitemap.xml`
- [x] `sitemap.xml` includes:
  - Core static routes
  - Category routes (`/insurance/*`)

## 4) Canonical and metadata spot check
- [x] Home page includes `<link rel="canonical" href="https://www.insurhi.com">`（主域为 `www` 时）
- [x] Home page includes title and description metadata
- [x] Home page includes `WebSite` JSON-LD

## 5) UA-based dynamic rendering check
- [x] Mobile UA and desktop UA return different hero copy
- [x] Core semantics remain aligned (same page purpose and category links)

## 6) Vercel pre-deploy checklist (manual)
- [x] Install/login Vercel CLI or deploy via Vercel dashboard
- [x] Project settings:
  - [x] Framework: Next.js
  - [x] Root directory: repository root
- [x] Environment variables:
  - [x] `NEXT_PUBLIC_SITE_URL=https://www.insurhi.com`
  - [x] `PAYLOAD_PUBLIC_SERVER_URL=<insurhi-cms-admin-api-base-url>`
  - [x] `NEXT_PUBLIC_ADSENSE_CLIENT_ID=<optional>`
  - [x] (CMS side) `DATABASE_URL`, `PAYLOAD_SECRET`, `PAYLOAD_PUBLIC_SERVER_URL`
- [x] Domain binding:
  - [x] `www.insurhi.com` (primary)
  - [x] `insurhi.com` (redirect to primary)
- [x] Verify after deployment:
  - [x] `https://www.insurhi.com/robots.txt`（及裸域重定向行为）
  - [x] `https://www.insurhi.com/sitemap.xml`
  - [x] Home + category + guides + claims routes load normally

## 7) Go / No-Go
- Current status: **Go for production**（以你确认的回归与部署为准）
- Production go-live dependency: **无阻塞项；上线后持续监控可用性与 CMS 连通性**

## 8) CMS：文案与法务（编辑位置说明）
- [x] 静态页面（`privacy-policy` / `terms` / `about` / `contact`）已在 CMS 创建并发布；前台对应路由显示正常

法务与关于类正文不在单独菜单里，统一在 **`insurhi-cms-admin` → Payload Admin**：

1. 左侧分组 **「系统页面」** → 集合 **「静态页面」**（API slug：`pages`）。
2. **新建**一条记录，或使用已有记录；**Slug** 必须与前台路由一致（区分大小写）：
   - `privacy-policy` → 站点 `/privacy-policy`
   - `terms` → `/terms`
   - `about` → `/about`
   - `contact` → `/contact`
3. 填写 **标题**、**内容**（大段法务/说明用此 textarea）；可选填 **SEO** 分组里的 Meta Title / Meta Description（会参与前台 metadata 与页内 SEO 预览块）。
4. 若使用 **草稿（drafts）**，需**发布**后匿名 API 才会返回给前台；前台拉取为 `no-store` 时刷新即可看到更新。

其他自定义静态页：任意 slug → 站点路径 **`/cms-pages/<slug>`**（见 `/content-map`）。

## 9) `/content-map` 逐项填 CMS
- [x] 已完成（与前台链接对照校验）
