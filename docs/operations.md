# Operations

## Required secrets and signals
- `COPILOT_GITHUB_TOKEN` for Copilot-powered GH-AW workflows
- `SNYK_TOKEN` when running Snyk-backed remediation in environments that call the Snyk CLI or API
- Dependabot, Snyk, GitHub code scanning, and standard CI stay enabled as signal sources

## Authoring and compiling workflows
1. Edit `.github/workflows/*.md`.
2. Compile lock files:
   ```bash
   gh aw compile
   ```
3. Commit both the markdown workflow and the generated `.lock.yml` file.

## Validation commands
- `npm run build`
- `npm run lint`
- `npm run test:api`
- `npm run test:workflows`

## Testing workflows

Use these `gh aw` commands to test workflows at increasing levels of confidence:

### 1. Static validation (no GitHub auth required)
```bash
gh aw validate                    # validate all workflows with linters
gh aw validate issue-triage       # validate a specific workflow
```
Runs `compile --no-emit` plus `zizmor`, `actionlint`, and `poutine` linters. Catches syntax errors, security issues, and deprecated fields without generating any files.

### 2. Dry-run dispatch (GitHub auth required, nothing executes)
```bash
gh aw run issue-triage --dry-run
gh aw run issue-triage --dry-run --ref <branch>
```
Validates that the lock file exists and is dispatchable on GitHub Actions without actually triggering a run.

### 3. Real dispatch on GitHub Actions (requires `workflow` permission)
```bash
gh aw run issue-triage
gh aw run issue-triage --ref <branch>   # run the version on a specific branch
```
Triggers a `workflow_dispatch` event on GitHub Actions. The token used (or `gh auth login` session) must have write access to Actions. In the Copilot coding-agent sandbox this call is blocked by the firewall — trigger from a local machine or after merging to `main`.

### 4. Trial mode (creates an isolated sandbox run on GitHub Actions)
```bash
gh aw trial owner/repo/issue-triage --delete-host-repo-after
```
Creates a private trial repository, installs the workflow from the specified source, and runs it in isolation so safe-outputs do not affect the real repository. Use `--host-repo` to run directly in an existing repository instead. Also requires write access to GitHub Actions and repo creation permissions.

## Coding-agent environment setup
- The dev container installs `act` via the devcontainer feature and verifies both `act` and `gh-aw` in `.devcontainer/post-create.sh` for local workflow validation.
- `.github/workflows/copilot-setup-steps.yml` installs `act` and `gh-aw` for GitHub Copilot coding agents.
- The standard `CI` workflow includes a `workflow-validation` job so agentic workflow regressions are visible to PR authors and to `ci-doctor`.

## Demo operating notes
- Keep remediation PRs as drafts by default for security-related workflows.
- Use labels instead of hidden state whenever possible.
- Re-run `gh aw compile` whenever workflow frontmatter changes.
- Keep docs and workflow metadata aligned so the repo remains easy to explain during demos.
