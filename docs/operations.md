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

## Coding-agent environment setup
- The dev container installs `act` via the devcontainer feature and verifies both `act` and `gh-aw` in `.devcontainer/post-create.sh` for local workflow validation.
- `.github/workflows/copilot-setup-steps.yml` installs `act` and `gh-aw` for GitHub Copilot coding agents.
- The standard `CI` workflow includes a `workflow-validation` job so agentic workflow regressions are visible to PR authors and to `ci-doctor`.

## Demo operating notes
- Keep remediation PRs as drafts by default for security-related workflows.
- Use labels instead of hidden state whenever possible.
- Re-run `gh aw compile` whenever workflow frontmatter changes.
- Keep docs and workflow metadata aligned so the repo remains easy to explain during demos.
