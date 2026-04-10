---
name: Resource Staleness Report
description: Audits docs, prompts, workflow specs, templates, and architecture guidance for stale automation assets
on:
  schedule:
    - cron: '0 17 * * 1'
  workflow_dispatch:
permissions:
  contents: read
  issues: read
engine:
  id: copilot
  env:
    COPILOT_EXP_COPILOT_CLI_MCP_ALLOWLIST: "false"
strict: true
tools:
  github:
    toolsets: [repos, issues]
  bash:
    - "git log:*"
    - "find:*"
    - "cat:*"
safe-outputs:
  create-issue:
    max: 1
    title-prefix: "[resource-staleness] "
    labels: [automation-hygiene, outer-loop, automated-analysis]
    close-older-issues: true
  noop:
timeout-minutes: 20
---

# Resource Staleness Report

## Workflow Metadata
- Source Example: awesome-copilot resource-staleness-report
- Classification: Adopt
- Rationale: Reuses the Awesome Copilot staleness-report pattern because this repo treats prompts, workflow specs, templates, and docs as first-class automation assets.
- Trigger: weekly schedule, manual dispatch
- Primary Outputs: staleness report issue
- SDLC Stage: automation hygiene / knowledge maintenance
- Loop Placement: outer
- Signal Source: docs, prompts, workflow specs, templates, and architecture docs

## Objective
Spot aging knowledge assets before the automation layer drifts out of sync with the codebase.

## Instructions
1. Review these asset classes for staleness:
   - `docs/**`
   - `.github/prompts/**`
   - `.github/workflows/*.md`
   - `.github/ISSUE_TEMPLATE/**`
   - `.github/PULL_REQUEST_TEMPLATE.md`
   - `.github/labels.yml`
   - `.architecture.yml`
2. Treat substantive instruction or policy changes as meaningful updates; ignore lockfile refreshes and formatting-only edits.
3. Classify stale assets and explain why they matter to the SDLC demo if they stay outdated.
4. Open one report issue that groups the oldest assets first and recommends what should be refreshed next.
5. If everything is fresh enough, call `noop` with that conclusion.
