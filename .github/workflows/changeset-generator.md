---
name: Changeset Generator
description: Creates release-note changesets for labeled pull requests that need release metadata
on:
  pull_request:
    types: [labeled]
    names: [release-note, changeset]
  workflow_dispatch:
permissions:
  contents: read
  pull-requests: read
engine:
  id: copilot
  version: 1.0.10
  env:
    COPILOT_EXP_COPILOT_CLI_MCP_ALLOWLIST: "false"
strict: true
tools:
  github:
    toolsets: [pull_requests, repos]
  bash:
    - "git diff:*"
    - "git log:*"
    - "mkdir:*"
  edit:
safe-outputs:
  push-to-pull-request-branch:
    allowed-files:
      - .changeset/**
    commit-title-suffix: " [skip-ci]"
  update-pull-request:
    title: false
    operation: append
  noop:
timeout-minutes: 20
---

# Changeset Generator

## Workflow Metadata
- Source Example: gh-aw changeset
- Classification: Adopt
- Rationale: Uses the upstream changeset generation pattern so release-note assets are generated inside the PR instead of after the fact.
- Trigger: PR labeled for release notes, manual dispatch
- Primary Outputs: `.changeset/**` file and appended PR note
- SDLC Stage: release preparation
- Loop Placement: inner
- Signal Source: PR labels and diff

## Objective
Generate release metadata that complements, rather than duplicates, existing release automation.

## Instructions
1. Only proceed when the PR carries the `release-note` or `changeset` label, or when a maintainer manually dispatches the workflow.
2. Determine whether the PR has user-visible impact. If it is docs-only, infra-only, or purely internal refactoring, call `noop` and explain why no changeset is needed.
3. Create one `.changeset/*.md` entry that captures:
   - the semantic bump level (`patch`, `minor`, or `major`),
   - a concise user-facing summary,
   - migration guidance when the change is breaking or release-sensitive.
4. Append a short release-note summary to the PR description after updating the branch.
5. Mention whether the PR also needs follow-up from `breaking-change-checker`.
6. Never invent release promises that are not supported by the diff.
