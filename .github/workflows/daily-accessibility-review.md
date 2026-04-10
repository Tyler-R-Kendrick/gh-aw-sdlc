---
name: Daily Accessibility Review
description: Automatically reviews the web application for WCAG 2.2 accessibility compliance and creates issues with findings and remediation recommendations
on:
  schedule: daily
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

network:
  allowed:
  - defaults

tools:
  github:
    toolsets: [default, issues]
  bash: true

safe-outputs:
  create-issue:
    max: 5
    title-prefix: "[a11y] "
    labels: [accessibility, automated-analysis]
  add-comment:
    max: 5
    hide-older-comments: true
  noop:

timeout-minutes: 15

---

# Daily Accessibility Review

## Workflow Metadata
- Source Example: githubnext/agentics/daily-accessibility-review
- Classification: Adapt
- Rationale: Adapted from the upstream accessibility review pattern; uses bash tooling in place of Playwright since this repo does not run a live web server in CI, and reports findings as GitHub issues rather than discussions.
- Trigger: daily schedule, manual dispatch
- Primary Outputs: accessibility finding issues (up to 5) or noop
- SDLC Stage: quality / accessibility compliance
- Loop Placement: inner
- Signal Source: repository source code, WCAG 2.2 guidelines

## Objective

Review the repository's web application code for accessibility problems against the Web Content Accessibility Guidelines (WCAG) 2.2 and report findings as actionable GitHub issues.

## Instructions

Our team uses the Web Content Accessibility Guidelines (WCAG) 2.2. You may refer to https://www.w3.org/TR/WCAG22/ for reference.

### 1. Explore Application Code

Use bash to locate the frontend/UI source code:

```bash
# Find UI source files
find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" -o -name "*.html" -o -name "*.css" \) \
  ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/dist/*" ! -path "*/build/*" | head -40

# Check for frontend directory
ls -la frontend/ 2>/dev/null || ls -la src/ 2>/dev/null || echo "Checking root..."
```

### 2. Review Code for Accessibility Issues

Examine identified source files for the following WCAG 2.2 categories:

- **Perceivable**
  - Missing `alt` attributes on images
  - Insufficient color contrast (check CSS/Tailwind classes)
  - Missing captions or transcripts for media
  - Content that only conveys information through color

- **Operable**
  - Interactive elements not keyboard accessible (missing `tabIndex`, `onKeyDown` handlers)
  - Missing focus indicators (`:focus` styles overridden without replacement)
  - Insufficient click/touch target sizes (< 44×44px)
  - Missing skip navigation links

- **Understandable**
  - Missing or incorrect `lang` attribute on `<html>`
  - Form inputs without associated `<label>` elements
  - Error messages that don't identify the field in error
  - Unclear link text (e.g., "click here", "read more")

- **Robust**
  - Missing ARIA roles, labels, or descriptions on custom components
  - Invalid ARIA usage (role conflicts, missing required children)
  - Components that don't work with assistive technologies

```bash
# Search for common accessibility issues
grep -rn 'img' --include="*.tsx" --include="*.jsx" --include="*.html" . \
  ! -path "*/node_modules/*" | grep -v 'alt=' | head -20

grep -rn '<button\|<a ' --include="*.tsx" --include="*.jsx" --include="*.html" . \
  ! -path "*/node_modules/*" | head -20
```

### 3. Create Issues for Findings

For each accessibility problem found, create a GitHub issue using the `create-issue` safe output. Each issue must include:

- A clear title describing the specific problem (prefixed with `[a11y]` automatically)
- The WCAG 2.2 criterion violated (e.g., "WCAG 1.1.1 Non-text Content")
- The file(s) and line number(s) where the issue was found
- The relevant code snippet illustrating the problem
- A recommended fix with a corrected code example
- The severity level: **Critical**, **Serious**, **Moderate**, or **Minor**

Prioritize issues by severity — report Critical and Serious issues first, up to the maximum of 5 issues per run.

### 4. Handle Edge Cases

- **No UI code found**: If the repository has no frontend/UI code, call `noop` with an explanation
- **No issues found**: If the code passes accessibility review, call `noop` with a brief health summary
- **Issue already reported**: Check existing open issues with the `[a11y]` prefix before creating duplicates; use `add-comment` to update existing issues with new findings instead
