---
name: PR Duplicate Check
description: Looks for overlapping docs, prompts, templates, and workflow specs introduced in pull requests
on:
  pull_request:
    types: [opened, synchronize, reopened]
permissions:
  contents: read
  pull-requests: read
engine: copilot
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
1. Inspect changed files in the PR and focus on these asset groups:
   - markdown docs,
   - `.github/prompts/**`,
   - `.github/workflows/*.md`,
   - issue and PR templates,
   - architecture guidance files.
2. Compare new or modified assets with existing ones for overlapping purpose, wording, and operating scope.
3. Only comment when there is genuine redundancy risk. Similarity alone is not enough.
4. The comment must explain:
   - which assets look overlapping,
   - why they were flagged,
   - whether the suggestion is to merge, simplify, or intentionally keep both.
5. If the PR does not touch these asset types or no meaningful overlap is found, call `noop`.
