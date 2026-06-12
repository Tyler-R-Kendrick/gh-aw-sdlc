# SDLC Agent Map

| Workflow | Source | Adopt / Adapt / Custom | Trigger | Primary Output | SDLC Stage | Inner / Outer Loop | Signal Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| issue-triage | gh-aw auto-triage-issues | Adopt with light adaptation | issue opened / edited / scheduled backfill | labels and triage comment | intake | outer | GitHub issues |
| pr-contribution-check | gh-aw contribution-check | Adapt | PR opened / updated / ready for review | PR evaluation comment | review gate | inner | pull request |
| ci-doctor | gh-aw ci-doctor | Adopt | failed `CI` workflow run / manual dispatch | diagnosis comment or issue | build/test | inner | GitHub Actions |
| code-scanning-fixer | gh-aw code-scanning-fixer | Adopt, then lightly extend | scheduled scan / manual dispatch | remediation PR or comment | security remediation | inner | GitHub code scanning |
| snyk-remediation | derivative of gh-aw code-scanning-fixer | Custom | Snyk issue event / schedule / manual dispatch | draft remediation PR or triage comment | security remediation | inner | Snyk |
| breaking-change-checker | gh-aw breaking-change-checker | Adopt with policy adaptation | sensitive-path PR / schedule / manual dispatch | compatibility report | release risk | inner + outer | commits / PRs / changesets |
| architecture-guardian | gh-aw architecture-guardian | Adopt with repo-specific rules | weekday schedule / manual dispatch | architecture governance issue | governance | outer | repo structure |
| changeset-generator | gh-aw changeset | Adopt | PR labeled for release notes / manual dispatch | `.changeset/**` file and PR note | release prep | inner | PR metadata |
| daily-repo-status | GH-AW quick start pattern | Adapt | daily schedule | repo status issue | operations | outer | repo activity |
| merged-pr-report | gh-aw copilot-pr-merged-report | Adopt with repo-specific reporting adjustments | daily / weekly schedule | merged PR report issue | analytics | outer | merged PRs |
| resource-staleness-report | awesome-copilot resource-staleness-report | Adopt | weekly schedule / manual dispatch | staleness issue | automation hygiene | outer | docs / prompts / templates / workflow specs |
| pr-duplicate-check | awesome-copilot pr-duplicate-check | Conditional adopt | PR opened / updated | duplication advisory comment | review hygiene | inner | PR files |
| daily-accessibility-review | githubnext/agentics | Adapt | daily schedule / manual dispatch | accessibility finding issues (up to 5) or noop | quality / accessibility compliance | inner | repository source code, WCAG 2.2 guidelines |
| daily-security-owasp-review | gh-aw code-scanning-fixer (extended) | Extend | weekday schedule / manual dispatch | remediation PR, security finding issues, or noop | security review | inner | repository source code, GitHub code scanning, npm audit, OWASP Top 10 |
| feature-request-generator | custom (outer-loop pattern) | Custom | weekly (Monday) / manual dispatch | feature request issues assigned to Copilot (up to 5) or noop | product discovery / backlog generation | outer | codebase analysis, open issues, closed PRs, README gaps, user-facing docs |
| daily-doc-updater | custom (daily documentation pattern) | Custom | daily schedule / manual dispatch | documentation update PR or noop | documentation maintenance | outer | merged PRs, code changes from last 24 hours |
| barebones-aw | custom (validation workflow) | Custom | issue opened / manual dispatch | health confirmation noop | workflow validation | n/a | workflow metadata validation |
