# 增长分析与内容完整治理实施计划

日期：2026-08-17

关联设计：`2026-08-17-growth-content-governance-design.md`

## 实施原则

- 按可独立验收的纵向切片推进，每个行为先补失败测试，再写最小实现。
- 保持旧接口兼容；新前端切换稳定后再评估下线，不在本轮删除。
- 埋点与分析失败不得阻塞发布主流程。
- 英文 Upload 页面只保留一个主落点，多语言页面不随英文规则重定向。
- 运营资产只迁移链接、文案和证据规范，不重复生成已合格视频与概念图。

## 切片一：英文 Upload 页面合并

1. 为旧英文 URL 永久重定向、新 URL 200、多语言 URL 保留以及 sitemap 排除补 SEO 校验测试。
2. 从公共内容入口移除旧英文条目，并把独有内容合并到 `/guides/upload-html-file`。
3. 在部署配置中添加精确匹配永久重定向，确保语言前缀不受影响。
4. 将 README、MCP 文档及站内公开链接迁移到新主页面。
5. 修正 SSG 的生产 API Base URL，校验扩展下载链接不再落到前台 404。

验收：SEO 校验、静态构建、旧英文 URL 配置测试、内部断链检查通过。

## 切片二：发布尝试归因

1. 为共享 DeployTrackingContext、登录态提交事件及上传请求补前端测试。
2. 控制台发布请求增加可选 tracking 字段，后端 DTO、Controller、Service 透传到 Deployment。
3. Guest 与登录态共用同一上下文构造器，同一次 mutation 保持同一 `clientAttemptId`。
4. 埋点失败继续降级，但增加结构化日志和可观测指标。

验收：登录态和 Guest 的 `deploy_submitted`、请求、Deployment、Ready/Failed 使用同一 ID。

## 切片三：管理员分析后端分片

1. 为四个新接口、四个缓存 Key、单分片失败隔离补 Controller、Service、Cache 测试。
2. 在 Service 中复用现有 collector，按 acquisition、operations、commerce、experiments 分组。
3. 为每组使用独立只读事务和缓存加载器，保留旧 deferred 聚合接口。
4. 为 collector 记录耗时、成功和失败指标；真实 PostgreSQL 集成测试增加公开 API 执行预算。

验收：四个端点可独立返回，任何单组失败不污染其他组缓存，旧端点仍兼容。

## 切片四：管理员分析前端部分成功

1. 为并行四请求和部分失败渲染补 Hook/页面测试。
2. 用四个 Query 替换完整 deferred Query，分别设置加载、错误、重试和 stale 状态。
3. 将成功切片合并到既有视图模型；失败切片只影响对应卡片和表格。
4. 前端超时低于后端保护阈值，并预留响应传输余量。

验收：新前端不再调用 `/overview/deferred`，一组 500 时其余三组仍可用。

## 切片五：`operation/0727/` 完整迁移

1. 更新 README、日历、UTM、平台文案、文章、视频描述和置顶评论中的英文 Upload 落点。
2. 新增统一内容 Playbook，明确四个内容支柱、格式职责、单 CTA、截图证据和语言优先级。
3. 增强 `validate.mjs`：禁止旧英文 Upload 外链，要求新主落点，检查七条视频与四张图片及发布文件。
4. 在 `METRICS-REVIEW.md` 追加 2026-08-17 复盘和 7/14/28 天观察项。
5. 复核图片尺寸、体积和用途；不重新生图。复核视频成片、封面、字幕和链接文案；不重新渲染。

验收：运营包校验通过，所有英文素材只指向新主页面，每个素材只有一个主要 CTA。

## 切片六：系统级验证

1. 后端：单元测试、Controller/Service/Cache 测试、可运行的 PostgreSQL 集成测试。
2. Console：Hook/组件测试、SEO 校验、生产 SSG 构建、静态 HTML 断链检查。
3. MCP 与仓库文档：测试、构建及旧链接扫描。
4. 运营包：`validate.mjs`、图片规格脚本、视频文件/字幕/封面存在性检查。
5. 使用 `git diff --check`、全仓精确链接扫描和三个仓库的状态检查收尾。

## 回滚边界

- SEO 重定向可独立回滚，不触碰多语言 URL。
- 新分析端点为增量接口，旧 deferred 保持可用，可单独把前端切回旧接口。
- tracking 字段均为可选，旧客户端请求继续兼容。
- 内容迁移保留 Git 历史，可按素材文件回滚，不删除媒体文件。
