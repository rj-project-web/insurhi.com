# 回滚 Runbook（生产）

本文档用于生产环境出现问题时的快速回滚，目标是最短时间恢复可用性。

## 1）触发条件

满足任一条件即可触发回滚：

- 关键路径（`/`、`/guides`、`/insurance/auto`、`/claims`）持续返回 5xx
- 发布后出现明显错误内容且影响主流程
- `robots.txt` / `sitemap.xml` 不可访问
- 内容快照错误且短时间无法修复

## 2）回滚前检查（1 分钟）

1. 记录当前异常部署 SHA
2. 确认上一版稳定部署（Known Good Deployment）
3. 在团队频道发出“准备回滚”通知

## 3）Vercel 回滚步骤（推荐）

1. 打开 Vercel 项目 `Deployments`
2. 找到上一版稳定部署（状态为 `Ready`，且历史验证通过）
3. 执行 Promote / Rollback 到 Production
4. 等待状态变为 `Ready`

> 禁止在紧急回滚时做额外功能改动，先恢复可用性。

## 4）回滚后验证（必须）

回滚完成后，使用无痕窗口检查：

- `https://www.insurhi.com/`
- `https://www.insurhi.com/content-map`
- `https://www.insurhi.com/guides`
- `https://www.insurhi.com/insurance/auto`
- `https://www.insurhi.com/claims`
- `https://www.insurhi.com/robots.txt`
- `https://www.insurhi.com/sitemap.xml`

若全部正常，再发布“已恢复”通知。

## 5）故障修复后重新发布

1. 在本地修复问题（内容或代码）
2. 执行标准发布流程（见 `RELEASE_SOP.md`）
3. 重新部署并再次完整验证

## 6）禁止事项

- 未明确批准前，不要对 `main` 使用 `push --force`
- 不要在未验证的情况下直接覆盖生产稳定版本
- 不要跳过发布后验证

## 7）事件记录模板

- 事件开始时间：
- 触发条件：
- 异常部署 SHA：
- 回滚目标 SHA / Deployment：
- 恢复时间：
- 根因：
- 后续改进项：
