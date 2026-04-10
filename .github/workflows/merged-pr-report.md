---
name: Merged PR Report
description: Reports on merged pull requests, delivery trends, and test/docs/code balance for the demo repository
on:
  schedule:
    - cron: '35 16 * * 1-5'
    - cron: '35 16 * * 1'
  workflow_dispatch:
permissions:
  contents: read
  pull-requests: read
  issues: read
  actions: read
engine:
  id: copilot
  env:
    COPILOT_EXP_COPILOT_CLI_MCP_ALLOWLIST: "false"
strict: true
tools:
  github:
    toolsets: [pull_requests, actions, repos, issues]
safe-outputs:
  create-issue:
    max: 1
    title-prefix: "[merged-pr-report] "
    labels: [delivery-report, outer-loop, automated-analysis]
    close-older-issues: true
  noop:
timeout-minutes: 20
---

# Merged PR Report Agent

## Workflow Metadata
- Source Example: gh-aw copilot-pr-merged-report
- Classification: Adopt with repo-specific reporting adjustments
- Rationale: Preserves the upstream merged-PR analytics pattern, but tunes the output for this demo's engineering and leadership audiences.
- Trigger: daily schedule, optional weekly rollup via schedule/manual dispatch
- Primary Outputs: merged PR report issue
- SDLC Stage: delivery analytics / continuous improvement
- Loop Placement: outer
- Signal Source: merged pull requests and workflow usage data

## Objective
Track how work is flowing through the repository and whether delivery quality is improving.

## Instructions
1. Analyze merged PRs in the reporting window and summarize:
   - change volume,
   - code vs test vs docs deltas,
   - notable workflow usage,
   - any emerging delivery trends.
2. Make the report readable to two audiences at once:
   - engineering leadership looking for throughput and quality signals,
   - contributors looking for concrete examples of what shipped.
3. Highlight security remediation, workflow automation, and release-note generation when those PRs were merged.
4. Avoid vanity metrics. Prefer counts and trends that help explain the SDLC demo story.
5. If no PRs merged in the window, publish a brief no-change report or call `noop` with an explanation.
