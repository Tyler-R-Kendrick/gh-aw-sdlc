#!/usr/bin/env bash
set -euo pipefail

npm ci

command -v act >/dev/null
act --version

if gh aw version; then
  true
elif gh extension install github/gh-aw; then
  gh aw version
else
  curl -sL https://raw.githubusercontent.com/github/gh-aw/main/install-gh-aw.sh | bash
  gh aw version
fi

npm install skills
