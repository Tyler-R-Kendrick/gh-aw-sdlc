# GH-AW AI-Driven SDLC Demo Repository

This repository demonstrates an end-to-end **AI-driven software development lifecycle** using **GitHub Agentic Workflows (GH-AW)** on top of the existing OctoCAT Supply sample application.

## What GH-AW is
GH-AW lets you author agentic workflows as markdown files in `.github/workflows/*.md`, compile them into `.lock.yml`, and run them as GitHub Actions with Copilot or another supported engine.

## What inner loop means here
The inner loop is the branch/PR/build/release-prep path:
- PR evaluation
- failed CI diagnosis
- code scanning remediation
- Snyk remediation
- breaking-change review during PRs
- changeset generation
- duplicate asset review in PRs

## What outer loop means here
The outer loop is the governance and oversight path:
- issue intake and backlog hygiene
- architecture drift detection
- breaking-change monitoring across recent activity
- daily repo status reporting
- merged PR analytics
- workflow/doc/template staleness reporting

## Signal sources vs GH-AW workflows
This repo keeps existing scanners and automation in place:
- **Dependabot** remains the dependency-update signal source.
- **Snyk** remains the vulnerability scanner and feeds `snyk-remediation`.
- **GitHub code scanning** remains the native security alert source for `code-scanning-fixer`.
- **Standard CI** remains the build/test signal source for `ci-doctor`.

GH-AW is the analysis, orchestration, triage, remediation, reporting, and governance layer above those signals.

## Workflow provenance
### Directly adopted or lightly adapted from public GH-AW examples
- `issue-triage` ← `auto-triage-issues`
- `ci-doctor` ← `ci-doctor`
- `code-scanning-fixer` ← `code-scanning-fixer`
- `breaking-change-checker` ← `breaking-change-checker`
- `architecture-guardian` ← `architecture-guardian`
- `changeset-generator` ← `changeset`
- `merged-pr-report` ← `copilot-pr-merged-report`

### Adapted from proven public examples
- `pr-contribution-check` ← `contribution-check`
- `daily-repo-status` ← GH-AW quick-start daily reporting pattern
- `resource-staleness-report` ← Awesome Copilot `resource-staleness-report`
- `pr-duplicate-check` ← Awesome Copilot `pr-duplicate-check`

### Custom derivative built from an established pattern
- `snyk-remediation` ← custom derivative of `code-scanning-fixer`

## Repo layout
- `.github/workflows/` — GH-AW markdown workflows, compiled lock files, standard CI, and coding-agent setup
- `docs/` — SDLC map, loop docs, architecture guidance, operations, and demo scenarios
- `.changeset/` — release-note scaffolding used by `changeset-generator`
- `.architecture.yml` — starter architecture governance rules

## Compile GH-AW workflows
```bash
gh aw compile
```
Commit both the markdown workflow and the generated `.lock.yml` file.

## Run the demo
1. Install prerequisites and open the dev container.
2. Verify `gh aw version` works.
3. Run `npm run test:workflows` to validate the workflow inventory.
4. Open an issue or PR and trigger the relevant GH-AW workflow from the Actions tab.
5. Use `docs/repo-demo-scenarios.md` as the guided walkthrough.

## Additional docs
- `docs/sdlc-agent-map.md`
- `docs/inner-loop.md`
- `docs/outer-loop.md`
- `docs/operations.md`
- `docs/repo-demo-scenarios.md`
