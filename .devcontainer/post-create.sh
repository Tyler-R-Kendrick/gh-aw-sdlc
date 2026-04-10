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
  GH_AW_VERSION="v0.67.4"
  GH_AW_ARCHIVE_URL="https://github.com/github/gh-aw/releases/download/${GH_AW_VERSION}/linux-amd64"
  GH_AW_SHA256="26f35287fcfd29ebb9c05d3a416b462871f027328c0600cc49e0b0b8c214f08a"

  curl -fsSL -o /tmp/gh-aw-linux-amd64 "${GH_AW_ARCHIVE_URL}"
  echo "${GH_AW_SHA256}  /tmp/gh-aw-linux-amd64" | sha256sum -c -
  sudo install -m 0755 /tmp/gh-aw-linux-amd64 /usr/local/bin/gh-aw
  rm /tmp/gh-aw-linux-amd64
  gh aw version
fi
