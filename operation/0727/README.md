# PreviewShip 核心内容与发布治理包（2026-07-27，2026-08-17 治理）

这批材料按四条可长期复用的用户任务组织，不再围绕近义词批量扩页：

1. AI 生成物 → 可独立打开的评审 URL。
2. 浏览器可直接执行的前端产物 → 上传、发布、验证。
3. HTML / Markdown / PDF / ZIP / 静态 build output → 网页链接。
4. Preview、评审与生产托管之间的选择证据。

所有 Markdown 均按“打开文件 → 复制正文 → 上传指定图片 → 替换/确认链接 → 发布”的方式准备。

## 第一优先级

| 优先级 | 主题 | 主要落点 | 目的 |
| --- | --- | --- | --- |
| P0 | Upload HTML | `https://previewship.com/guides/upload-html-file` | 高意图流量与发布转化 |
| P0 | Claude Artifact | `https://previewship.com/guides/share-claude-html-artifacts` | Claude 搜索、MCP、付费转化 |
| P1 | Free Static Hosting | `https://previewship.com/guides/free-static-website-hosting` | 修复高展示低 CTR |
| P1 | Español | 4 个独立西班牙语页面 | Bing/Copilot 引用与西语搜索点击 |

## 目录

- `PUBLISHING-CALENDAR.md`：28 天发布时间表。
- `PUBLICATION-LEDGER.csv`：素材 × 平台的唯一发布状态、真实日期、公开 URL、canonical 与 7/14/28 天复盘账本。
- `UTM-LINKS.md`：可直接复制的带 UTM 链接。
- `METRICS-REVIEW.md`：每周复盘表和继续/停止条件。
- `CONTENT-PLAYBOOK.md`：后续帖子、文章、视频、图片的统一内容合同与证据标准。
- `devto/`：英文长文。
- `medium/`：英文解释型文章。
- `spanish/`：西班牙语长文与教程。
- `linkedin-x/`：LinkedIn 与 X 的英文/西班牙语短帖。
- `reddit/`：讨论型帖子，不使用硬广写法。
- `hackernews/`：Show HN 与评论回复模板。
- `youtube/`：4 条已完成 Shorts 的逐镜脚本、标题和说明。
- `videos/SPANISH-FOCUSED-SHORTS.md`：Cursor、Claude、VS Code 三条西语聚焦短视频的旁白、镜头、字幕和逐平台文案。
- `distribution/`：GitHub、npm、MCP 目录、Marketplace、Open VSX 的更新材料。
- `newsletter/`：可直接发送的产品更新邮件。
- `indiehackers/`：带构建者披露的产品经验帖。
- `images/optimized/`：最终发布图片。
- `images/source/`：GPT‑5.4 Image 2 原始生成图，方便后续裁剪。
- `validate.mjs`：检查必需文件、UTM、错误落点、占位符和图片尺寸。

`PUBLICATION-LEDGER.csv` 的状态只允许 `planned`、`paused`、`published_pending_verification`、`published`、`retired`。用户已确认完成发布但尚未核验精确公开 URL 时，填写 `published_pending_verification` 与 `actual_date`，保留空 `public_url`；能够从公开页面或官方注册表核验后才改为 `published` 并填写精确 URL。`review_7d`、`review_14d`、`review_28d` 使用 `pending`、`not_recorded` 或已完成复盘的简短结果，不用计划日期冒充实际日期。

## 发布原则

- 英文 Upload 内容一律链接 `/guides/upload-html-file`；旧英文指南已永久合并，不再分流。不要链接 noindex 的 `/upload-html-file-to-website` 广告页。
- 一条内容只回答一个问题、只拥有一个主落点和一个 CTA。补充资料使用站内上下文链接，不在发布文案末尾堆多个入口。
- Claude 内容必须承认 Claude Code 已有原生 Artifacts；PreviewShip 只强调本地文件、多文件静态产物、build 输出和 CLI/MCP 独立预览 URL。
- Free Static Hosting 必须明确是 preview hosting，不得暗示永久生产托管。
- 视频必须出现“问题 → 正确产物 → 发布 → 打开验证 → 单一 CTA”；没有真实结果画面时不得声称流程已成功。
- Reddit、HN 先讲问题、判断方法和限制，最后轻量放链接。
- 同一长文跨平台复发时，后发平台设置 canonical 到首发文章或 PreviewShip 对应指南。
- 不在同一天群发所有平台。
- 每条外链必须有唯一、稳定的 `utm_content`；同一成片跨平台保持同一内容 ID，由 `utm_source` 区分平台。
- 概念图只负责表达问题或选择；功能证据必须使用当前版本的真实界面截图。英语和西班牙语优先；繁中、韩语只在连续数据证明需求后扩展。

## 图片

最终发布使用：

```text
operation/0727/images/optimized/html-file-live-url-1200x630.png
operation/0727/images/optimized/native-artifact-or-preview-url-1200x630.png
operation/0727/images/optimized/preview-vs-production-hosting-1200x630.png
operation/0727/images/optimized/es-code-to-public-url-1200x630.png
```

四张图均未使用或重绘 PreviewShip Logo，没有虚构价格、评价或产品截图。

这些图片只作概念封面。教程和视频中的功能证据必须使用 `videos/captures/` 下的真实产品或指南截图；推荐按“概念封面 → 真实流程 → 真实结果”的顺序组合。

## 发布前 60 秒检查

1. 页面已部署到生产并能返回 200。
2. 链接的 `utm_source` 与平台一致。
3. 链接包含对应素材的 `utm_content`，且与 `UTM-LINKS.md` 一致。
4. 封面使用 `images/optimized/`，功能证据使用真实截图。
5. Alt 文本已填写。
6. 文章内没有把 preview hosting 写成 production hosting。
7. Claude 文章已按发布当天官方文档复核 Artifact 相关事实。
8. 西班牙语正文统一使用 `artefacto`；仅产品专有名词使用 `Artifact`。
9. 实际发布日期、公开 URL 与 7/14/28 天复盘状态只记录到 `PUBLICATION-LEDGER.csv`。

## 本地自检

在仓库根目录执行：

```bash
node operation/0727/validate.mjs
```

只有输出“运营素材校验通过”后再开始复制发布。
