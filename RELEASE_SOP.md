# Insurhi 发布 SOP

本文档是 `insurhi.com` 的标准发布流程，适用于以下模式：
- CMS 与 PostgreSQL 仅在本地运行
- 将 CMS 内容导出为仓库中的静态快照
- 通过 Vercel 发布生产环境

每次内容发布都请按本 SOP 执行。

## 1）发布前置条件

- 本地 CMS 已启动，且可访问：`http://localhost:3000/admin`
- 前端仓库工作区可识别本次预期改动（避免混入无关文件）
- Vercel 生产环境变量已配置：
  - `CMS_CONTENT_SOURCE=static`
  - `CMS_CONTENT_FILE_PATH=content/cms-content.json`（推荐）
  - `NEXT_PUBLIC_SITE_URL=https://www.insurhi.com`

## 2）发布步骤

1. **在 CMS 中发布内容**
   - 在 `insurhi-cms-admin` 中将本次更新的内容全部发布（不是仅保存为草稿）。
2. **导出内容并验证构建输入**
   - 在前端仓库根目录执行：
   ```bash
   npm run publish:static
   ```
   - 该命令会依次执行：
     - `npm run export:cms-content`
     - `npm run lint`
     - `npm run build`
3. **确认快照已更新**
   - 检查 `content/cms-content.json` 是否包含本次预期的新内容。
4. **提交并推送代码**
   - 仅暂存本次需要发布的文件，例如：
   ```bash
   git add content/cms-content.json README.md ENVIRONMENT_VARIABLES.md RELEASE_SOP.md
   git commit -m "chore(content): refresh static CMS snapshot"
   git push origin main
   ```
   - 若本次包含代码改动，请有意识地一并纳入提交。
5. **在 Vercel 触发部署**
   - 从最新 `main` 触发 Production 部署。
   - 如果出现内容未更新，执行 **Redeploy without cache**。

## 3）发布后 10 分钟巡检清单（必须）

部署 `Ready` 后，10 分钟内完成以下动作并记录：

- [ ] 打开无痕窗口，访问 `https://www.insurhi.com/content-map`
- [ ] 确认内容不是旧版本，且非空列表（与本次导出一致）
- [ ] 检查 `https://www.insurhi.com/guides` 最新内容展示
- [ ] 检查 `https://www.insurhi.com/insurance/auto`
- [ ] 检查 `https://www.insurhi.com/claims`
- [ ] 检查 `https://www.insurhi.com/robots.txt`
- [ ] 检查 `https://www.insurhi.com/sitemap.xml`
- [ ] 在发布记录中填写本次 Deployment URL 与 Commit SHA

## 4）发布后验证（完整版）

当部署状态变为 `Ready` 后，检查以下页面：

- `https://www.insurhi.com/content-map`
  - 应看到本次新内容，不应是旧数据/空列表。
- `https://www.insurhi.com/guides`
- `https://www.insurhi.com/insurance/auto`
- `https://www.insurhi.com/claims`
- `https://www.insurhi.com/robots.txt`
- `https://www.insurhi.com/sitemap.xml`

涉及内容更新的检查，建议优先用无痕窗口进行。

## 5）回滚流程

若生产内容异常：

1. 在 Vercel 中找到上一版稳定部署，执行回滚/恢复。
2. 在 git 中定位上一版稳定提交：
   ```bash
   git log --oneline
   ```
3. 问题修复后，重新导出并按本 SOP 再发布一次。

除非明确批准，不要对 `main` 使用强推（force push）进行回滚。

## 6）常见故障排查

### A）Vercel 显示旧的 content-map 文案或内容
- 确认本次生产部署的 Commit SHA 与 GitHub `main` 最新提交一致。
- 确认环境变量作用域为 **Production**。
- 执行 `Redeploy without cache`。

### B）content-map 显示 “No ... found in current content source.”
- 检查已部署源码中的 `content/cms-content.json` 是否有数据。
- 确认导出内容均为已发布状态（非草稿）。

### C）本地 `git push`（HTTPS）连接/鉴权失败
- 优先使用 SSH 推送（必要时使用 SSH over 443）。
- 检查当前网络是否可访问 GitHub。

### D）本地 `npm ci` 出现证书错误
- 这通常是本机网络或 TLS 证书链问题。
- 使用稳定网络和有效 CA 证书，避免长期关闭 SSL 校验。

## 7）相关 Runbook

- 监控 Runbook：`MONITORING_RUNBOOK.md`
- 回滚 Runbook：`ROLLBACK_RUNBOOK.md`

## 8）发布记录模板

在 PR 描述或发布记录中填写：

- 发布时间：
- Commit SHA：
- `npm run export:cms-content` 导出统计：
- 验证人：
- 验证结果：
- 是否回滚：是/否
