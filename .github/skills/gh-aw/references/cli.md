# CLI Commands — GitHub Agentic Workflows

Source: https://github.github.com/gh-aw/setup/cli/

## Installation

```bash
gh extension install github/gh-aw
```

## Core Commands

### `init`
Initialize repository with agent configuration files.
```bash
gh aw init
```

### `compile`
Compile workflow markdown into GitHub Actions YAML lock files.
```bash
gh aw compile                        # Compile all workflows
gh aw compile <workflow-name>        # Compile specific workflow
gh aw compile --dir <path>           # Custom directory
gh aw compile --engine claude        # Override engine
gh aw compile --dry-run              # Show changes without writing
```
**Options:** `--dir`, `--engine`, `--dry-run`, `--verbose`, `--no-stop-after`, `--stop-after`

### `run`
Trigger a workflow run.
```bash
gh aw run <workflow-name>            # Run workflow
gh aw run <workflow-name> --repo owner/repo  # Run in specific repo
```
**Options:** `--repo`

### `status`
List all agentic workflows and their current state.
```bash
gh aw status                         # All workflows
gh aw status --repo owner/repo       # Specific repository
gh aw status --json                  # JSON output format
```
**Options:** `--repo`, `--json`

### `logs`
View recent workflow run logs.
```bash
gh aw logs <workflow-name>           # Latest run logs
gh aw logs <workflow-name> --last 5  # Last 5 runs
gh aw logs <workflow-name> --json    # JSON output
```
**Options:** `--last`, `--repo`, `--json`

### `audit`
Audit workflow runs with cost and token usage data.
```bash
gh aw audit                          # Audit all workflows
gh aw audit <workflow-name>          # Audit specific workflow
gh aw audit --days 30                # Last 30 days
gh aw audit --json                   # JSON output
```
**Options:** `--days`, `--repo`, `--json`

### `health`
Show workflow health metrics and success rates.
```bash
gh aw health                         # Summary (last 7 days)
gh aw health <workflow-name>         # Specific workflow
gh aw health --days 30               # 30-day window
gh aw health --threshold 90          # Alert below 90%
gh aw health --json                  # JSON output
```
**Options:** `--days`, `--threshold`, `--repo`, `--json`

Shows success/failure rates, trend indicators (↑ improving, → stable, ↓ degrading), execution duration, token usage, and costs.

## Management Commands

### `enable`
Enable one or more workflows.
```bash
gh aw enable                         # Enable all
gh aw enable <workflow-name>         # Enable specific
gh aw enable <wf1> <wf2>            # Enable multiple
gh aw enable <wf> --repo owner/repo  # Specific repository
```

### `disable`
Disable workflows and cancel in-progress runs.
```bash
gh aw disable                        # Disable all
gh aw disable <workflow-name>        # Disable specific
gh aw disable <wf1> <wf2>           # Disable multiple
gh aw disable <wf> --repo owner/repo
```

### `remove`
Remove workflows (both `.md` and `.lock.yml`).
```bash
gh aw remove <workflow-name>
```

### `update`
Update workflows based on `source` field. Uses 3-way merge to preserve local changes.
```bash
gh aw update                         # Update all with source field
gh aw update <workflow-name>         # Update specific (3-way merge)
gh aw update <wf> --no-merge         # Override with upstream
gh aw update <wf> --major --force    # Allow major version updates
gh aw update --disable-release-bump  # Only force-update core actions/*
gh aw update --create-pull-request   # Update and open a PR
```
**Options:** `--dir`, `--no-merge`, `--major`, `--force`, `--engine`, `--no-stop-after`, `--stop-after`, `--disable-release-bump`, `--create-pull-request`

### `upgrade`
Upgrade repository agent files and apply codemods to all workflows.
```bash
gh aw upgrade                        # Full upgrade
gh aw upgrade --no-fix               # Agent files only (skip codemods)
gh aw upgrade --create-pull-request  # Upgrade and open a PR
gh aw upgrade --audit                # Run dependency health audit
gh aw upgrade --audit --json         # Audit in JSON format
```
**Options:** `--dir`, `--no-fix`, `--no-actions`, `--create-pull-request`, `--audit`, `--json`

