# PreviewShip

> Deploy previews, share instantly. From your editor, terminal, AI agent, or browser — one step to a live link.

PreviewShip is a frontend preview deployment and sharing platform for developers. Deploy your static site and get a shareable preview URL in seconds — no Git, no CI/CD, no complex configuration.

## Open Source Packages

PreviewShip provides three open-source client packages:

| Package | npm | Description |
|---------|-----|-------------|
| [CLI](#cli) | [`previewship`](https://www.npmjs.com/package/previewship) | Deploy from the terminal with one command |
| [MCP Server](#mcp-server) | [`previewship-mcp`](https://www.npmjs.com/package/previewship-mcp) | Native tool integration for AI coding agents |
| [VS Code Extension](#vs-code--cursor-extension) | [Marketplace](https://marketplace.visualstudio.com/items?itemName=previewship.previewship) | One-click deploy from your editor |

## Deployment Methods

| Method | Command / Action | Best For |
|--------|-----------------|----------|
| CLI | `npx previewship deploy ./dist` | Terminal, scripts, CI/CD |
| MCP Server | Say "deploy to PreviewShip" in AI chat | Claude Code, Cursor, Windsurf |
| VS Code / Cursor Extension | Command Palette → `PreviewShip: Deploy` | Editor-first workflow |
| Web Console | Drag & drop zip at [previewship.com](https://previewship.com) | Zero-tool deployment |

---

## CLI

One-command deploy from any terminal. Supports JSON output for AI agents and CI pipelines.

### Quick Start

```bash
# Set your API Key
npx previewship login --key ps_live_YOUR_KEY

# Deploy a directory
npx previewship deploy ./dist
```

### Commands

| Command | Description |
|---------|-------------|
| `previewship login [--key KEY]` | Set API Key for authentication |
| `previewship deploy [path] [-n name] [--json]` | Deploy a directory and get a preview URL |
| `previewship status <id> [--json]` | Check deployment status by ID |
| `previewship usage [--json]` | Show remaining deployment quota |
| `previewship whoami` | Display current configuration |

### Options

```bash
# Deploy with a custom project name
npx previewship deploy ./dist -n my-project

# JSON output for AI agents and CI
npx previewship deploy ./dist --json

# Custom exclude patterns
npx previewship deploy ./dist --exclude "*.map" --exclude "tests/**"
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `PREVIEWSHIP_API_KEY` | API Key (overrides saved config) |
| `PREVIEWSHIP_SERVER_URL` | Custom API server URL |
| `CI` | Auto-enables JSON output in CI environments |
| `NO_COLOR` | Disables colored output |

### Programmatic Usage

The CLI also exports its core functions for use as a library:

```typescript
import { deploy, getStatus, getUsage } from 'previewship'
import { ApiClient } from 'previewship'
import { packDirectory, DEFAULT_EXCLUDE_PATTERNS } from 'previewship'
```

---

## MCP Server

[Model Context Protocol](https://modelcontextprotocol.io) server that lets AI coding agents deploy previews as a native tool call. Works with Claude Code, Cursor, Windsurf, and any MCP-compatible client.

### Setup

**Claude Code** — add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "previewship": {
      "command": "npx",
      "args": ["-y", "previewship-mcp"],
      "env": {
        "PREVIEWSHIP_API_KEY": "ps_live_YOUR_KEY"
      }
    }
  }
}
```

**Cursor** — create `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "previewship": {
      "command": "npx",
      "args": ["-y", "previewship-mcp"],
      "env": {
        "PREVIEWSHIP_API_KEY": "ps_live_YOUR_KEY"
      }
    }
  }
}
```

**Windsurf** — add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "previewship": {
      "command": "npx",
      "args": ["-y", "previewship-mcp"],
      "env": {
        "PREVIEWSHIP_API_KEY": "ps_live_YOUR_KEY"
      }
    }
  }
}
```

### Available Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `deploy_preview` | Deploy a directory and get a preview URL | `path` (optional), `projectName` (optional), `excludePatterns` (optional) |
| `check_deployment` | Check deployment status by ID | `deploymentId` (required) |
| `show_usage` | Show remaining deployment quota | — |

### Usage

Once configured, simply ask your AI agent:

> "Deploy this project to PreviewShip"
> "Check the status of my last deployment"
> "How many deploys do I have left today?"

---

## VS Code / Cursor Extension

One-click deploy from VS Code or Cursor. Install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=previewship.previewship) or [Open VSX Registry](https://open-vsx.org/extension/previewship/previewship).

### Install

**Via Command Palette** (Ctrl+P / Cmd+P):

```
ext install previewship.previewship
```

**Via VSIX** (offline install):

```bash
code --install-extension previewship-0.1.3.vsix
# Or for Cursor:
cursor --install-extension previewship-0.1.3.vsix
```

### Commands

| Command | Description |
|---------|-------------|
| `PreviewShip: Set API Key` | Store your API Key securely (encrypted via VS Code Secrets API) |
| `PreviewShip: Deploy Current Workspace` | Package, upload, and deploy your project |
| `PreviewShip: Show Usage` | Display daily/monthly deployment quota |

### Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `previewship.serverUrl` | `https://api.previewship.com` | API server URL |
| `previewship.excludePatterns` | `node_modules/**`, `.git/**`, `.env*`, etc. | File exclude patterns for packaging |
| `previewship.pollIntervalMs` | `3000` | Deployment status polling interval (ms) |
| `previewship.pollTimeoutMs` | `300000` | Polling timeout (ms) |

---

## Getting Started

1. **Register** a free account at [previewship.com](https://previewship.com)
2. **Create an API Key** from the console → API Keys page
3. **Deploy** using any method above
4. **Share** the preview link with your team

## Plans

| | Free | Pro Monthly | Pro Yearly |
|-|-----:|----------:|----------:|
| **Price** | $0 | $9/mo | $84/yr ($7/mo) |
| **Projects** | 1 | 10 | 20 |
| **Daily Deploys** | 5 | 30 | 40 |
| **Max Zip Size** | 15 MB | 50 MB | 80 MB |
| **Preview Expiry** | 7 days | 30 days | 365 days |

Free plan requires no credit card. Start deploying instantly.

## Supported Frameworks

Any static frontend output works — React, Vue, Svelte, Angular, Next.js (export), Nuxt (generate), Astro, vanilla HTML/CSS/JS, and more. Just make sure your build output contains an `index.html`.

## Requirements

- **Node.js** ≥ 20.0.0 (for CLI and MCP)
- **VS Code** ≥ 1.85.0 (for extension)
- An API Key from [previewship.com](https://previewship.com)

## Links

- **Website**: [previewship.com](https://previewship.com)
- **Documentation**: [previewship.com/docs](https://previewship.com/docs)
- **CLI on npm**: [npmjs.com/package/previewship](https://www.npmjs.com/package/previewship)
- **MCP on npm**: [npmjs.com/package/previewship-mcp](https://www.npmjs.com/package/previewship-mcp)
- **VS Code Marketplace**: [marketplace.visualstudio.com](https://marketplace.visualstudio.com/items?itemName=previewship.previewship)

## License

MIT — see [LICENSE](LICENSE) for details.
