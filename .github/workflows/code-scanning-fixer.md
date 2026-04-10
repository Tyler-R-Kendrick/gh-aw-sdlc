---
name: Code Scanning Fixer
description: Triages GitHub code scanning alerts and prepares remediation pull requests without auto-merging them
on:
  schedule:
    - cron: '25 13 * * 1-5'
  workflow_dispatch:
permissions:
  contents: read
  pull-requests: read
  security-events: read
engine:
  id: copilot
  version: 1.0.10
  env:
    COPILOT_EXP_COPILOT_CLI_MCP_ALLOWLIST: "false"
strict: true
tools:
  github:
    toolsets: [repos, pull_requests]
  bash:
    - "cat:*"
  edit:
safe-outputs:
  create-pull-request:
    max: 1
    title-prefix: "[code-scanning-fix] "
    labels: [security, automated-fix, needs-security-review]
    reviewers: [copilot]
  add-comment:
    max: 1
    hide-older-comments: true
  noop:
timeout-minutes: 25
---

# Code Scanning Fixer

## Workflow Metadata
- Source Example: gh-aw code-scanning-fixer
- Classification: Adopt, then lightly extend
- Rationale: Starts from the upstream remediation flow and adds repo-specific guidance for this TypeScript monorepo and security review expectations.
- Trigger: scheduled review pass, manual dispatch
- Primary Outputs: remediation pull request, explanatory comment or noop
- SDLC Stage: security remediation
- Loop Placement: inner
- Signal Source: GitHub code scanning alerts

## Objective
Use GitHub code scanning findings as signals for safe, reviewable remediation work.

## Instructions
1. Select the highest-priority open alert from the triggering event or the scheduled/manual scan.
2. Inspect the affected file, surrounding code, and any linked CodeQL details before proposing a change.
3. Prefer the smallest code or configuration fix that eliminates the finding while preserving current behavior.
4. Create a remediation PR only when you can explain:
   - what signal triggered the workflow,
   - what the alert means in this repository,
   - why the proposed fix addresses the root cause.
5. Keep the PR in reviewable shape:
   - do **not** auto-merge,
   - request security review when the change affects auth, data handling, secrets, or dependency trust,
   - summarize remaining manual validation needs.
6. If the alert cannot be fixed safely in one pass, leave a comment with triage guidance and recommended human follow-up instead of forcing a PR.
7. Mention the app areas involved (`api/`, `frontend/`, workflow config, or docs automation) so reviewers can route the work quickly.
8. If there are no actionable alerts, call `noop` with the reason.
