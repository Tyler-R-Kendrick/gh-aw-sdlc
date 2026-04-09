# Repo Demo Scenarios

## 1. New issue enters the backlog and gets triaged
1. Open a new issue with one of the issue forms.
2. Observe `issue-triage` apply category labels and route the issue toward coding-agent work or human review.
3. Show the labels in the issue list as backlog signals.

## 2. A pull request opens and gets evaluated
1. Open a PR against `main`.
2. Wait for `pr-contribution-check`.
3. Review the structured comment and the advisory labels it applies.

## 3. CI fails and CI Doctor responds
1. Push a change that causes the `CI` workflow to fail.
2. Let `ci-doctor` analyze the failed run.
3. Review the PR comment showing whether the failure looks flaky, environmental, or code-related.

## 4. A code scanning or Snyk finding triggers remediation
1. Use an existing code scanning alert or a Snyk-backed issue.
2. Run `code-scanning-fixer` or `snyk-remediation` manually for the demo if needed.
3. Review the resulting draft PR or triage comment to show how scanners feed GH-AW workflows.

## 5. Release-note changeset gets generated
1. Label a user-visible PR with `release-note` or `changeset`.
2. Run `changeset-generator`.
3. Open the generated `.changeset/**` file and show the appended PR note.

## 6. Architecture drift gets reported
1. Modify a boundary-sensitive file or run `architecture-guardian` manually.
2. Review the governance issue it creates when a boundary or principle is violated.
3. Tie the output back to `.architecture.yml` and the architecture principles doc.

## 7. The daily repo report summarizes activity
1. Trigger `daily-repo-status` from the Actions tab.
2. Review the generated issue.
3. Highlight the split between inner-loop delivery signals and outer-loop governance signals.
