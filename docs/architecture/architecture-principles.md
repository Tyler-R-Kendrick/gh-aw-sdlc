# Architecture Principles

1. **Clear loop separation** — delivery acceleration lives in inner-loop workflows; governance and reporting live in outer-loop workflows.
2. **Signal-source first** — Dependabot, Snyk, code scanning, and CI remain the systems of record for raw findings.
3. **Safe outputs by default** — workflows should prefer labels, comments, issues, draft PRs, and changesets over hidden side effects.
4. **Explicit contracts** — API schema, runtime configuration, release metadata, and workflow instructions are treated as versioned contracts.
5. **Boundary preservation** — frontend code should not import backend implementation details, and backend code should not depend on frontend files.
6. **Transparent provenance** — every workflow should say whether it is adopted, adapted, or custom and what upstream example informed it.
