# Inner Loop

The inner loop in this repository covers the workflows that help a contributor move a change from branch to review to release prep.

## Workflows in the inner loop
- `pr-contribution-check`
- `ci-doctor`
- `code-scanning-fixer`
- `snyk-remediation`
- `breaking-change-checker` (PR mode)
- `changeset-generator`
- `pr-duplicate-check`

## How developers interact with them
1. Open or update a pull request.
2. Read the `pr-contribution-check` comment for review guidance.
3. If the standard `CI` workflow fails, let `ci-doctor` classify the failure before retrying or patching.
4. If code scanning, Dependabot, or Snyk surfaces a security signal, use the remediation workflow outputs as reviewed starting points rather than auto-merging fixes.
5. When the PR changes user-visible behavior, apply the `release-note` or `changeset` label so `changeset-generator` can prepare release metadata.

## How the inner loop accelerates delivery
- Pull requests get one structured checkpoint comment instead of ad hoc triage.
- CI failures are translated into likely root causes.
- Security findings are converted into draft PRs or clearly scoped follow-up work.
- Release-note work is pulled forward into the PR instead of being deferred.

## How existing tools feed the inner loop
- **Dependabot** remains the dependency-update signal source. GH-AW workflows react to those PRs and related review/security context.
- **Snyk** remains the vulnerability scanner. `snyk-remediation` uses Snyk findings as inputs for triage and remediation.
- **GitHub code scanning** remains the native alert source for `code-scanning-fixer`.
- **Standard CI** remains the build/test signal source for `ci-doctor`.
