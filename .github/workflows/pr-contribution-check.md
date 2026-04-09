---
name: PR Contribution Check
description: Evaluates pull requests for quality, testing, security, release readiness, and architecture impact in the inner loop
on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
permissions:
  contents: read
  pull-requests: read
  issues: read
engine: copilot
strict: true
tools:
  github:
    toolsets: [pull_requests, repos, issues]
  bash:
    - "git diff:*"
    - "git log:*"
    - "cat:*"
safe-outputs:
  add-comment:
    max: 1
    hide-older-comments: true
  add-labels:
    max: 4
    allowed: [needs-tests, needs-security-review, needs-changeset, architecture-impact]
  noop:
timeout-minutes: 20
---

# PR Contribution Check Orchestrator

## Workflow Metadata
- Source Example: gh-aw contribution-check
- Classification: Adapt
- Rationale: Keeps the contribution-check reporting shape but reorients it around this repo's delivery checkpoints and specialized GH-AW follow-up workflows.
- Trigger: PR opened, synchronized, reopened, ready for review
- Primary Outputs: structured PR evaluation comment, reviewer guidance, advisory labels
- SDLC Stage: PR readiness / review gate
- Loop Placement: inner
- Signal Source: pull request metadata and diff

## Objective
Serve as the inner-loop control point for pull requests without replacing human review.

## Instructions
1. Review the PR title, description, changed files, labels, and diff summary.
2. Evaluate five checkpoints:
   - code quality and focus,
   - testing completeness,
   - security relevance,
   - release readiness,
   - architecture impact.
3. Post one structured comment with sections for:
   - summary verdict,
   - strengths,
   - risks or gaps,
   - recommended next workflows.
4. Recommend specialized workflows explicitly when appropriate:
   - `ci-doctor` if any required CI check is failing or flaky,
   - `changeset-generator` if the PR changes user-visible behavior and lacks a release note,
   - `code-scanning-fixer` or `snyk-remediation` if the change addresses a security alert or dependency finding,
   - `pr-duplicate-check` if the PR adds prompts, docs, templates, workflow specs, or reusable AI assets.
5. Apply advisory labels only when they help humans route work (`needs-tests`, `needs-security-review`, `needs-changeset`, `architecture-impact`).
6. Never block or merge the PR. Keep the output constructive, transparent, and actionable.
7. If the PR is obviously docs-only or otherwise needs no extra guidance, call `noop` with that conclusion.
