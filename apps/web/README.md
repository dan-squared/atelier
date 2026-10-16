# Atelier — apps/web

Scaffold for the Atelier self-learning design canvas (PLAN.md P0/P1).

## Run it

```bash
cd apps/web
bun install   # or once at repo root: bun install
bun run fonts # one-time: downloads Inter v4.1 woff2 (binaries aren't committed)
bun dev       # → http://localhost:5173
```

## What's inside

- **tldraw 5.x canvas** (`src/App.tsx`) — infinite canvas, default toolset intact.
- **`ComponentShape`** (`src/shapes/`) — custom shape rendering registry
  entries. Move/resize/select free from tldraw. Double-click (or Enter)
  enters edit mode: html-kind shapes become contentEditable and commit
  back to shape props on blur (the future edit-event tap, P2).
- **Registry** (`src/registry.tsx`) — every component is an entry: `'react'`
  (live React component) or `'html'` (HTML+CSS strings). React from day one.
- **Seeds** (`src/seeds/`) — ToastStack, Otp, Picker with their original
  stylesheets verbatim; avatars are placeholder initial-discs (originals
  weren't licensed to travel — point `avatars.ts` at real photos).
- **Toolbar** — add any registry component; **Copy HTML / Copy CSS** for the
  selection (react-kind renders via `renderToStaticMarkup` — structure and
  styles travel, JS interactivity does not).
- **Constraint file** (`src/constraints/seed.json`) — hand-written v1 from
  PLAN §2; validated by `@atelier/constraints`.
- **Fonts** — Inter Variable v4.1 self-hosted from GitHub `rsms/inter`
  (`public/fonts/`, OFL licensed). No Google Fonts.

## Deliberate non-features (yet)

- No persistence (refresh = fresh wall) — P1 follow-up.
- No prompt bar / thinking trace — P2.
- No variant tree / gallery — P3.
- No critic / learning loop — P4+.

## Notes

- tldraw positions shapes with CSS transforms on the shape root; all
  motion/filters must live on inner divs (see `ComponentShape.tsx`).
- The seed stylesheets assume the theme contract in `index.css`
  (`--font-ui`, `--fill-on`, `--fill-slab`, `--ink`, `--ink-rgb`, …).
- tldraw SDK license: fine for personal/thesis/portfolio; re-check before
  commercial use.
