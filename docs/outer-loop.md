# Outer Loop

The outer loop covers the workflows that keep the repository healthy, explainable, and governable over time.

## Workflows in the outer loop
- `issue-triage`
- `architecture-guardian`
- `breaking-change-checker` (scheduled governance mode)
- `daily-repo-status`
- `merged-pr-report`
- `resource-staleness-report`
- `feature-request-generator`
- `daily-doc-updater`

## How they support governance and planning
- `issue-triage` turns raw demand into backlog-ready labels and routing signals.
- `architecture-guardian` checks for drift against declared repo boundaries and principles.
- `breaking-change-checker` watches recent changes for compatibility risk that could affect roadmap or release planning.
- `daily-repo-status` gives maintainers one operational summary across backlog, CI, security, and release activity.
- `merged-pr-report` shows delivery trends and quality signals.
- `resource-staleness-report` keeps prompts, templates, workflow specs, and architecture docs current.
- `feature-request-generator` identifies missing features and improvement opportunities from codebase analysis and user needs.
- `daily-doc-updater` ensures documentation stays synchronized with recent code changes and merged PRs.

## How they surface system-level signals
The outer loop does not try to write product code. It creates issues, comments, and reports that help maintainers make prioritization, governance, and architecture decisions with current data.
