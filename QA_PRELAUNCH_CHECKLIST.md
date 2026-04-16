# Insurhi 上线前 QA 验收清单

## 1）构建与基础检查
- [x] `npm run build` 构建通过
- [x] 路由生成包含关键页面、`robots.txt` 与 `sitemap.xml`
- [x] 本次改动文件无阻塞级 linter 报错

## 2）关键路径回归（本地生产模式）
- [x] `/` 返回 `200`
- [x] `/insurance` 返回 `200`
- [x] `/insurance/auto` 返回 `200`
- [x] `/guides` 返回 `200`
- [x] `/claims` 返回 `200`
- [x] `/robots.txt` 返回 `200`
- [x] `/sitemap.xml` 返回 `200`

## 3）SEO 端点检查
- [x] `robots.txt` 包含：
  - `User-Agent: *`
  - `Allow: /`
  - `Host: https://www.insurhi.com`（与 `NEXT_PUBLIC_SITE_URL` / `getSiteUrl()` 一致）
  - `Sitemap: https://www.insurhi.com/sitemap.xml`
- [x] `sitemap.xml` 包含：
  - 核心静态路由
  - 分类路由（`/insurance/*`）

## 4）Canonical 与元信息抽查
- [x] 首页包含 `<link rel="canonical" href="https://www.insurhi.com">`（主域为 `www`）
- [x] 首页包含 title 与 description 元信息
- [x] 首页包含 `WebSite` JSON-LD

## 5）UA 差异渲染检查
- [x] 移动端 UA 与桌面端 UA 的首屏文案存在差异
- [x] 页面语义一致（页面意图与核心链接结构一致）

## 6）Vercel 发布前清单（手动）
- [x] 已登录 Vercel（CLI 或 Dashboard）
- [x] 项目设置：
  - [x] Framework：Next.js
  - [x] Root Directory：仓库根目录
- [x] 环境变量：
  - [x] `NEXT_PUBLIC_SITE_URL=https://www.insurhi.com`
  - [x] `PAYLOAD_PUBLIC_SERVER_URL=<insurhi-cms-admin-api-base-url>`
  - [x] `NEXT_PUBLIC_ADSENSE_CLIENT_ID=<optional>`
  - [x] （CMS 侧）`DATABASE_URL`、`PAYLOAD_SECRET`、`PAYLOAD_PUBLIC_SERVER_URL`
- [x] 域名绑定：
  - [x] `www.insurhi.com`（主域）
  - [x] `insurhi.com`（重定向到主域）
- [x] 发布后验证：
  - [x] `https://www.insurhi.com/robots.txt`（含裸域重定向检查）
  - [x] `https://www.insurhi.com/sitemap.xml`
  - [x] 首页 + 分类 + guides + claims 路由访问正常

## 7）Go / No-Go 结论
- [x] 当前结论：**可上线生产（Go）**
- [x] 上线依赖：**无阻塞项；上线后持续监控可用性与 CMS 连通性**

## 8）CMS 文案与法务页检查
- [x] 静态页面（`privacy-policy` / `terms` / `about` / `contact`）已在 CMS 创建并发布
- [x] 对应前台路由显示正常
- [x] 编辑位置已确认：`insurhi-cms-admin` → 「系统页面」→ 「静态页面（pages）」
- [x] 若使用草稿（drafts），已确认发布后匿名 API 可读

补充说明：
- 任意自定义静态页可通过 slug 映射到 `/cms-pages/<slug>`（见 `/content-map`）。

## 9）`/content-map` 内容映射验收
- [x] 已完成逐项填充
- [x] 已完成前台链接对照校验
