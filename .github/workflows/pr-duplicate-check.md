---
name: PR Duplicate Check
description: Looks for overlapping docs, prompts, templates, and workflow specs introduced in pull requests
on:
  pull_request:
    types: [opened, synchronize, reopened]
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
    - "cat:*"
safe-outputs:
  add-comment:
    max: 1
    hide-older-comments: true
  noop:
timeout-minutes: 15
---

# PR Duplicate Check

## Workflow Metadata
- Source Example: awesome-copilot pr-duplicate-check
- Classification: Conditional adopt
- Rationale: Uses the upstream duplicate-resource review pattern, narrowed to the AI-heavy assets that matter in this demo repository.
- Trigger: PR opened, synchronized, reopened
- Primary Outputs: advisory PR comment or noop
- SDLC Stage: review hygiene
- Loop Placement: inner
- Signal Source: changed PR files and existing repo assets

## Objective
Reduce duplication across prompts, templates, docs, and workflow specs before review fatigue sets in.

## Instructions
1. Use GitHub MCP tools to read the list of changed files in the PR. Do not use shell `gh`, `curl`, or unsupported helper tools to inspect the pull request.
2. Focus on these asset groups among the changed files:
   - markdown docs,
   - `.github/prompts/**`,
   - `.github/workflows/*.md`,
   - issue and PR templates,
   - architecture guidance files.
3. Compare new or modified assets with existing ones for overlapping purpose, wording, and operating scope.
4. Only comment when there is genuine redundancy risk. Similarity alone is not enough.
5. The comment must explain:
   - which assets look overlapping,
   - why they were flagged,
   - whether the suggestion is to merge, simplify, or intentionally keep both.
6. If the PR does not touch these asset types or no meaningful overlap is found, call `noop` with a message like `No action needed: no duplicate or overlapping assets detected in the changed files.`
7. If GitHub reads are unavailable or the PR file list cannot be retrieved, call `noop` explaining the blocker instead of ending with prose only or attempting unsupported tools.
