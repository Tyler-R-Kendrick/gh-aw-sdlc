---
name: Security and OWASP Review
description: Scans the codebase for OWASP Top 10 and common security vulnerabilities, then prepares remediation pull requests or issues
on:
  schedule:
    - cron: '30 14 * * 1-5'
  workflow_dispatch:

permissions:
  contents: read
  issues: read
  pull-requests: read
  security-events: read

engine:
  id: copilot
  env:
    COPILOT_EXP_COPILOT_CLI_MCP_ALLOWLIST: "false"

strict: true

tools:
  github:
    toolsets: [repos, pull_requests, issues]
  bash:
    - "find:*"
    - "cat:*"
    - "grep:*"
    - "git log:*"
    - "git diff:*"
  edit:

safe-outputs:
  create-pull-request:
    max: 1
    title-prefix: "[security] "
    labels: [security, owasp, automated-fix, needs-security-review]
    reviewers: [copilot]
    draft: true
  create-issue:
    max: 3
    title-prefix: "[security] "
    labels: [security, owasp, automated-analysis]
  add-comment:
    max: 1
    hide-older-comments: true
  noop:

timeout-minutes: 30

---

# Security and OWASP Review

## Workflow Metadata
- Source Example: gh-aw code-scanning-fixer (extended)
- Classification: Extend
- Rationale: Extends the upstream code-scanning-fixer pattern with proactive OWASP Top 10 analysis, dependency audits, and secret detection — going beyond reactive alert remediation to active security posture improvement.
- Trigger: weekday schedule, manual dispatch
- Primary Outputs: remediation pull request, security finding issues, or noop
- SDLC Stage: security review
- Loop Placement: inner
- Signal Source: repository source code, GitHub code scanning alerts, npm/dependency audit, OWASP Top 10

## Objective

Proactively identify and remediate security vulnerabilities across the OWASP Top 10 categories and common CWEs in this TypeScript monorepo, producing reviewable remediation artifacts without auto-merging.

## Instructions

### 1. Check GitHub Code Scanning Alerts

Before scanning manually, retrieve any open GitHub code scanning alerts:
- Use the GitHub tools to list open security alerts
- Prioritize alerts rated Critical or High
- Note which alerts are already being tracked to avoid duplicating issues

### 2. Dependency Audit

Run dependency vulnerability scans for all package manifests found:

```bash
# Identify all package.json files (excluding node_modules)
find . -name "package.json" ! -path "*/node_modules/*" | head -10

# Run npm audit for each workspace
npm audit --json 2>/dev/null | head -100 || echo "npm audit not available"

# Check for known vulnerable packages
cat package.json 2>/dev/null | grep -E '"dependencies"|"devDependencies"' -A 50 | head -60
```

### 3. OWASP Top 10 Scan

Scan source code for each OWASP Top 10 category:

**A01 – Broken Access Control**
```bash
grep -rn "req\.user\|isAdmin\|role\|permission\|authorize" \
  --include="*.ts" --include="*.js" ! -path "*/node_modules/*" . | head -30
```

**A02 – Cryptographic Failures**
```bash
# Look for hardcoded secrets, weak algorithms, plain HTTP
grep -rn "password\|secret\|api_key\|apikey\|token\|md5\|sha1\|DES\|http://" \
  --include="*.ts" --include="*.js" --include="*.env*" ! -path "*/node_modules/*" . \
  | grep -v "\.lock\." | grep -v "test\|spec\|mock" | head -30
```

**A03 – Injection**
```bash
# SQL, command, LDAP injection patterns
grep -rn "exec(\|eval(\|query(\|raw(\|\`SELECT\|\`INSERT\|\`UPDATE\|\`DELETE" \
  --include="*.ts" --include="*.js" ! -path "*/node_modules/*" . | head -30
```

**A05 – Security Misconfiguration**
```bash
# Look for debug flags, CORS wildcards, permissive headers
grep -rn "debug.*true\|cors.*\*\|origin.*\*\|allowedOrigins.*\*\|NODE_ENV.*development" \
  --include="*.ts" --include="*.js" --include="*.yml" --include="*.yaml" \
  ! -path "*/node_modules/*" ! -path "*/.github/*" . | head -20
```

**A06 – Vulnerable and Outdated Components**
- Check `package.json` and `package-lock.json` for pinned vulnerable versions
- Cross-reference with known CVE databases

**A07 – Identification and Authentication Failures**
```bash
grep -rn "jwt\|token\|session\|cookie\|auth" \
  --include="*.ts" --include="*.js" ! -path "*/node_modules/*" . \
  | grep -v "test\|spec\|mock" | head -30
```

**A09 – Security Logging and Monitoring Failures**
```bash
# Check for error swallowing or missing audit logs
grep -rn "catch.*{}\|catch.*console\.\|\.catch(().*=>.*{})" \
  --include="*.ts" --include="*.js" ! -path "*/node_modules/*" . | head -20
```

### 4. Secret Detection

Scan for accidentally committed secrets:

```bash
# Check git log for potential secret commits
git log --oneline --all -20

# Look for patterns resembling secrets
grep -rn "sk-\|ghp_\|gho_\|ghs_\|xox[baprs]-\|AKIA\|-----BEGIN" \
  --include="*.ts" --include="*.js" --include="*.json" --include="*.yml" \
  ! -path "*/node_modules/*" ! -path "*/.git/*" . | head -20
```

### 5. Triage and Prioritize

Group findings by:
- **Critical**: Secrets exposed, SQL injection, RCE vectors — fix immediately
- **High**: Auth bypass, IDOR, SSRF — fix in current sprint
- **Medium**: Misconfiguration, information disclosure — fix this quarter
- **Low**: Missing headers, logging gaps — track as tech debt

### 6. Remediate or Report

**For Critical/High findings that can be fixed safely in one pass:**
1. Apply the minimal fix using the edit tool
2. Explain in the PR:
   - What OWASP category and CWE this addresses
   - What the root cause was
   - Why the fix is safe
3. Create a remediation PR using `create-pull-request`
4. Do **not** auto-merge; mark as draft and request security review

**For Medium/Low findings or issues requiring human judgment:**
1. Create a `create-issue` for each finding group (max 3)
2. Include: OWASP category, CWE, file/line, code snippet, recommended fix
3. Label appropriately with severity

**For dependency vulnerabilities:**
- If an `npm audit fix` or version bump resolves it cleanly, include in the PR
- If the fix is a major version bump with breaking changes, create an issue instead

### 7. Validation

Before creating a PR, verify the fix doesn't break existing tests:

```bash
npm run build 2>&1 | tail -20
npm run lint 2>&1 | tail -20
```

### 8. Edge Cases

- **No vulnerabilities found**: Call `noop` with a security health summary including last scan date
- **All issues already tracked**: Call `noop` referencing existing open issues
- **Complex vulnerability requiring architecture changes**: Create an issue with detailed analysis and escalation recommendations
- **False positives**: Note them in the issue/PR description with reasoning

## Security Review Checklist

Before finalizing any PR, confirm:
- [ ] Fix does not introduce new vulnerabilities
- [ ] Fix preserves existing behavior (tests pass)
- [ ] Fix is minimal and targeted
- [ ] OWASP category and CWE are documented in the PR
- [ ] Security reviewer is requested
