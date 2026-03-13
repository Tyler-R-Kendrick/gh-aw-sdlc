# Creating Agentic Workflows

Source: https://github.github.com/gh-aw/setup/creating-workflows/

## Overview

Author new agentic workflows using a coding agent, the GitHub web interface, or manual editing. Estimated time: 5-15 minutes.

## Method 1 — GitHub Web Interface

Use Copilot on github.com with prompts like:

```markdown
Create a workflow for GitHub Agentic Workflows using https://raw.githubusercontent.com/github/gh-aw/main/create.md

The purpose of the workflow is to <describe purpose>.
```

### Example Prompts

- **Issue Triage**: "triage new issues: label them by type and priority, identify duplicates, ask clarifying questions when the description is unclear, and assign them to the right team members."
- **Activity Report**: "a daily report on recent activity in the repository, delivered as an issue. The report should summarize new issues, pull requests merged, and any open blockers."
- **Documentation Updater**: "run daily and keep the repository documentation up to date: identify doc files that are out of sync with recent code changes and open a pull request with the necessary updates."
- **AGENTS.md Maintainer**: "run weekly and maintain the AGENTS.md file: review merged pull requests and updated source files since the last run, then open a pull request that keeps AGENTS.md accurate and current."

> **Note**: On the first run in a new repository, the workflow may fail if secrets are not configured. The agentic workflow will detect missing tokens and create an issue with setup instructions.

## Method 2 — Coding Agent (VS Code / Claude / Codex)

1. **Start your coding agent** (VS Code Agent Mode, CLI agent, etc.)

2. **Enter the prompt**:
   ```
   Create a workflow for GitHub Agentic Workflows using https://raw.githubusercontent.com/github/gh-aw/main/create.md

   The purpose of the workflow is <describe your workflow>.
   ```

3. **Set up required secrets** if not already configured. Adjust the `engine:` field in frontmatter if not using Copilot.

After merging, trigger runs from the Actions tab or:
```bash
gh aw run <workflow-name>
```

> **Tip**: Run `gh aw init` to configure the repository for better agentic authoring, or use this prompt:
> ```
> Initialize this repository for GitHub Agentic Workflows using https://raw.githubusercontent.com/github/gh-aw/main/install.md
> ```

## Method 3 — Manual Editing

1. Create `.github/workflows/<workflow-name>.md` with YAML frontmatter and markdown body
2. Install the CLI extension:
   ```bash
   gh extension install github/gh-aw
   ```
3. Compile markdown to YAML:
   ```bash
   gh aw compile
   ```
   This generates `.github/workflows/<workflow-name>.lock.yml`
4. Commit and push both files:
   ```bash
   git add .github/workflows/<workflow-name>.md
   git add .github/workflows/<workflow-name>.lock.yml
   git commit -m "Add <workflow-name> workflow"
   git push
   ```
5. Set up repository secrets for your chosen AI engine

## Adding an Existing Workflow

Use `gh aw add-wizard` to add a workflow from another repository:
```bash
gh aw add-wizard <owner>/<repo>/<workflow-name>
```

Or see the Reusing Workflows guide at https://github.github.com/gh-aw/guides/packaging-imports/

## Learn More

- Agentic Authoring guide: https://github.github.com/gh-aw/guides/agentic-authoring/
- Frontmatter reference: https://github.github.com/gh-aw/reference/frontmatter/
- Workflow structure: https://github.github.com/gh-aw/reference/workflow-structure/
