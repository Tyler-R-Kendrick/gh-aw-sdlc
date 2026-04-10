---
name: Breaking Change Checker
description: Monitors pull requests and recent merges for API, schema, config, and release-contract breaking changes
on:
  pull_request:
    paths:
      - api/**
      - frontend/**
      - package.json
      - package-lock.json
      - .changeset/**
      - .architecture.yml
  schedule:
    - cron: '55 14 * * 1-5'
  workflow_dispatch:
permissions:
  contents: read
  pull-requests: read
  issues: read
engine:
  id: copilot
  version: 1.0.10
  env:
    COPILOT_EXP_COPILOT_CLI_MCP_ALLOWLIST: "false"
strict: true
tools:
  github:
    toolsets: [pull_requests, repos, issues]
  bash:
    - "git diff:*"
    - "git log:*"
    - "cat:*"
safe-outputs:
  add-comment:
    max: 1
    hide-older-comments: true
  create-issue:
    max: 1
    title-prefix: "[breaking-change] "
    labels: [breaking-change, release-risk, automated-analysis]
  noop:
timeout-minutes: 20
---

# Breaking Change Checker

## Workflow Metadata
- Source Example: gh-aw breaking-change-checker
- Classification: Adopt with policy adaptation
- Rationale: Reuses the upstream compatibility-review pattern but defines breaking changes for this web app, its API contract, release metadata, and configuration surfaces.
- Trigger: sensitive-path PR update, scheduled daily audit, manual dispatch
- Primary Outputs: compatibility comment or issue, release-risk summary
- SDLC Stage: compatibility validation / release risk
- Loop Placement: inner + outer
- Signal Source: commits, pull requests, and release metadata

## Objective
Surface compatibility and release risk early enough for teams to react before merge or release.

## Repo-Specific Breaking Change Policy
Treat the following as potentially breaking in this repository:
- removed or renamed API routes, request fields, or response fields in `api/`
- contract changes in `api/api-swagger.json`
- changes to runtime configuration expectations in the frontend
- package script or command changes relied on by contributors or automation
- `.architecture.yml` or release policy changes that materially alter contributor workflows

## Instructions
1. Determine whether the run is PR-scoped or schedule-scoped.
2. Compare current changes against the default branch and look specifically for removed interfaces, renamed fields, changed required configuration, and release-note implications.
3. If the signal is a PR, comment on the PR with:
   - the trigger,
   - the suspected breaking surface,
   - whether a `.changeset/` entry and migration note are required.
4. If the signal is the scheduled audit and a breaking risk is confirmed, open one issue summarizing the affected commits and the recommended mitigation.
5. Distinguish between:
   - likely breaking changes,
   - release-sensitive but backward-compatible changes,
   - non-breaking internal refactors.
6. Reference the release-prep workflow whenever a changeset or migration note is missing.
7. If no compatibility risk is found, call `noop` with that conclusion.
