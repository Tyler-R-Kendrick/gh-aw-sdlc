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
engine: copilot
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
6. Use GitHub MCP tools for GitHub reads. Do not use shell `gh`, `curl`, or unsupported helper tools to inspect issues.
7. During scheduled/manual runs, process only unlabeled or weakly labeled issues and leave already-triaged issues untouched.
8. If a scheduled/manual run finds no unlabeled or weakly labeled issues, call `noop` with a message like `No action needed: scheduled backlog sweep found no unlabeled or weakly labeled issues.`
9. If GitHub reads are unavailable or the run lacks enough issue data to triage safely, call `noop` explaining the blocker instead of ending with prose only or attempting unsupported tools.
10. Never close issues, never assign milestones automatically, and never remove labels added by humans unless they are clearly wrong and the reason is stated in the comment.
