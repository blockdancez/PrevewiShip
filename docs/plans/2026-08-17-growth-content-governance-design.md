# 增长分析与内容完整治理设计

日期：2026-08-17

## 背景

2026-08-17 的生产复盘确认三类问题同时存在：

1. Google 核心点击继续增长，但多个 HTML 近义页面互相争夺查询归属。
2. 管理员分析的 deferred 请求在生产稳定超时并返回 500，来源与实验拆解不可用。
3. Analytics v2 的发布提交关联为 0，注册事实和身份桥覆盖不足，无法可靠判断渠道 ROI。

`operation/0727/` 已经包含文章、帖子、西班牙语内容、视频、图片、UTM 和复盘模板。本次不另建一套运营包，而是在现有资产上迁移主落点、修订表达并增加统一内容治理规则。

## 目标

- 管理员分析首屏和四类延迟数据可独立成功、失败、缓存和重试。
- 一次发布尝试在提交事件、上传请求、Deployment 和异步结果之间使用同一 `clientAttemptId`。
- 英文 Upload 内容只保留一个搜索主页面，合并历史权重，停止关键词内耗。
- 静态页面不再输出已知 404 的扩展下载链接。
- 用户可见内容不再出现“目标查询、搜索意图、SEO/GEO 机会”等内部运营语言。
- `operation/0727/` 的文章、帖子、视频描述、图片说明和 UTM 全部遵循同一内容支柱与页面归属。

## 方案选择

### 方案 A：只修生产错误

改动小，但页面竞争、旧运营链接和后续内容重复仍会继续，不采用。

### 方案 B：同时重写所有页面与全部成片

范围过大，会破坏 2026-08-10 后仍在积累的搜索信号，也无法证明重新生成视频和封面能带来收益，不采用。

### 方案 C：数据链路修复、英文页面收敛、运营资产迁移（采用）

先恢复可信分析，再对已经发生排名转移的英文 Upload 页面做永久合并；保留有独立表现的多语言 URL，更新已有运营包而非无差别重做素材。

## 一、管理员分析切片

### API

保留现有端点兼容，同时新增四个只读切片：

- `GET /console/admin/analytics/overview/deferred/acquisition`
- `GET /console/admin/analytics/overview/deferred/operations`
- `GET /console/admin/analytics/overview/deferred/commerce`
- `GET /console/admin/analytics/overview/deferred/experiments`

切片边界：

- acquisition：source、first/last touch、source performance、landing、country、locale。
- operations：deployment source、failure code、plan。
- commerce：checkout region、billing cycle、offer、surface。
- experiments：实验曝光、提交、Ready、注册和失败。

每个切片拥有独立事务、缓存 Key、耗时指标和错误响应。前端并行请求并组合展示；一个切片失败时只隐藏对应区域，其他区域保持可用。

旧 `/overview/deferred` 继续返回完整 DTO，供旧前端短期兼容，但新前端不再调用。

### 缓存与失败

- 复用现有 5 分钟 fresh、24 小时 stale 和 single-flight。
- 缓存 Key 增加切片名称，避免一个慢查询阻塞其他切片。
- 冷缓存失败时返回该切片错误，不伪造空数据。
- 已有 stale 时先返回 stale，再受限后台刷新。
- 单个切片超时不再与前端截止时间设置为完全相同的值，前端预留响应传输余量。

### SQL 与测试

本轮优先通过切片降低单请求成本，不一次性重写全部 SQL。对生产最慢切片记录 collector 耗时，为后续物化 canonical identity 或增加表达式索引提供证据。

真实 PostgreSQL 集成测试除“能执行”外，增加公开 API 级执行预算；测试数据量保持可控，生产慢查询继续通过 Micrometer 和结构化日志发现。

## 二、发布旅程关联

### 数据流

1. 用户触发发布时创建一次 `DeployTrackingContext`。
2. `deploy_submitted` 使用该上下文记录 `client_attempt_id`。
3. 上传请求携带相同 ID 和匿名、会话、获客、实验上下文。
4. 后端把上下文保存到 Deployment。
5. Worker 的 Ready/Failed 事实继续从 Deployment 恢复同一上下文。

Guest 与登录态共用同一上下文构造器。React Query 重试或同一变量对象重用时不得生成第二个尝试 ID；用户重新发起一次明确发布时才生成新 ID。

