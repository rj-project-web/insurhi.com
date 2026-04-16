# 监控 Runbook（生产）

本文档定义 `insurhi.com` 的最小可用监控标准，适用于当前发布模式：
- 本地 CMS + 本地 PostgreSQL
- 导出静态快照到仓库
- Vercel 生产部署

## 1）监控目标

- 关键页面可访问（HTTP 200）
- 发布后内容正确（非旧内容/空内容）
- SEO 基础端点正常（`robots.txt`、`sitemap.xml`）

## 2）关键监控路径

请至少监控以下 URL：

- `https://www.insurhi.com/`
- `https://www.insurhi.com/content-map`
- `https://www.insurhi.com/guides`
- `https://www.insurhi.com/insurance/auto`
- `https://www.insurhi.com/claims`
- `https://www.insurhi.com/robots.txt`
- `https://www.insurhi.com/sitemap.xml`

## 3）推荐监控策略

### A. 可用性监控（Uptime）
- 检测频率：每 1～5 分钟
- 判定规则：
  - 连续 3 次非 2xx/3xx -> 告警
  - 响应时间 > 3 秒且持续 5 分钟 -> 告警
- 告警渠道：邮箱 + IM（飞书/钉钉/Slack 任一）

### B. 部署后人工巡检（必做）
- 每次生产发布后，使用无痕窗口执行 10 分钟巡检（见 `RELEASE_SOP.md`）。
- 核对内容来源与更新时间是否正确（重点看 `/content-map`、`/guides`）。

### C. Vercel 原生监控
- 开启并查看：
  - Analytics
  - Speed Insights
  - Logs（部署日志与运行日志）

## 4）告警分级与响应

- **P1（高优先）**
  - 首页/核心路径不可访问
  - `robots.txt` 或 `sitemap.xml` 不可访问
  - 生产返回 5xx 持续 > 5 分钟
- **P2（中优先）**
  - 内容延迟更新
  - 局部页面异常（非核心入口）
- **P3（低优先）**
  - 部署告警提示但不影响访问（如 git email 警告）

## 5）常见故障定位顺序

1. 看 Vercel 当前 Production Deployment 是否 `Ready`
2. 对比部署 Commit SHA 与 GitHub `main` 最新提交
3. 检查 Production 环境变量：
   - `CMS_CONTENT_SOURCE=static`
   - `CMS_CONTENT_FILE_PATH=content/cms-content.json`
4. 打开 `/content-map` 验证内容是否来自当前快照
5. 必要时执行 `Redeploy without cache`

## 6）值班交接最小信息

每次处理告警后记录：

- 触发时间
- 影响范围（URL 列表）
- 当前部署 SHA
- 采取动作（如回滚/重部署）
- 结果与恢复时间
