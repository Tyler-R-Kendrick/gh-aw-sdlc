---
name: Run Project
description: Builds and tests the OctoCAT Supply Chain project directly, reporting results without opening PRs or delegating
on:
  workflow_dispatch:
permissions:
  contents: read
engine:
  id: copilot
  env:
    COPILOT_EXP_COPILOT_CLI_MCP_ALLOWLIST: "false"
strict: false
tools:
  bash:
    - "npm:*"
safe-outputs:
  noop:
timeout-minutes: 15
---

# Run Project

Build and validate the OctoCAT Supply Chain Management project directly.

## Instructions

1. Run `npm run build` to build both the API and frontend components.
2. Run `npm run test:api` to validate the API passes all tests.
3. If both commands succeed, call `noop` with a success message confirming the project builds and tests pass.
4. If any command fails, call `noop` with the failure details and error output so the caller can review what went wrong.

Do not open pull requests, create issues, or delegate to other agents. Report all results directly via `noop`.
