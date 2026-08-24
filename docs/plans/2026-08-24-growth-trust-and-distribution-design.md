# 增长可信度、索引质量与分发资产治理设计

日期：2026-08-24

## 背景与批准范围

本设计是在 `2026-08-17-growth-content-governance-design.md` 已落地能力上的增量治理。2026-08-24 的 GSC、Bing Webmaster 与站内 Analytics 复盘表明：非品牌搜索与 AI 引用仍在增长，但现有分析链路允许客户端写入业务事实，注册口径不一致，Showcase 构建可静默降级，部分运营截图含真实邮箱，且七条视频的页脚落点与各自内容页面不一致。

用户已在完整复盘与建议后明确要求“全面全部开始实施”，因此采用下述推荐方案，不再重复询问已经确认的范围。

## 方案选择

### 方案 A：只调整内容和标题

风险最低，但无法解决分析事实可伪造、退款乱序、Showcase 构建不完整和素材隐私问题；后续流量决策仍不可信，不采用。

### 方案 B：一次重写 Analytics、SEO 与内容系统

可获得最整洁的终态，但涉及数据模型、API、SQL、静态构建和运营资产同时大改，回滚面过大，也会破坏正在积累的搜索信号，不采用。

### 方案 C：可信事实优先、兼容迁移、逐域验收（采用）

先封住客户端伪造入口并让旅程指标回归服务端事实；再统一口径和退款幂等；随后提升 Showcase 与索引质量；最后修订运营资产并重渲染受影响视频。所有新字段和端点保持向后兼容，生产部署与公开发布仍由用户确认后执行。

## 一、业务事实可信边界

- 公共与登录态客户端只允许记录页面浏览、点击、实验曝光、用户主动提交等行为事件。
- `deployment_ready`、`deployment_failed`、`guest_claim_completed`、`registration_completed` 等结果事实只能由服务端写入，并带明确的服务端来源。
- 客户端携带的 Project、Deployment 与身份上下文必须校验所有权；不满足时拒绝关联，而不是把未验证 ID 写入事实表。
- 发布旅程的 Ready/Failed 以 Deployment 持久化状态与身份字段为权威来源，Product Event 仅补充精确事件时间，不再成为唯一事实依赖。
- Worker 记录分析事件失败时不得影响部署主流程；通过持久化待处理结果或可重放机制保证最终补记，并提供积压/失败监控。

## 二、Analytics 统一语义与可用性

- 明确定义两个独立指标：`period_new_customers` 表示周期内创建的真实新客户；`journey_registered` 表示在本周期访问、提交、Ready 后完成注册且时间顺序成立的旅程用户。
- Summary、Funnel、Source 与 Details 复用同一 canonical journey CTE/视图，禁止各自复制近似口径。
- 固定不变量：来源分阶段合计等于漏斗阶段、详情总量等于对应漏斗量、后阶段不大于前阶段、乱序事件不进入严格旅程。
- 概览保持 core/deferred 分片；合并重复旅程查询，缓存返回 fresh/stale/生成时间等元数据，缓存版本升级以避免旧口径污染。
- 实验失败同时提供 `experienced_failure` 与 `terminal_failure`，避免失败后成功重试仍被算作最终失败。
- Registration Method 作为延迟维度加入分析，不阻塞核心首屏。

## 三、支付与退款幂等

- Stripe webhook 使用可持久化 inbox/pending 状态承接退款先于 invoice/payment 到达的乱序场景。
- invoice 到达后自动重放待处理退款；定时任务补偿遗漏事件。
- Charge 与 Payment Intent 增加数据库唯一性约束；重复 webhook、部分退款和完整退款均幂等。
- 验收覆盖 refund→invoice、invoice→refund、重复事件、多次部分退款、incomplete→complete。

## 四、Showcase 与结构化数据

