---
name: Barebones AW
description: Minimal manual workflow to validate gh-aw setup
on:
  issues:
    types: [opened]
  workflow_dispatch:
permissions:
  contents: read
engine:
  id: copilot
  env:
    COPILOT_MODEL: gpt-41-copilot
    COPILOT_EXP_COPILOT_CLI_MCP_ALLOWLIST: "false"
safe-outputs:
  noop:
timeout-minutes: 5
---

# Barebones Agentic Workflow

When this workflow runs, call `noop` with a short message confirming the run is healthy.