### `add-wizard`
Interactive workflow wizard for adding pre-built workflows.
```bash
gh aw add-wizard <owner>/<repo>/<workflow-name>
```

## Advanced Commands

### `mcp`
Manage MCP (Model Context Protocol) servers in workflows.
```bash
gh aw mcp list <workflow>            # List servers
gh aw mcp list-tools <mcp-server>    # List server tools
gh aw mcp inspect <workflow>         # Inspect and test servers
gh aw mcp add                        # Add MCP tool to workflow
```

### `mcp-server`
Run gh-aw as an MCP server exposing commands as tools.
```bash
gh aw mcp-server                     # stdio transport
gh aw mcp-server --port 8080         # HTTP server with SSE
gh aw mcp-server --validate-actor    # Enable actor validation
```
**Available Tools:** status, compile, logs, audit, mcp-inspect, add, update

### `pr transfer`
Transfer a pull request to another repository.
```bash
gh aw pr transfer <pr-url> --repo target-owner/target-repo
```

### `project new`
Create a GitHub Projects V2 board.
```bash
gh aw project new "My Project" --owner @me
gh aw project new "Team Board" --owner myorg
gh aw project new "Bugs" --owner myorg --link myorg/myrepo
```
> **Note**: Requires a PAT with Projects permissions — the default `GITHUB_TOKEN` cannot create projects.

### `hash-frontmatter`
Compute SHA-256 hash of workflow frontmatter for change detection.
```bash
gh aw hash-frontmatter <workflow>.md
```

## Utility Commands

### `version`
```bash
gh aw version
```

### `completion`
Generate shell completion scripts for tab completion.
```bash
gh aw completion install             # Auto-detect and install
gh aw completion uninstall           # Remove completions
gh aw completion bash                # Generate bash script
gh aw completion zsh                 # Generate zsh script
gh aw completion fish                # Generate fish script
gh aw completion powershell          # Generate PowerShell script
```

**Manual installation:**
```bash
# Bash
gh aw completion bash > ~/.bash_completion.d/gh-aw && source ~/.bash_completion.d/gh-aw

# Zsh
gh aw completion zsh > "${fpath[1]}/_gh-aw" && compinit

# Fish
gh aw completion fish > ~/.config/fish/completions/gh-aw.fish

# PowerShell
gh aw completion powershell | Out-String | Invoke-Expression
```

## Debug Logging

```bash
DEBUG=* gh aw compile                # All logs
DEBUG=cli:* gh aw compile            # CLI only
DEBUG=*,-tests gh aw compile         # All except tests
```

Use `--verbose` flag for user-facing details.

## Smart Features

### Fuzzy Workflow Name Matching
Auto-suggests similar names on typos:
```bash
gh aw compile audti-workflows
# ✗ workflow file not found
# Did you mean: audit-workflows?
```
Works with: compile, enable, disable, logs, mcp commands.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `command not found: gh` | Install from https://cli.github.com/ |
| `extension not found: aw` | `gh extension install github/gh-aw` |
| Compilation fails with YAML errors | Check indentation, colons, and array syntax in frontmatter |
| Workflow not found | Check typo suggestions or `gh aw status` |
| Permission denied | Check file permissions or repository access |
| Trial creation fails | Check GitHub rate limits and authentication |

## Related Documentation

- Quick Start: https://github.github.com/gh-aw/setup/quick-start/
- Frontmatter: https://github.github.com/gh-aw/reference/frontmatter/
- Frontmatter (Full): https://github.github.com/gh-aw/reference/frontmatter-full/
- Security Guide: https://github.github.com/gh-aw/introduction/architecture/
- MCP Server Guide: https://github.github.com/gh-aw/reference/gh-aw-as-mcp-server/
- Authentication: https://github.github.com/gh-aw/reference/auth/
- Triggers: https://github.github.com/gh-aw/reference/triggers/
- Common Issues: https://github.github.com/gh-aw/troubleshooting/common-issues/
- Error Reference: https://github.github.com/gh-aw/troubleshooting/errors/
