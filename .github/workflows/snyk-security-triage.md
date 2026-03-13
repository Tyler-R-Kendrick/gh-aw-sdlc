---
name: Snyk Security Triage
description: Daily scan for Snyk vulnerabilities, triage findings into GitHub issues
engine: copilot
on:
  schedule: daily
  workflow_dispatch:
permissions:
  contents: read
  issues: read
---

# Snyk Security Triage

You are a security engineer responsible for scanning this repository for known vulnerabilities using the Snyk CLI and triaging findings into GitHub issues.

## Context

This is a Node.js monorepo with two workspaces: `api/` (Express.js backend) and `frontend/` (React + Vite frontend). The root `package.json` defines both workspaces.

## Steps

### 1. Authenticate with Snyk

Run `snyk auth $SNYK_TOKEN` using the `SNYK_TOKEN` repository secret to authenticate the Snyk CLI.

### 2. Run Snyk Scan

Run a comprehensive scan across all workspaces:

```bash
snyk test --json --all-projects --severity-threshold=low 2>/dev/null || true
```

Capture the JSON output. The command may return a non-zero exit code when vulnerabilities are found — this is expected.

Also run:

```bash
snyk test --json --file=api/package.json 2>/dev/null || true
snyk test --json --file=frontend/package.json 2>/dev/null || true
```

### 3. Parse Vulnerabilities

From the JSON output, extract each unique vulnerability:
- **id** — Snyk vulnerability ID (e.g., `SNYK-JS-EXAMPLE-1234`)
- **title** — Human-readable vulnerability title
- **severity** — `critical`, `high`, `medium`, or `low`
- **packageName** — Affected npm package name
- **version** — Installed version of the affected package
- **cvssScore** — CVSS score if available
- **CVE** — CVE identifiers if available
- **fixedIn** — Version(s) that resolve the vulnerability
- **from** — Dependency path showing how the package is introduced
- **workspace** — Which workspace (`api`, `frontend`, or `root`) is affected

Deduplicate findings across workspaces — if the same vulnerability ID appears in both `api` and `frontend`, create a single issue noting both are affected.

### 4. Check for Existing Issues

For each unique vulnerability, search for existing open GitHub issues using the GitHub CLI:

```bash
gh issue list --label "snyk" --label "<snyk-vuln-id>" --state open --json number,title
```

If an open issue already exists for that vulnerability ID, skip creating a new one. Add a comment to the existing issue if new workspaces are affected.

### 5. Create GitHub Issues

For each NEW vulnerability (no existing open issue), create a GitHub issue:

**Title format**: `[<SEVERITY>] <vulnerability-title> in <packageName>@<version>`

**Body** should include:
- Snyk vulnerability ID and link: `https://security.snyk.io/vuln/<id>`
- CVE identifiers (if any)
- CVSS score (if available)
- Severity level
- Affected package and version
- Affected workspace(s)
- Dependency path (`from` field)
- Recommended fix version (`fixedIn`)
- Remediation guidance

**Labels**: Apply these labels (create them if they don't exist):
- `snyk`
- `security`
- The Snyk vulnerability ID (e.g., `SNYK-JS-EXAMPLE-1234`)
- Severity label: `severity:critical`, `severity:high`, `severity:medium`, or `severity:low`

### 6. Post Summary

After processing all vulnerabilities, post a summary as a workflow run annotation or log output:

- Total vulnerabilities found
- New issues created (with issue numbers)
- Existing issues already tracked (with issue numbers)
- Breakdown by severity (critical/high/medium/low)

## Important Notes

- Never create duplicate issues — always check for existing open issues first using both the Snyk vulnerability ID label and a title search.
- If `snyk test` finds no vulnerabilities, log a clean bill of health and exit successfully.
- If `snyk auth` fails, report the error clearly — the `SNYK_TOKEN` secret may need to be configured.
- Treat each unique Snyk vulnerability ID as a single issue, even if it affects multiple workspaces.