---
name: Issue Triage
description: Triages incoming issues with labels
on:
  issues:
    types: [opened, edited]
  schedule:
    - cron: '17 */6 * * *'
  workflow_dispatch:
permissions:
  contents: read
  issues: read
engine:
  id: copilot
  env:
    COPILOT_EXP_COPILOT_CLI_MCP_ALLOWLIST: "false"
features:
  copilot-requests: true
strict: true
tools:
  github:
    toolsets: [issues]
safe-outputs:
  add-labels:
  noop:
timeout-minutes: 15
---

# Issue Triage

Read each open issue and apply the appropriate label from: `bug`, `feature`, `security`, `technical-debt`, `docs`, `architecture`, `needs-triage`, `candidate-agent-work`, `human-review`.

Use GitHub MCP tools to read issues. If no issues need triage, call `noop`.
