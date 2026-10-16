# SPEC.md — early sketch (2026-10-16)

> **Superseded by [PLAN.md](./PLAN.md)** — the master plan of record.
> This file is kept for history.

*A self-learning design canvas. Figma-like infinite canvas, real HTML components,
per-document taste profiles, recursive constraint improvement.*

## 1. Vision

A canvas where components are live HTML — selectable, draggable, editable.
You prompt, tweak, and arrange. The canvas watches your edits, learns your
taste **for that document**, and gets smarter: suggesting, generating, and
refining in your style. Every decision is visible (the "thinking"), every
design explorable (variant trees), every layer inspectable (exploded view).

Not rigid: it learns *conditional* taste — *when* you like *what* — never
forced uniformity.

## 2. The five views (from reference images)

1. **Prompt bar + Thinking** — type "music card"; the system narrates decisions
   as function calls (`typography.placeHierarchy()`). Each call = one
   constraint applied, logged as an event. Interpretability AND the data log.
2. **Exploded layers** — pull a component apart: grid → layout blocks →
   wireframe → finished design. The provenance view; the trust mechanism.
3. **Variant tree** — every generation branches; the recursive loop's search
   history made visible. Branches pruned/kept by score + your picks.
4. **Factory gallery** — all components at once, finished pieces next to
   wireframes with grids exposed. The "simultaneous and super fast" view.
5. **Canvas editor** — the infinite canvas itself: direct manipulation of
   live HTML components.

## 3. Core loop (recursive self-learning)

```
Generate (LLM + constraint file)
  → Render (live DOM → screenshot)
  → Critic (programmatic token checks + vision-model aesthetic rubric)
  → Mutate (hill-climb the constraint file; keep what scores higher)
  → Human signal (edits + "prefer this" clicks = preference labels, RLHF-style)
  → repeat (per document)
```

## 4. Data model

- **Constraint file** (per document, JSON, versioned): spacing scale, type
  scale (families/weights/sizes), color roles, radius, shadows, motion.
  This is what the loop mutates.
- **Edit event**: `{ componentId, componentType, property, oldValue,
  newValue, context: { contentType, siblings, position }, timestamp }`.
  The dataset. Every tweak you make is training data.
- **Style profile** (per document): conditional preferences —
  "in context C, prefers value V (confidence N, from K examples)".
- **Application policy**: confidence ≥ threshold → auto-apply; below →
  suggest (underline, not autocorrect). Every application cites its evidence
  ("based on 4 similar cards you edited") and is one click to revert.

## 5. Anti-rigidity rules (core requirement)

- Learn *conditional* taste, never global absolutes.
- Profiles are per-document; never leak across projects.
- Suggest below confidence threshold; never mandate.
- Every AI decision inspectable (thinking log) and reversible.

## 6. Suggested starting stack

- **Canvas**: tldraw SDK (selection/pan/zoom free, custom HTML shapes) —
  or hand-rolled React + absolute-positioned DOM for full control.
- **Components**: live HTML/CSS in the canvas; screenshots from the same DOM.
- **Constraint file**: JSON in W3C design-tokens shape (portable later).
- **Critic v1**: pure programmatic (computed-style checks vs token sets).
  No AI needed to start.
- **Loop runner**: small Node script; hill climbing, no gradients.
- **Later**: vision-model critic, per-document preference reward model.

## 7. Phases (build in public)

- **P1 — Canvas**: minimal infinite canvas; place + tweak HTML components.
  X: "day 1 of building my own design tool."
- **P2 — Edit stream**: capture every edit as structured events; show the
  "thinking" log live. X: "my canvas narrates every decision it makes."
- **P3 — Gallery + variants**: simultaneous generation, variant tree view.
  X: the speed demo.
- **P4 — Critic**: programmatic auto-grader on constraint adherence.
  X: "it grades its own homework."
- **P5 — Recursive loop**: overnight constraint mutation; keep what scores
  higher. X: "it redesigned its own taste overnight."
- **P6 — Taste profiles**: per-document learning + confidence-gated
  suggestions. X: "it designs like me now — per project."
- **P7 — Thesis**: falsifiable claim + experiments + write-up.

## 8. Learning map

- **3Blue1Brown**: optimization intuition → hill climbing (P5); nets as
  function approximators → the critic as a learned reward function (P4/P6).
- **Karpathy**: tokens/transformers → how the generator works (P3);
  RLHF → preference labels from your clicks (P6).

## 9. Decisions (resolved 2026-10-16)

- **Canvas**: tldraw SDK confirmed. Custom shapes render React components
  first-class; move/resize/select come free; in-place text editing is wired
  manually (double-click → editing state → contentEditable → save to shape
  props — standard pattern).
- **Component format**: start with HTML/CSS strings rendered inside the
  shape; graduate to real React components as shapes later. Migration path
  is clean since tldraw is React-native.
- **Copy-out**: serialize shape → static HTML + collected CSS. Straightforward.
- **Constraint file**: BOTH paths — hand-write the first one (Marvin-style),
  plus a browser extension that extracts a starter file from any design you
  love (walk DOM → getComputedStyle → aggregate → quantize → JSON).

## 10. Constraint extractor (browser extension) — parallel track

Content script: walk the DOM, collect computed styles per element, aggregate
unique values (fonts, sizes, weights, colors, spacing, radii, shadows), then
quantize (snap near-duplicates: colors within tolerance, spacing to 4px grid)
→ download constraint JSON. Captures the "what"; you hand-tune the "why".