- JSON-LD 序列化必须转义 `<`，防止用户内容闭合 `<script>`。
- Showcase SSG 获取失败不得缓存 `null` 并静默产出空集合；生产构建必须满足可查询状态和最小卡片数，失败时使用仓库内最近一次有效快照或明确阻断构建。
- CollectionPage schema、静态链接和卡片只包含实际可索引条目，审核中、私有或已删除条目不进入集合。
- Cover 生成固定尺寸现代格式缩略图并保存宽高；首张 LCP 图 eager/high priority，其余 lazy，使用响应式候选避免下载原始 5MB 图片。
- Showcase 加入静态 SEO 必需路由与构建质量校验。

## 五、多语言索引生命周期

- 不批量延长所有 meta description；已经高 CTR 的中文 Host 页面保持稳定。
- 根据实际 GSC/Bing 信号生成有时间戳的 index overrides：保留已证明或已策展页面；低价值、近义且无独立信号的页面转为 noindex 或精确 301。
- 西班牙语保留已产生搜索与 AI 引用的 `publish-html-file-to-web`，弱势近义 Upload/Host/Publish 页面按查询归属收敛。
- IndexNow 对标题去重、排序变化等会影响多个详情页的操作，必须为全部受影响 URL 入队并公开积压/失败指标。

## 六、运营内容与视频资产

- GitHub/npm 深链补齐素材级 `utm_content`；指标复盘按真实 `repository`、`package` medium 统计。
- 英文 MCP 与 Open VSX 分发分别落到 `/docs/mcp`、`/docs/vscode`，不再跳到西班牙语页面。
- 每项内容只保留一个主要 CTA；修正西班牙语文章 Alt、视频时长与“部署后验证”事实表达。
- 建立单一发布账本，记录素材 ID、平台、UTM、状态、实际发布日期、公开 URL、canonical 与 7/14/28 天复盘。
- 对包含真实邮箱的两张 Console 截图进行非破坏性去标识化，保持 UI 布局和文字层级；所有引用它们的视频重新渲染。
- 七条视频页脚改为各自 `landingUrl` 的短展示形式，更新验证脚本并重渲染全部成片，保证文件、音轨、字幕、封面和 1080×1920/30fps 规格一致。

## 七、内容增长策略

- 不追逐本周单点波动，不再新建 Upload/Host/Publish 近义模板页。
- 英文优先维护 Upload、Host、Claude 与 Free 四个已有落点；西班牙语优先维护已经产生普通搜索点击或 Bing AI 引用的 Claude/VS Code/Cursor/Publish 集群。
- 内容必须给出真实操作、限制、故障排查和可验证示例；MCP 只承诺部署，浏览器/人工验证作为下一步明确说明。
- 标题和核心搜索意图保持稳定，正文、截图、Alt、CTA 和深链先行；每次修改用发布账本在 7/14/28 天复盘。

## 测试与验收

1. 客户端不能写入服务端结果事实，伪造 ID 无法污染漏斗。
2. Worker 分析事件失败不影响 Deployment Ready，且补偿链路可最终写入。
3. Summary、Funnel、Source、Details 满足统一旅程不变量。
4. Stripe 乱序、重复与部分退款用例通过，数据库唯一约束生效。
5. JSON-LD 对 `</script>` 安全，Showcase 构建失败不会静默输出空集合。
6. Showcase schema 与可索引卡片一致，首图与其余图片加载策略正确。
7. 多语言 overrides 有生成时间和证据，强势页面不被机械改写。
8. 运营包链接、UTM、单 CTA、Alt、视频时长和发布账本校验通过。
9. 去标识化截图不包含原邮箱，七条视频使用各自落点并全部重新渲染。
10. Backend、Console、MCP、SEO、运营包与 Remotion 全量测试和构建通过。

## 发布与回滚边界

- 本轮只修改本地代码与资产，不自动部署生产、不向公开平台发帖、不修改外部账号与预算。
- 数据库迁移使用向前兼容字段/索引；旧数据可继续读取，新约束上线前先清理或兼容历史重复。
- Analytics 新口径使用缓存版本隔离，可独立回滚应用代码；原始 Deployment、Payment 与 Product Event 数据不删除。
- SEO 收敛只对有明确证据的精确 URL 生效，不使用语言前缀通配重定向。
- 原始含敏感信息截图保留在本地 Git 历史，不在公开资产继续引用；去标识化版本使用新文件名或经过确认的替换路径。
