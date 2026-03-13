# Quick Start — GitHub Agentic Workflows

Source: https://github.github.com/gh-aw/setup/quick-start/

## Overview

Add a pre-built agentic workflow to an existing GitHub repository where you are a maintainer. Estimated time: 10 minutes.

## Prerequisites

- **AI Account** — GitHub Copilot, Anthropic Claude, or OpenAI Codex
- **GitHub Repository** — with write access
- **GitHub Actions** enabled (Settings → Actions)
- **GitHub CLI** (`gh`) v2.0.0+ — https://cli.github.com
- **OS**: Linux, macOS, or Windows with WSL

## Step 1 — Install the Extension

```bash
gh extension install github/gh-aw
```

**Authentication fallback:**
```bash
curl -sL https://raw.githubusercontent.com/github/gh-aw/main/install-gh-aw.sh | bash
```

Or login first:
```bash
gh auth login
```

## Step 2 — Add a Workflow and Trigger a Run

From the repository root:
```bash
gh aw add-wizard githubnext/agentics/daily-repo-status
```

The interactive wizard will:
1. **Check prerequisites** — verify repository permissions
2. **Select an AI Engine** — Copilot, Claude, or Codex
3. **Set up the required secret** — `COPILOT_GITHUB_TOKEN`, `ANTHROPIC_API_KEY`, or `OPENAI_API_KEY`
4. **Add the workflow** — adds `.md` and `.lock.yml` to `.github/workflows/`
5. **Optionally trigger an initial run**

## Step 3 — Wait for Completion

An automated workflow run takes 2-3 minutes. After completion, a new issue is created with a "Daily Repo Report" analyzing:
- Recent repository activity (issues, PRs, discussions, releases, code changes)
- Progress tracking, goal reminders, and highlights
- Project status and recommendations
- Actionable next steps for maintainers

## Step 4 — Customize (Optional)

1. Open `.github/workflows/daily-repo-status.md`
2. Edit the "What to include" section to match your priorities
3. If you changed frontmatter, regenerate YAML:
   ```bash
   gh aw compile
   ```
4. Commit and push
5. Optionally trigger another run:
   ```bash
   gh aw run daily-repo-status
   ```

## What's Next

- [Creating Agentic Workflows](./creating-workflows.md)
- Explore examples at https://github.github.com/gh-aw/blog/2026-01-12-welcome-to-pelis-agent-factory/
