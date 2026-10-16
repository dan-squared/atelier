#!/usr/bin/env bash
# Downloads Inter Variable v4.1 woff2 files from the rsms/inter GitHub release tag
# into public/fonts/. The binaries are intentionally NOT committed to git
# (GitHub's file API can't push binary cleanly); run `bun run fonts` on a fresh
# clone. Files are pinned to tag v4.1 and verified by sha256.
set -euo pipefail

OUT_DIR="$(cd "$(dirname "$0")/../public/fonts" && pwd)"
BASE="https://raw.githubusercontent.com/rsms/inter/v4.1/docs/font-files"

declare -A FILES=(
  ["InterVariable.woff2"]="693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3"
  ["InterVariable-Italic.woff2"]="e564f652916db6c139570fefb9524a77c4d48f30c92928de9db19b6b5c7a262a"
)

mkdir -p "$OUT_DIR"
for name in "${!FILES[@]}"; do
  want="${FILES[$name]}"
  dest="$OUT_DIR/$name"
  if [ -f "$dest" ] && [ "$(sha256sum "$dest" | cut -d' ' -f1)" = "$want" ]; then
    echo "ok (cached): $name"
    continue
  fi
  echo "downloading: $name"
  curl -fsSL "$BASE/$name" -o "$dest"
  got="$(sha256sum "$dest" | cut -d' ' -f1)"
  if [ "$got" != "$want" ]; then
    echo "sha256 mismatch for $name: got $got, want $want" >&2
    rm -f "$dest"
    exit 1
  fi
  echo "ok (verified): $name"
done
echo "Inter v4.1 fonts ready in $OUT_DIR"
echo "License: SIL Open Font License 1.1 (see public/fonts/LICENSE.txt)"
