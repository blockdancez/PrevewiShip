# PreviewShip CLI

> One-click deploy previews, instant shareable links.

Deploy static websites to a preview environment from the terminal. Get a shareable link instantly.

Works with any AI coding agent (Codex, OpenClaw, etc.) — they can call the CLI directly.

## Quick Start

```bash
# 1. Get an API Key at https://previewship.com
# 2. Set your API Key
npx previewship login

# 3. Deploy
npx previewship deploy ./dist
```

## Installation

```bash
# Use with npx (no install needed)
npx previewship deploy

# Or install globally
npm install -g previewship
```

## Commands

### `previewship login`

Set your API Key.

```bash
previewship login                    # Interactive input
previewship login --key ps_live_xxx  # Non-interactive (CI/Agent)
```

### `previewship deploy [path]`

Deploy a directory to preview.

```bash
previewship deploy                   # Deploy current directory
previewship deploy ./dist            # Deploy specific directory
previewship deploy -n my-project     # Set project name
previewship deploy --json            # JSON output (for scripting/agents)
previewship deploy --exclude "*.map" # Extra exclude patterns
```

### `previewship status <id>`

Check deployment status.

```bash
previewship status 42
previewship status 42 --json
```

### `previewship usage`

Show quota usage.

```bash
previewship usage
previewship usage --json
```

### `previewship whoami`

Show current configuration.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PREVIEWSHIP_API_KEY` | API Key (overrides config file) |
| `PREVIEWSHIP_SERVER_URL` | Server URL (overrides config file) |
| `CI` | Auto-enables JSON output |
| `NO_COLOR` | Disables colored output |

## Use with AI Agents

AI coding agents can use PreviewShip CLI to deploy previews:

```bash
# Agents should use --json for structured output
previewship deploy ./dist --json
```

## Plans

| | Free | Pro Monthly | Pro Yearly |
|------|------|------------|------------|
| Price | $0 | $9/mo | $84/yr |
| Daily Deploys | 5 | 20 | 35 |
| Monthly Deploys | 20 | 200 | 350 |
| Upload Limit | 15MB | 50MB | 80MB |

[View full plan comparison](https://previewship.com/billing)

## License

MIT
