# Insurhi 三 Agent 协作 SOP

适用场景：你希望并行推进「网站功能」「网站内容」「页面风格」，同时保持发布稳定和质量可控。

## 1）角色分工（固定）

- Agent A（功能开发）
  - 负责：路由、数据读取、CMS 对接、容错、SEO 技术项、性能与可用性
  - 输出：代码改动 + 自测步骤 + 风险说明
- Agent B（内容运营）
  - 负责：CMS 字段规范、页面文案结构、slug/标题规范、内容发布检查
  - 输出：内容清单 + 页面级文案验收结果
- Agent C（视觉体验）
  - 负责：页面布局、组件一致性、移动端适配、视觉层级与可读性
  - 输出：样式改动 + 跨端验收结果

## 2）执行顺序（每轮都一致）

每次只处理一个目标页面或一组强相关页面，按以下顺序执行：

1. Agent A 先落地功能与数据
2. Agent B 填充并校验内容
3. Agent C 做视觉与移动端优化
4. 总控统一回归与发布

禁止跳步：未完成 A，不进入 B；未完成 B，不进入 C。

## 3）每轮任务模板（直接复制）

### 给 Agent A（功能开发）

目标页面：`<path>`

要求：
- 完成页面数据流与容错（CMS 不可用时给出 fallback）
- 保持现有路由/SEO 不回退
- 提交后提供：
  - 修改文件列表
  - 验证命令（lint/build/关键 URL）
  - 已知风险（如有）

### 给 Agent B（内容运营）

目标页面：`<path>`

要求：
- 根据 CMS 最新内容校对页面字段是否完整展示
- 发现缺失字段时给出“字段名 + 影响页面 + 建议文案结构”
- 提交后提供：
  - 已完成内容检查项
  - 待补充内容项（可直接在 CMS 执行）
  - 内容验收结论（通过/不通过）

### 给 Agent C（视觉体验）

目标页面：`<path>`

要求：
- 在不破坏功能的前提下优化视觉层级与信息密度
- PC 与移动端都要可读、不卡行、不拥挤
- 提交后提供：
  - 视觉改动点
  - 移动端重点检查项
  - 与现有设计风格一致性说明

## 4）总控验收清单（合并前必须）

- [ ] `npm run lint` 通过
- [ ] `npm run build` 通过
- [ ] 目标 URL 在本地可正常访问（无 404/500）
- [ ] `content-map` 能看到对应内容落点
- [ ] 移动端关键页面无明显折行/溢出
- [ ] 未混入无关文件改动

## 5）冲突处理规则

- 功能冲突：以 Agent A 的数据正确性为先，视觉与文案做让步
- 内容冲突：以 Agent B 的字段规范为先，UI 呈现可调整但字段不能丢
- 视觉冲突：在不影响功能和内容完整性的前提下，优先移动端可读性

## 6）推荐日常节奏（你可直接照做）

- 上午：A 做功能，B 准备内容草稿
- 下午：B 上 CMS 并验收，C 做样式统一
- 收尾：总控跑 lint/build，抽检 3 个关键页面，准备发布

## 7）与你当前项目最匹配的第一轮

建议立即按以下范围跑第一轮：

- 目标页面：`/insurance/[slug]`（6 个险种）
- Agent A：保证各模块都按险种差异化输出，且 CMS 异常时可回退
- Agent B：补齐每个险种的要点文案和 FAQ 对应关系
- Agent C：统一卡片密度、标题层级、移动端间距与换行策略

完成后再复制同样流程到 `/guides/[slug]` 和 `/claims/*`。

## 8）发布后 24 小时检查表

- [ ] 关键 URL 全部 200：`/insurance/*`、`/products`、`/providers`、`/methodology`、`/claims/guides/*`
- [ ] 分类页 Buying guides 仅显示本险种文章（优先 CMS `category`，勿仅靠标题关键词）
- [ ] 分类页 Claims guides 仅显示本险种理赔指引
- [ ] 无禁用外链（如 `medicare.gov`、`content.naic.org`）
- [ ] Vercel Production 部署为 Latest，无 build 报错
- [ ] `CMS_CONTENT_SOURCE=static` 时确认 `content/cms-content.json` 已更新并推送

---

## 9）下阶段计划（E-E-A-T + 内容 + 视觉，明天起直接执行）

> 目标：提升 YMYL 类页面的 **Experience / Expertise / Authoritativeness / Trustworthiness**，与现有 CMS 字段和页面结构对齐。  
> 原则：**方法透明 + 场景具体 + 来源可核对 + 利益透明 + 持续更新**（不是堆「专家说」）。

### 9.1 阶段总览（约 4 周）

