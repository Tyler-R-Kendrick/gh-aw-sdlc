---
name: Feature Request Generator
description: Analyzes the repository for missing features, gaps in functionality, and improvement opportunities, then creates GitHub issues as feature requests assigned to Copilot
on:
  schedule:
    - cron: '0 10 * * 1'
  workflow_dispatch:

permissions:
  contents: read
  issues: read
  pull-requests: read

engine:
  id: copilot
  env:
    COPILOT_EXP_COPILOT_CLI_MCP_ALLOWLIST: "false"

strict: true

tools:
  github:
    toolsets: [default, issues, pull_requests, repos]
  bash:
    - "find:*"
    - "cat:*"
    - "grep:*"
    - "git log:*"

safe-outputs:
  create-issue:
    max: 5
    title-prefix: "[feature-request] "
    labels: [enhancement, feature-request, automated-analysis]
    assignees: [copilot]
  noop:

timeout-minutes: 20

---

# Feature Request Generator

## Workflow Metadata
- Source Example: custom (outer-loop pattern)
- Classification: Custom
- Rationale: Provides continuous product improvement by surfacing gaps, missing capabilities, and opportunities identified through codebase analysis, open issues, and comparison with similar projects in the ecosystem.
- Trigger: weekly (Monday), manual dispatch
- Primary Outputs: feature request issues assigned to Copilot (up to 5)
- SDLC Stage: product discovery / backlog generation
- Loop Placement: outer
- Signal Source: codebase analysis, open issues, closed PRs, README gaps, user-facing docs

## Objective

Analyze the repository from a product and developer-experience perspective to identify missing features, capability gaps, and improvement opportunities. Create well-scoped GitHub issues as feature requests and assign them to Copilot for implementation.

## Instructions

### 1. Understand the Repository's Purpose and Current State

Start by reading the core documentation to understand what this project does and who it serves:

```bash
# Read README and main docs
cat README.md 2>/dev/null | head -100
find . -name "*.md" -not -path "*/node_modules/*" -not -path "*/.github/*" | head -20
ls -la docs/ 2>/dev/null || echo "No docs directory"
```

Review the package manifests to understand the tech stack and existing dependencies:

```bash
cat package.json 2>/dev/null
find . -name "package.json" ! -path "*/node_modules/*" | xargs cat 2>/dev/null | head -100
```

### 2. Analyze Open Issues for Patterns

Use GitHub tools to:
- List open issues (especially those labeled `enhancement`, `feature`, `help-wanted`)
- Identify recurring themes or pain points mentioned by users
- Find issues that have been open for a long time without progress
- Look for issues labeled `good-first-issue` that could be bundled into a feature

Search for patterns in issue titles and bodies that reveal user needs not yet addressed.

### 3. Review Recent Merged PRs for Follow-on Opportunities

Use GitHub tools to:
- Search for recently merged PRs from the last 2 weeks
- Identify features that were partially implemented or had TODO comments
- Find PRs that mentioned related features in their description but didn't implement them

```bash
# Look for TODO/FIXME/HACK comments that represent known gaps
grep -rn "TODO\|FIXME\|HACK\|XXX\|NOTE: missing\|not yet implemented\|to be implemented" \
  --include="*.ts" --include="*.js" --include="*.md" \
  ! -path "*/node_modules/*" ! -path "*/.git/*" . | grep -v ".lock." | head -40
```

### 4. Audit Documentation for Gaps

Review documentation to find features that are mentioned but not implemented, or use cases that aren't covered:

```bash
# Find all user-facing docs
find . -name "*.md" ! -path "*/node_modules/*" ! -path "*/.github/workflows/*" | head -20

# Look for placeholder content
grep -rn "coming soon\|TBD\|WIP\|placeholder\|TODO\|not yet" \
  --include="*.md" ! -path "*/node_modules/*" . | head -20
```

### 5. Identify Missing Features

Evaluate the repository for the following types of gaps:

**Functionality Gaps**
- Core workflows or operations that users would expect but are missing
- Edge cases not handled by existing code
- Integrations with popular tools or services not yet supported

**Developer Experience Gaps**
- Missing tests for critical paths
- Lack of debug or diagnostic tooling
- Missing configuration options that users commonly need
- Incomplete error messages or error handling

**Documentation Gaps**
- Features without documentation
- Missing examples or tutorials
- No contribution guide or it's incomplete
- Missing API reference or it's out of date

**Operational Gaps**
- Missing monitoring, observability, or health check endpoints
- No rate limiting or quota management
- Missing audit logging
- No graceful degradation or circuit breakers

**Automation Gaps**
- Manual processes that could be automated
- Missing CI/CD checks
- No automated dependency updates

### 6. Prioritize and Select Top Features

From your analysis, select the **top 5 highest-value features** to create issues for. Prioritize by:

1. **User Impact**: How many users would benefit?
2. **Feasibility**: Can Copilot implement this without major architectural changes?
3. **Specificity**: Is the feature well-defined enough to implement?
4. **Uniqueness**: Is this not already covered by an open issue?

Avoid:
- Features already tracked in open issues (check with GitHub tools first)
- Vague or overly broad features
- Features requiring external dependencies not yet in the project

### 7. Create Feature Request Issues

For each selected feature, create a GitHub issue using `create-issue`. Each issue must include:

**Title**: Short, descriptive feature name (prefixed with `[feature-request]` automatically)

**Body template**:
```markdown
## Feature Request

### Summary
[One sentence describing what this feature does]

### Motivation
[Why this feature is valuable — what problem it solves or what gap it fills]

### Proposed Implementation
[High-level description of how this could be implemented, including:
- Which files/modules would be affected
- Any new dependencies needed
- Key design decisions]

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### References
- Related issue/PR: #NUMBER (if applicable)
- Source of gap identification: [TODO comment in file:line | issue pattern | doc gap | etc.]

### Notes
[Any additional context, constraints, or considerations]
```

Assign each issue to **Copilot** so it can be picked up for implementation.

### 8. Edge Cases

- **No meaningful gaps found**: Call `noop` with a brief summary of the repository's current completeness
- **All identified features already have open issues**: Call `noop` referencing the existing tracked issues
- **Feature is too large or architectural**: Create the issue anyway, but note in the body that it requires human design review before Copilot implementation
