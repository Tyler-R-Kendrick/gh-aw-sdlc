---
name: Issue Triage
description: Triages incoming issues into backlog-ready labels, comments, and routing signals for the demo SDLC
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
  version: 1.0.10
  env:
    COPILOT_EXP_COPILOT_CLI_MCP_ALLOWLIST: "false"
strict: true
tools:
  github:
    toolsets: [issues, repos]
  bash:
    - "jq *"
safe-outputs:
  add-labels:
    max: 10
    allowed: [bug, feature, security, technical-debt, docs, architecture, needs-triage, candidate-agent-work, human-review]
  add-comment:
    max: 3
    hide-older-comments: true
  noop:
timeout-minutes: 15
---

# Issue Triage Agent

## Workflow Metadata
- Source Example: gh-aw auto-triage-issues
- Classification: Adopt with light adaptation
- Rationale: Reuses the upstream issue auto-triage pattern, but maps issues to this demo repo's backlog taxonomy and coding-agent handoff labels.
- Trigger: issue opened, issue edited, scheduled backfill, manual dispatch
- Primary Outputs: labels, triage comment, routing summary
- SDLC Stage: intake / backlog entry
- Loop Placement: outer
- Signal Source: GitHub issues

## Objective
Convert raw issue intake into backlog-ready signals without hiding human ownership.

## Instructions
1. Determine whether the run was triggered by a single issue event or a scheduled/manual backlog sweep.
2. Classify each issue using this repo taxonomy:
   - `bug`
   - `feature`
   - `security`
   - `technical-debt`
   - `docs`
   - `architecture`
3. Add `candidate-agent-work` when the issue is scoped enough for a coding agent to implement safely. Add `human-review` when the issue requests policy, architecture, staffing, or ambiguous product decisions.
4. Add `needs-triage` when the issue is unclear or spans multiple categories.
5. Post a concise triage comment when the issue is newly opened or materially re-scoped. The comment must state:
   - what signal triggered the workflow,
   - what category labels were chosen,
   - whether the next best step is coding-agent work or human review.
6. During scheduled/manual runs, process only unlabeled or weakly labeled issues and leave already-triaged issues untouched.
7. Never close issues, never assign milestones automatically, and never remove labels added by humans unless they are clearly wrong and the reason is stated in the comment.
8. Use the provided GitHub MCP and safe-output tools directly; do not rely on shell commands, network fetches, sub-agents, or skills for issue reads or workflow outputs.
9. If no action is needed, call `noop` and explain why.
