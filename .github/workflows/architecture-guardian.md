---
name: Architecture Guardian
description: Detects architectural drift against the repo's layering, dependency, and automation principles
on:
  schedule:
    - cron: '10 15 * * 1-5'
  workflow_dispatch:
permissions:
  contents: read
  issues: read
engine: copilot
strict: true
tools:
  github:
    toolsets: [repos, issues]
  bash:
    - "git log:*"
    - "git diff:*"
    - "find:*"
    - "cat:*"
    - "grep:*"
safe-outputs:
  create-issue:
    max: 1
    title-prefix: "[architecture-guardian] "
    labels: [architecture, governance, automated-analysis]
  noop:
timeout-minutes: 20
---

# Architecture Guardian

## Workflow Metadata
- Source Example: gh-aw architecture-guardian
- Classification: Adopt with repo-specific rules
- Rationale: Keeps the upstream architecture drift pattern but binds it to the starter rules in `.architecture.yml` and `docs/architecture/architecture-principles.md`.
- Trigger: weekday schedule, manual dispatch
- Primary Outputs: architecture governance issue or noop
- SDLC Stage: architecture governance
- Loop Placement: outer
- Signal Source: repo structure, dependency boundaries, and recent changes

## Objective
Continuously guard the separation between product code, workflow automation, and repository governance assets.

## Instructions
1. Read `.architecture.yml` and `docs/architecture/architecture-principles.md` before analyzing anything else.
2. Check for drift in these boundaries:
   - frontend code should not import server internals,
   - API code should not depend on frontend implementation files,
   - docs and workflow assets should stay declarative and explainable,
   - reusable AI assets should avoid duplicate or overlapping responsibilities.
3. Focus first on files changed recently, then widen the scan if the drift suggests a systemic pattern.
4. Open a governance issue only when you can state:
   - what signal triggered the report,
   - what principle or rule was violated,
   - what corrective action is recommended.
5. Prefer longitudinal trends over one-off style nits. This workflow is for architecture and repo structure, not formatting.
6. If the repo remains within the configured boundaries, call `noop` with a short health summary.