| 周 | 主题 | Agent 主责 | 交付物 |
|----|------|------------|--------|
| W1 | 信任基建 + 方法论 | B + A | `/methodology` 正文、全站披露、About/Contact 补强 |
| W1 | 深度内容（6 险种） | B | 每险种至少 1 篇**深度** guide（非 buying 模板短文） |
| W2 | 标杆产品页 + 时间展示 | B + A | 2–3 个完整产品页；guide/product 显示 Last updated |
| W2 | 视觉 Sprint Day1–2 | C + A | `SectionHeader` 等公共组件；`/insurance/[slug]` 统一 |
| W3 | 理赔可信度 | B | claims-guides 补拒赔/延迟/材料反面案例 |
| W4 | 治理与发布 | A + 总控 | 内容校验脚本；每周五统一 `release:publish` |

### 9.2 E-E-A-T 四条线（做什么 + 落在哪里）

#### Experience（经验）

- **要呈现**：真实场景、可复现方法、理赔/比价实操细节。
- **内容要求**：
  - 深度 guide 必须含 **Scenario**（至少 2 个）与 **checklist**。
  - `claims-guides`：除步骤外，写「常见卡点 / 拒赔原因 / 时效预期」。
  - 产品页填实：`claimsTurnaround`、`reviewHighlights`（有数据才写，禁止编造）。
- **CMS/页面**：`articles`、`claims-guides`、`products`。
- **Agent B 验收**：读者能否按文执行，而非只看定义。

#### Expertise（专业度）

- **要呈现**：术语准确、决策顺序清晰、险种不混谈。
- **内容要求**：
  - Guide 固定结构：**一句话结论 → 适合谁/不适合谁 → 对比维度 → checklist → FAQ（2–4）**。
  - 分类页 `How to choose well` 与 guide 内文口径一致。
  - Buying guides **优先 CMS `category`**，禁止仅靠标题关键词匹配（已修复，发布前再查）。
- **可选 CMS 字段（后续）**：`reviewedBy`、`lastReviewedAt`（与系统 `updatedAt` 区分）。
- **Agent B 验收**：无跨险种误归类；无空泛 SEO 句。

#### Authoritativeness（权威性）

- **要呈现**：方法论公开、来源可追溯、主题簇完整。
- **内容要求**：
  - `/methodology`：评分维度、权重、更新频率、**非付费排名**声明。
  - 产品 `sources`：可核对来源 + 日期；禁用域名见 §9.4。
  - 深度文末尾：**Sources & methodology**（3–5 条）。
  - 站内互链：分类 ↔ guide ↔ claims ↔ product。
- **Agent A**：sitemap 含 `/products`、`/providers`、`/methodology`；必要时 Organization 结构化数据（真实信息才可上）。
- **Agent B 验收**：每条来源能对应到具体依据，非「行业普遍认为」。

#### Trustworthiness（可信度）

- **要呈现**：利益透明、日期可见、合规与纠错入口。
- **内容要求**：
  - 全站 **Editorial disclosure**（见 §9.3 A-1）：仅供参考、不构成法律/财务建议、购买前阅读保单原文；若有 affiliate 必须标注。
  - About / Contact：运营主体、编辑原则、纠错邮箱（48h 复核承诺可写进 CMS 页面）。
  - 禁止：保证最低价、100% 理赔、伪造评价/星级分布。
- **Agent A 验收**：关键页显示 **Last updated**；无死链；无禁用外链。

### 9.3 下阶段功能/内容 backlog（按优先级）

#### P0（明天可启动，建议 Day1–2）

| ID | 任务 | 负责 | 说明 |
|----|------|------|------|
| A-1 | 全站 `EditorialDisclosure` 组件 | A | Footer 或 guide/product/claims 文末；文案见 §9.2 Trust |
| A-2 | `Last updated` 前台展示 | A | `guides/[slug]`、`products/[slug]`、`claims/guides/[slug]` 读 CMS `updatedAt` |
| B-1 | 充实 CMS `pages` slug=`methodology` | B | 替换默认占位；含评分方法、更新频率、非付费声明 |
| B-2 | 6 险种深度 guide 排期 | B | 已有 auto UM/UIM 深度文；补 home/life/pet/medicare/renters 各 1 篇 |

#### P1（本周内）

| ID | 任务 | 负责 | 说明 |
|----|------|------|------|
| B-3 | 2–3 标杆产品页 | B | 如 `amica-home`、`aarp-uhc-medicare`：methodology + sources + pros/cons 填实 |
| B-4 | claims-guides 增强 | B | 每险种理赔文补「拒赔/延迟/补件」小节 |
| C-1 | 视觉 Sprint Day1–2 | C | `SectionHeader`、`InfoCard`；统一 `/insurance/[slug]` |
| A-3 | `validate:content` 脚本 | A | 黑名单域名、必填 category、SEO 长度、发布前一键跑 |

#### P2（第 3–4 周）

