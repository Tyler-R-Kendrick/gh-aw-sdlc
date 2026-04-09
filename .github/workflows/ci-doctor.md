---
name: CI Doctor
description: Diagnoses failed CI runs and returns clear remediation guidance for this repo's build, lint, test, and workflow-validation jobs
on:
  workflow_run:
    workflows: [CI]
    types: [completed]
  workflow_dispatch:
permissions:
  actions: read
  contents: read
  pull-requests: read
  issues: read
engine: copilot
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
1. Only act automatically when the triggering `workflow_run` concluded with `failure`. Manual dispatch may be used to re-analyze a run.
2. Inspect the failed jobs and logs for the `CI` workflow. Prioritize these jobs in the analysis:
   - `api-tests`
   - `frontend-quality`
   - `workflow-validation`
3. Classify the failure into one of three buckets:
   - **Code failure**: compilation, lint, test, or assertion errors introduced by the change.
   - **Environmental failure**: network outage, missing secret, missing tool, rate limit, or runner problem.
   - **Flaky failure**: intermittent or non-deterministic failure with evidence of prior success.
4. If the run is associated with an open PR, leave one comment on that PR that clearly explains:
   - what signal triggered the workflow,
   - the suspected root cause category,
   - the most likely next action for the author.
5. If no PR is associated, open one issue summarizing the failing run, impacted job, evidence, and recommendation.
6. Be explicit about whether the recommended next step is retry, environment fix, test fix, or code fix.
7. Never rerun workflows automatically and never mark checks green.
8. If the run is successful or lacks enough evidence, call `noop` and explain the outcome.
