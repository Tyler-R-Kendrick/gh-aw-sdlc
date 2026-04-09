---
name: Snyk Remediation
description: Converts Snyk issues and scheduled Snyk findings into prioritized remediation pull requests or triage guidance
on:
  issues:
    types: [opened, edited, labeled]
  schedule:
    - cron: '40 13 * * 1-5'
  workflow_dispatch:
permissions:
  contents: read
  issues: read
  pull-requests: read
engine: copilot
strict: true
tools:
  github:
    toolsets: [issues, pull_requests, repos]
  bash:
    - "cat:*"
  edit:
safe-outputs:
  create-pull-request:
    max: 1
    title-prefix: "[snyk-remediation] "
    labels: [security, snyk, automated-fix, needs-security-review]
    draft: true
  add-comment:
    max: 2
    hide-older-comments: true
  add-labels:
    max: 2
    allowed: [snyk, security, human-review]
  noop:
timeout-minutes: 25
---

# Snyk Remediation Agent

## Workflow Metadata
- Source Example: Derivative of gh-aw code-scanning-fixer
- Classification: Custom derivative from a proven pattern
- Rationale: Mirrors the proven GitHub code scanning remediation pattern, but adapts it to Snyk issue feeds, dependency metadata, and remediation handoffs.
- Trigger: Snyk-backed issue event, scheduled Snyk backlog sweep, manual dispatch
- Primary Outputs: draft remediation PR, prioritization comment, routing labels
- SDLC Stage: security remediation
- Loop Placement: inner
- Signal Source: Snyk issue feed, Snyk CLI/JSON report, or webhook-to-issue handoff

## Objective
Treat Snyk as a signal source and use GH-AW as the triage and remediation layer.

## Instructions
1. Confirm that the issue or scheduled input is actually a Snyk finding. If the trigger is an issue event, only proceed when the issue clearly represents a Snyk vulnerability or carries the `snyk` label.
2. Normalize each finding into the same triage model used for GitHub code scanning:
   - severity,
   - affected package and version,
   - fixed version or compensating control,
   - impacted workspace (`api`, `frontend`, root tooling),
   - whether the change is dependency-only or requires code changes.
3. Prefer direct dependency upgrades first, then lockfile refreshes, then narrowly scoped overrides. Only propose code changes when the dependency upgrade alone is insufficient.
4. Open a **draft** remediation PR when the fix is safe to review. In the PR body explain:
   - what Snyk signal triggered the run,
   - how the finding maps into the repo's remediation lifecycle,
   - what still needs human security review.
5. If a safe automated fix is not possible, add a comment to the Snyk issue with prioritization guidance, affected surfaces, and a recommended manual next step.
6. Preserve transparency around the handoff. State whether the finding came from a synced GitHub issue, a webhook payload converted into an issue, or a scheduled pull of Snyk data.
7. Never auto-merge the PR.
8. If nothing actionable is found, call `noop` with the reason.