| ID | 任务 | 负责 | 说明 |
|----|------|------|------|
| A-4 | 可选：`reviewedBy` / `lastReviewedAt` 字段 | A + B | Payload 集合 + 前台展示 |
| B-5 | 4 周内容排期执行 | B | 每周 2 buying/claims + 6 FAQ；周五发布 |
| A-5 | Lighthouse + Search Console 基线 | 总控 | 5 个核心 URL，记录 baseline |

### 9.4 内容治理规则（Agent B 发布前必跑）

- **分类**：`articles` / `claims-guides` / `faq-items` 必须绑定正确 `category`。
- **Slug（URL）**：
  - **常青 URL**：`articles` / `claims-guides` 的 `slug` **不写年份**（例：`auto-gap-insurance-buying-guide`，非 `…-guide-2026`）。
  - **时效写在标题与 SEO**：`title` / `metaTitle` 可含 `(2026)` 或 `2026`；`lastReviewedAt` 负责前台「最近审核」展示。
  - **已发布带 `-2026` 的 W3/W4 文**：已迁移为无年份 slug；旧 URL 由 `lib/content-slug-redirects.ts` 301 到新路径。
  - **历史深度文**（如 `auto-um-uim-coverage-deep-guide-2026`）：暂不批量改 slug；新增长尾从 W5 起一律无年份。
- **SEO**：`metaTitle` 30–60 字；`metaDescription` 110–160 字。
- **外链黑名单**（禁止写入 `sources.url` 或正文链接）：`medicare.gov`、`content.naic.org`（可按需扩展）。
- **深度 vs 模板**：每周至少 1 篇含 Scenario + 独立结论，不得整站同构换标题。
- **发布命令**（CMS 在线后）：
  ```bash
  cd /Users/jianglanbo/Cursor/insurhi.com
  npm run release:publish -- --all -m "chore(content): <本周摘要>"
  ```

### 9.5 CMS 字段与 E-E-A-T 映射

| E-E-A-T | 已有 CMS 能力 | 下阶段加强 |
|---------|---------------|------------|
| Experience | `claims-guides.steps`、`products.claimsTurnaround`、`reviewHighlights` | 场景叙事 + `lastUpdated` 展示 |
| Expertise | `articles`、`faq-items`、分类页决策块 | 深度文 + 术语/结构统一 |
| Authority | `pages.methodology`、`products.sources`、`products.methodology` | 方法论正文 + 规范引用 |
| Trust | `about`/`contact`/`terms` pages、列表 `createdAt`/`updatedAt` | 披露组件 + 前台 Last updated |

### 9.6 深度 Guide 选题排期（W1 内容运营）

| 险种 | 建议 slug 方向 | 状态 |
|------|------------------|------|
| auto | `auto-um-uim-coverage-deep-guide-2026` | 已创建 |
| home | `home-replacement-cost-vs-acv-deep-guide-2026` | 待写 |
| life | `life-beneficiary-claim-deep-guide-2026` | 待写 |
| pet | `pet-pre-existing-waiting-period-deep-guide-2026` | 待写 |
| medicare | `medicare-medigap-plan-letters-deep-guide-2026` | 待写 |
| renters | `renters-theft-claim-evidence-deep-guide-2026` | 待写 |

### 9.7 明天发起任务时的复制模板

**总控开场（粘贴给新会话）：**

```text
按 MULTI_AGENT_SOP.md §9 下阶段计划执行。
本周优先：P0（A-1 披露组件、A-2 Last updated、B-1 methodology 正文、B-2 再完成 1 篇深度 guide）。
顺序：Agent A 功能 → Agent B 内容 → Agent C 视觉（仅 C-1 排期时）→ 总控 lint/build/§8 检查表 → 周五 release:publish。
YMYL 要求：方法透明、场景具体、来源可核对、无黑名单外链、无虚假承诺。
```

**Agent B 内容运营：**

```text
你是 Insurhi 内容运营 Agent。执行 MULTI_AGENT_SOP.md §9.2–§9.4、§9.6。
今日目标：<填写 1 个险种深度 guide 或 B-1 methodology 正文>。
必须：category 正确、SEO 长度合规、含 Scenario+FAQ、sources 不用黑名单域名。
输出：CMS 条目列表（title/slug/status）+ 待发布检查项。
```

**Agent A 功能开发：**

```text
你是 Insurhi 功能 Agent。执行 MULTI_AGENT_SOP.md §9.3 P0：A-1 EditorialDisclosure、A-2 Last updated。
不改业务路由；lint 通过；给出验证 URL 列表。
```

**Agent C 视觉（若本周启动）：**

```text
你是 Insurhi 视觉 Agent。执行 MULTI_AGENT_SOP.md §9.3 C-1 与 §7 第一轮视觉要求。
目标：/insurance/[slug] 区块统一，移动端 375/768 可读。
```