埋点和身份桥仍属于非关键链路，失败不能阻断发布；但必须产生可监控的失败日志/指标。

## 三、SEO 页面收敛

### 英文 URL

- 主页面：`/guides/upload-html-file`
- 旧页面：`/guides/upload-html-file-to-website`
- 旧英文 URL 使用永久重定向到主页面。
- 主页面吸收旧页的 No FTP、静态资源、框架 build output 和故障排查内容。
- 旧英文 URL 退出 sitemap、Hub、相关推荐、README、npm 文档和 `operation/0727/`。

### 多语言 URL

已有本地化内容和搜索表现的 `/zh-*`、`/ja`、`/ko`、`/es`、`/pt`、`/fr` URL 保留。英文重定向规则不得匹配语言前缀。

### 页面意图

- Upload：如何把一个文件或 build output 发布为 URL。
- Host：如何在线托管一个 HTML 文件。
- Publish：publish/htmlpub 与公开 URL 工作流。
- Free Static：Free 预览能力、限制和非生产托管边界。
- Claude：原生 Artifact、独立预览 URL 与生产平台的诚实选择。

删除用户可见的内部 SEO 语言，改成用户问题、决策条件、限制、实例和证据。

## 四、技术 SEO

- SSG 使用明确的生产 API Base URL，扩展下载链接直接指向 API 域名。
- SEO 校验新增内部永久重定向、sitemap 排除和静态 HTML 断链检查。
- Showcase 永久删除项返回 410；未发布、审核中或权限不足的条目仍按既有安全语义返回 404。
- 公共内容包按语言/栏目拆分属于次级性能任务，仅在不扩大本轮风险时实施。

## 五、`operation/0727/` 内容治理

### 内容支柱

1. AI 产物到可审阅 URL：Claude、ChatGPT、Codex。
2. 浏览器可运行的前端交付：Cursor、VS Code、CLI、MCP。
3. 文件到网页：HTML、Markdown、PDF、静态 build output。
4. 决策与证据：Preview vs Production、竞品对比、真实数据和案例。

### 格式职责

- 搜索文章：一个明确问题、一个主页面、完整操作与限制。
- 社媒帖子：一个洞察或数据点，主 CTA 只指向一个页面。
- 视频：问题 → 选择正确 artifact → 发布 → 验证真实 URL → CTA。
- 图片：概念封面负责吸引，真实截图负责功能证据，两者不得混用。

已有七条成片的画面和字幕保持不变；只更新描述、置顶评论、UTM 和发布清单。四张 1200×630 概念图继续使用，不为追求数量重新生成。文章必须补真实截图证据，并在发布前检查敏感信息。

### 语言优先级

英语承接 Google 主流量；西班牙语承接已验证的 Bing AI 和 Google Publish 表现；繁中、韩语只维护已经产生点击的页面。没有搜索或引用证据时不自动扩页。

### 复盘

- 统一使用 `core_content_cluster_0727` campaign，保留素材级 `utm_content`。
- 永久迁移后，同一素材 ID 的目标 URL同步更新，不能同时指向新旧 Upload 页面。
- 发布后按 7、14、28 天复盘搜索、引用、Landing、Ready、注册和收入。
- Analytics 覆盖不足 95% 时只报告绝对事实，不报告精细渠道 ROI。

## 测试与验收

1. 新前端不再请求完整 deferred，四个切片可独立成功和失败。
2. 四个切片使用不同缓存 Key，单切片失败不污染其他缓存。
3. 登录态与 Guest 提交事件和 Deployment 共享同一 `clientAttemptId`。
4. 英文旧 Upload URL 永久跳转，主页面返回 200，旧 URL 不在 sitemap。
5. 多语言 Upload URL继续返回其本地化内容。
6. 静态 HTML 不包含 `https://previewship.com/download/extension`。
7. 核心内容不包含内部 SEO 运营措辞。
8. `operation/0727/validate.mjs` 验证所有英文 Upload 外链已迁移、UTM 唯一、图片和七条视频存在。
9. Backend、Console、MCP、SEO、运营包校验和生产构建全部通过。

## 边界

- 不自动发布外部平台、不修改外部账号或投放预算。
- 不删除已有多语言页面。
- 不改变产品价格、套餐权益、域名或预览生命周期。
- 不重新生成已经合格的视频和概念封面，除非验证发现规格或事实错误。
