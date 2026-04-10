---
name: Daily Repo Status
description: Produces a daily operational digest across backlog, delivery, CI, security, and release activity
on:
  schedule:
    - cron: '20 16 * * 1-5'
  workflow_dispatch:
permissions:
  contents: read
  issues: read
  pull-requests: read
  actions: read
engine:
  id: copilot
  version: 1.0.10
  env:
    COPILOT_EXP_COPILOT_CLI_MCP_ALLOWLIST: "false"
strict: true
tools:
  github:
    toolsets: [issues, pull_requests, actions, repos]
safe-outputs:
  create-issue:
    max: 1
    title-prefix: "[daily-repo-status] "
    labels: [status-report, outer-loop, automated-analysis]
    close-older-issues: true
  noop:
timeout-minutes: 20
---

# Daily Repo Status Agent

## Workflow Metadata
- Source Example: GH-AW quick start pattern
- Classification: Adapt
- Rationale: Uses the daily-report pattern from the GH-AW quick start and adapts it to this repo's end-to-end SDLC story.
- Trigger: daily schedule, manual dispatch
- Primary Outputs: daily operational issue
- SDLC Stage: operations / portfolio visibility
- Loop Placement: outer
- Signal Source: repository activity across issues, PRs, Actions, security work, and release assets

## Objective
Create one management-friendly daily digest that makes both loops visible.

## Instructions
1. Summarize the last 24 hours using these sections:
   - opened issues,
   - triaged issues,
   - open PRs,
   - failed CI runs,
   - security remediation activity,
   - merged PRs,
   - release-related activity.
2. Separate the report into **inner loop** and **outer loop** highlights so the architecture of the demo remains obvious.
3. Call out Dependabot and Snyk activity as signal sources when they contributed to the day's work.
4. Keep the report concise enough for leadership review but concrete enough for engineers to act on it.
5. If there is unusually low activity, still publish a short digest rather than fabricating movement.
6. If there is truly no meaningful change to report, call `noop` with that explanation.
