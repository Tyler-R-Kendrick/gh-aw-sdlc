---
name: gh-aw
description: "Install, create, and manage GitHub Agentic Workflows (gh-aw). Use when: setting up gh-aw CLI extension, creating agentic workflow markdown files, compiling workflows, running workflows, managing workflow lifecycle (enable/disable/update/upgrade), troubleshooting gh-aw CLI commands, adding pre-built workflows to a repository."
argument-hint: 'What do you want to do with GitHub Agentic Workflows?'
---

# GitHub Agentic Workflows (gh-aw)

GitHub Agentic Workflows let you define automated AI-powered workflows as markdown files in `.github/workflows/`. They compile to GitHub Actions YAML and run a coding agent (Copilot, Claude, or Codex) to perform tasks on your repository.

## When to Use

- Install the `gh-aw` CLI extension
- Create a new agentic workflow from scratch or from a template
- Add a pre-built workflow from another repository
- Compile workflow markdown into YAML lock files
- Run, monitor, enable, disable, update, or remove workflows
- Troubleshoot workflow issues (compilation errors, missing secrets, permissions)
- Set up shell completions for the CLI
- Manage MCP servers in workflows

## Prerequisites

Before starting, verify:
1. **GitHub CLI** (`gh`) v2.0.0+ is installed: `gh --version`
2. **GitHub Actions** is enabled on the target repository
3. **AI Engine credentials**: `COPILOT_GITHUB_TOKEN`, `ANTHROPIC_API_KEY`, or `OPENAI_API_KEY` configured as repository secrets

## Procedure

### 1. Install the gh-aw Extension

```bash
gh extension install github/gh-aw
```

If authentication issues occur:
```bash
curl -sL https://raw.githubusercontent.com/github/gh-aw/main/install-gh-aw.sh | bash
```

Or login interactively first:
```bash
gh auth login
```

Verify installation:
```bash
gh aw version
```

### 2. Initialize a Repository (Optional)

Configure a repository with agent files for better workflow authoring:
```bash
gh aw init
```

Or via a coding agent prompt:
```
Initialize this repository for GitHub Agentic Workflows using https://raw.githubusercontent.com/github/gh-aw/main/install.md
```

### 3. Create a New Workflow

There are three approaches. See [creating workflows reference](./references/creating-workflows.md) for full details.

**Option A — Coding agent prompt (recommended):**
```
Create a workflow for GitHub Agentic Workflows using https://raw.githubusercontent.com/github/gh-aw/main/create.md

The purpose of the workflow is <describe your workflow>.
```

**Option B — Add a pre-built workflow interactively:**
```bash
gh aw add-wizard <owner>/<repo>/<workflow-name>
# Example: gh aw add-wizard githubnext/agentics/daily-repo-status
```

**Option C — Manual creation:**
1. Create `.github/workflows/<name>.md` with frontmatter and instructions
2. Compile: `gh aw compile`
3. Commit and push both `.md` and `.lock.yml` files

### 4. Compile Workflows

Compile markdown to YAML lock files whenever frontmatter changes:
```bash
gh aw compile                        # Compile all workflows
gh aw compile <workflow-name>        # Compile specific workflow
```

### 5. Run a Workflow

```bash
gh aw run <workflow-name>            # Trigger a run
```

Or trigger from the GitHub Actions tab in the web UI.

### 6. Monitor and Manage

See [CLI reference](./references/cli.md) for all commands. Key ones:

```bash
gh aw status                         # List all workflows and their state
gh aw logs <workflow-name>           # Show recent run logs
gh aw health                         # Success rate metrics (last 7 days)
gh aw enable <workflow-name>         # Enable a workflow
gh aw disable <workflow-name>        # Disable and cancel in-progress runs
gh aw remove <workflow-name>         # Delete .md and .lock.yml
gh aw update                         # Update workflows with source field
gh aw upgrade                        # Upgrade agent files + apply codemods
```

## Workflow File Structure

Agentic workflow files live at `.github/workflows/<name>.md` and contain:
- **YAML frontmatter** — triggers, engine, permissions, schedule, concurrency
- **Markdown body** — natural-language instructions for the AI agent

After `gh aw compile`, a `.github/workflows/<name>.lock.yml` is generated. Both files must be committed.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `command not found: gh` | Install from https://cli.github.com/ |
| `extension not found: aw` | `gh extension install github/gh-aw` |
| Compilation fails with YAML errors | Check frontmatter indentation and syntax |
| Workflow not found | Check typos — CLI auto-suggests similar names |
| Permission denied | Verify repository access and secret configuration |

Enable debug logging:
```bash
DEBUG=* gh aw compile
```

## References

- [Quick Start](./references/quick-start.md) — Step-by-step first workflow setup
- [Creating Workflows](./references/creating-workflows.md) — Authoring methods and patterns
- [CLI Commands](./references/cli.md) — Complete CLI reference
