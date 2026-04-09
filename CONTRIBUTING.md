# Contributing

## Purpose of this repository
This repository is a demo artifact for an AI-driven SDLC implemented with GitHub Agentic Workflows. Keep contributions explainable and demo-friendly.

## Before opening a PR
1. File or update an issue when the work changes backlog intent.
2. Use the issue labels and templates so `issue-triage` can classify the work correctly.
3. Keep changes focused on one SDLC checkpoint or one product concern at a time.

## Pull request expectations
- Use the PR template.
- Call out whether the change affects the inner loop, outer loop, or both.
- Add the `release-note` or `changeset` label when the change is user-visible.
- Flag security-sensitive or architecture-sensitive changes explicitly.

## Validation
Run the relevant commands before asking for review:
```bash
npm run build
npm run lint
npm run test:api
npm run test:workflows
```

## Workflow authoring rules
- Author GH-AW workflows in markdown under `.github/workflows/`.
- Recompile lock files with `gh aw compile` whenever workflow frontmatter changes.
- Preserve the provenance metadata in every workflow file: source example, classification, trigger, outputs, SDLC stage, loop placement, and signal source.
- Prefer safe outputs such as labels, comments, issues, draft PRs, and changesets.

## Security and governance
- Do not auto-merge remediation PRs.
- Treat Dependabot, Snyk, code scanning, and CI as signal sources, not replacements.
- Keep `.architecture.yml` and `docs/architecture/architecture-principles.md` aligned with any governance changes.
