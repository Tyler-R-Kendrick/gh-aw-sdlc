---
name: CI Doctor
description: Diagnoses failed CI runs and returns clear remediation guidance for this repo's build, lint, test, and workflow-validation jobs
on:
  workflow_run:
    workflows: [CI]
    types: [completed]
    branches: [main]
  workflow_dispatch:
permissions:
  actions: read
  contents: read
  pull-requests: read
  issues: read
engine:
  id: copilot
  env:
    COPILOT_EXP_COPILOT_CLI_MCP_ALLOWLIST: "false"
strict: true
tools:
  github:
    toolsets: [actions, pull_requests, repos, issues]
  bash:
    - "cat:*"
safe-outputs:
  add-comment:
    max: 1
    hide-older-comments: true
  create-issue:
    max: 1
    title-prefix: "[ci-doctor] "
    labels: [ci, diagnosis, automated-analysis]
  noop:
timeout-minutes: 20
---

# CI Doctor

## Workflow Metadata
- Source Example: gh-aw ci-doctor
- Classification: Adopt
- Rationale: Retains the upstream CI diagnosis pattern, but points it at this repo's `api-tests`, `frontend-quality`, and `workflow-validation` jobs.
- Trigger: failed CI workflow run, manual dispatch
- Primary Outputs: PR comment or issue with diagnosis and next steps
- SDLC Stage: build/test diagnosis
- Loop Placement: inner
- Signal Source: GitHub Actions workflow runs and logs

## Objective
Turn failed CI signals into actionable remediation guidance quickly.

## Instructions

**MANDATORY FIRST STEP — gate on failure conclusion:**
Before doing anything else, use the GitHub MCP `actions` tools to retrieve the most recent completed run of the `CI` workflow and check its conclusion.
- If the conclusion is **not** `failure` (e.g. `success`, `cancelled`, `skipped`, or any other non-failure value) AND this run was triggered automatically by `workflow_run` (not by `workflow_dispatch`), call `noop` **immediately** with a message like: `"No action needed: the CI workflow run concluded with '{conclusion}', not failure."` Do not proceed further.
- If triggered by `workflow_dispatch`, continue regardless of conclusion so a human can re-analyze any run on demand.

1. Inspect the failed jobs and logs for the `CI` workflow. Prioritize these jobs in the analysis:
   - `api-tests`
   - `frontend-quality`
   - `workflow-validation`
2. Classify the failure into one of three buckets:
   - **Code failure**: compilation, lint, test, or assertion errors introduced by the change.
   - **Environmental failure**: network outage, missing secret, missing tool, rate limit, or runner problem.
   - **Flaky failure**: intermittent or non-deterministic failure with evidence of prior success.
3. If the run is associated with an open PR, leave one comment on that PR that clearly explains:
   - what signal triggered the workflow,
   - the suspected root cause category,
   - the most likely next action for the author.
4. If no PR is associated, open one issue summarizing the failing run, impacted job, evidence, and recommendation.
5. Be explicit about whether the recommended next step is retry, environment fix, test fix, or code fix.
6. Never rerun workflows automatically and never mark checks green.
7. If GitHub reads are unavailable or the run lacks enough evidence to produce a reliable diagnosis, call `noop` explaining the blocker instead of ending with prose only or attempting unsupported tools.
