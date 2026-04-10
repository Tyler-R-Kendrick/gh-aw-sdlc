---
name: Barebones AW Claude
description: Minimal manual workflow to validate gh-aw setup with claude engine
on:
  issues:
    types: [opened]
  workflow_dispatch:
permissions:
  contents: read
engine:
  id: claude
safe-outputs:
  noop:
timeout-minutes: 5
---

# Barebones Agentic Workflow (Claude)

When this workflow runs, call `noop` with a short message confirming the run is healthy.