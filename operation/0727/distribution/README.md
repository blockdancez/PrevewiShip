# Owned Distribution Update Sheet

These are copy blocks for assets you control. The `utm_content`-complete GitHub/npm revision was prepared for the 2026-08-31 publishing close. Verification state and exact public URLs live only in `../PUBLICATION-LEDGER.csv`; this file does not duplicate release status.

## 2026-08-03 发布记录

- GitHub 根 README：旧版深链于 2026-08-03 推送；本轮新增 `utm_content` 的版本尚未推送。
- GitHub About / Website / Topics：已核对线上状态，与本页批准稿一致，无需重复修改。
- npm `previewship-mcp`：1.0.13 于 2026-08-03 发布；本轮补齐 `utm_content` 的 README 尚未发布新版本。
- 本地验收：TypeScript 类型检查、MCP 构建、`npm pack --dry-run`、全部 8 条 UTM 链接的 HTTP 200 检查均已通过。

### 后续版本复用的 GitHub 发布步骤

以下命令是下一次版本发布检查表，不要为已经发布的 1.0.13 重复执行：

在仓库根目录执行：

```bash
cd /Users/neurobin/develop/backend/PreviewShip
git diff --check
git diff -- README.md mcp/README.md mcp/package.json mcp/package-lock.json mcp/src/tools.ts
git add README.md mcp/README.md mcp/package.json mcp/package-lock.json mcp/src/tools.ts
git commit -m "docs: add tracked GitHub and npm guide links"
git push origin main
```

推送后打开以下页面，确认 README 中的链接带有对应 UTM：

- <https://github.com/blockdancez/PreviewShip>
- <https://github.com/blockdancez/PreviewShip/tree/main/mcp>

### 后续版本复用的 npm 发布步骤

仅在版本号和变更记录已经更新时执行：

```bash
cd /Users/neurobin/develop/backend/PreviewShip/mcp
npm login
npm whoami
npm run typecheck
npm run build
npm pack --dry-run
npm publish --access public
```

如果 npm 账户启用了双重验证，按终端提示在 npm 登录页完成验证；不要把密码、Token 或一次性验证码发到聊天中。

发布后验证：

```bash
npm view previewship-mcp version
npm view previewship-mcp description
npm view previewship-mcp readme | grep -E "utm_source=npm|Deploy from Claude Code|Upload an HTML file"
```

预期版本为 `1.0.13`，预期描述为：

```text
MCP server for deploying browser-ready HTML files and static build output to shareable PreviewShip review URLs.
```

最后打开 <https://www.npmjs.com/package/previewship-mcp>，确认 Guides 区块显示四条带 UTM 的优先链接。npm 页面可能有几分钟缓存延迟。

## GitHub repository About

Description:

```text
Turn HTML, static build output, Markdown, or PDF files into shareable preview URLs. Direct upload, CLI, VS Code, and MCP workflows.
```

Website:

```text
https://previewship.com/guides/upload-html-file?utm_source=github&utm_medium=repository&utm_campaign=core_content_cluster_0727&utm_content=owned_github_about_upload
```

Suggested topics:

```text
static-site
html-preview
preview-deployment
mcp-server
claude-code
vscode-extension
frontend-tools
```

## npm package README insert

Heading:

```text
### Guides
```

Body:

```markdown
- [Deploy from Claude Code](https://previewship.com/guides/deploy-from-claude-code?utm_source=npm&utm_medium=package&utm_campaign=core_content_cluster_0727&utm_content=owned_npm_claude_en)
- [Deploy from Claude Code — Español](https://previewship.com/es/guides/deploy-from-claude-code?utm_source=npm&utm_medium=package&utm_campaign=core_content_cluster_0727&utm_content=owned_npm_claude_es)
- [Share Claude HTML artifacts](https://previewship.com/guides/share-claude-html-artifacts?utm_source=npm&utm_medium=package&utm_campaign=core_content_cluster_0727&utm_content=owned_npm_claude_artifact)
- [Publish an HTML file](https://previewship.com/guides/upload-html-file?utm_source=npm&utm_medium=package&utm_campaign=core_content_cluster_0727&utm_content=owned_npm_upload_html)
```

Package description:

```text
MCP server for deploying browser-ready HTML files and static build output to shareable PreviewShip review URLs.
```

## MCP directory listing

Short description:

```text
Deploy browser-ready HTML files, static folders, and framework build output from Claude Code, Cursor, or another MCP client, then return a shareable review URL.
```

Long description:

```text
PreviewShip MCP handles the deployment step: an agent can run a production build, identify the browser-ready static output, deploy it, and return the resulting URL. Page verification is a separate browser or manual QA step. It is designed for static preview artifacts, not backends, databases, secrets, or production application hosting.
```

Documentation URL:

```text
https://previewship.com/docs/mcp?utm_source=mcp_directory&utm_medium=directory&utm_campaign=core_content_cluster_0727&utm_content=owned_mcp_directory_docs_en
```

Example prompt:

```text
Run the production build, identify the browser-ready static output, and deploy that directory with PreviewShip. After the tool returns a URL, open it in a browser or ask for manual QA before reporting it as verified. Stop and explain if the project requires a backend.
```

## VS Code Marketplace

Short description:

```text
Publish the active HTML file, a static workspace, or framework build output as a shareable PreviewShip review URL.
```

English documentation block:

```markdown
Choose the deployment target that matches your project:

- **Active File** for one self-contained HTML file
- **Workspace** for HTML with local CSS, JavaScript, images, or fonts
- **Build Output** for React, Vue, Vite, and other compiled frontends

[Read the VS Code guide](https://previewship.com/docs/vscode?utm_source=vscode_marketplace&utm_medium=marketplace&utm_campaign=core_content_cluster_0727&utm_content=owned_vscode_marketplace_docs_en)
```

Spanish documentation block:

```markdown
¿Usas VS Code en español?

[Publicar HTML y salidas de build desde VS Code](https://previewship.com/es/docs/vscode?utm_source=vscode_marketplace&utm_medium=marketplace&utm_campaign=core_content_cluster_0727&utm_content=owned_vscode_marketplace_docs_es)
```

## Open VSX

Description:

```text
Create review URLs from an active HTML file, a static workspace, or browser-ready build output without turning a temporary preview into a production release.
```

Documentation URL:

```text
https://previewship.com/docs/vscode?utm_source=openvsx&utm_medium=marketplace&utm_campaign=core_content_cluster_0727&utm_content=owned_openvsx_docs_en
```

## GitHub issue / release-note snippet

Title:

```text
Docs: artifact-aware HTML publishing guides and Spanish agent workflows
```

Body:

```text
Documentation now distinguishes:

• one self-contained HTML file
• HTML with local assets
• framework source vs browser-ready build output
• Claude native Artifacts vs independent preview URLs
• preview hosting vs production hosting

New Spanish workflow guides cover Claude Code, VS Code, Cursor, and publishing HTML to the web.
```

## External publish checklist

1. Merge and release the relevant repository/package/extension changes.
2. Confirm every target page returns 200 in production.
3. Publish the Marketplace/Open VSX text through their normal listing workflow.
4. Update MCP directories individually; do not submit the same description to unrelated directories.
5. Record the publish URL and actual date in `../PUBLICATION-LEDGER.csv`; review files only reference that ledger.
