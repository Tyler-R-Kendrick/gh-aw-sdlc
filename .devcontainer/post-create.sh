#!/usr/bin/env bash
set -euo pipefail

npm ci

if ! command -v act >/dev/null 2>&1; then
  echo "act is required in the dev container but was not installed. Check the ghcr.io/devcontainers-extra/features/act feature." >&2
  exit 1
fi

if ! act --version; then
  echo "act is installed in the dev container but failed to run." >&2
  exit 1
fi

if gh aw version; then
  true
elif gh extension install github/gh-aw; then
  gh aw version
else
  curl -sL https://raw.githubusercontent.com/github/gh-aw/main/install-gh-aw.sh | bash
  gh aw version
fi

npm install skills
