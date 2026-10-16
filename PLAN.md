# ATELIER — Master Plan v1.0

> A self-learning design canvas. Figma-like infinite canvas, live HTML/React
> components, per-document taste profiles, recursive constraint improvement.
> This document is the complete pre-build picture. SPEC.md is the earlier
> sketch; this is the plan of record.

---

## 0. How to read this document

- **§2** is the design-language analysis: every token, rule, and philosophy
  extracted from the reference images and the three seed components.
- **§3–§9** are the product and system design.
- **§10–§11** lock the stack and fonts.
- **§12** is the build order with exit criteria — nothing starts until the
  phase's exit criteria are met.
- Nothing here is a "fast patch." Each section was analyzed, not skimmed.

---

## 1. Vision & non-goals

**Vision.** A canvas where components are live, editable HTML/React. You
prompt, tweak, arrange. The canvas watches every edit, learns your taste
*for that document*, and gets smarter — suggesting, generating, refining in
your style. Every decision is visible (the thinking trace), every design
explorable (variant trees), every layer inspectable (exploded view).

**Non-goals.**
- Not a generic "AI makes a card" demo. The differentiators are the thinking
  trace, the exploded provenance view, the variant tree as visible search
  history, and per-document taste learning.
- Not rigid: the system learns *conditional* taste (when you like what),
  never forced uniformity.
- Not a Figma clone: no attempt at full vector editing. The canvas is a
  *component* canvas — components are the atoms.

**Quality bar.** Portfolio-grade. A senior designer opening this should say
"this person is good; nobody did this before." Every phase ships
demonstration-quality, not prototype-quality.

---

## 2. Design language analysis

### 2.1 From the reference images (token extraction)

Eyeballed from the five screenshots; confidence noted. Calibrate against
real renders in P0.

**Color**

| Token | Value | Confidence | Notes |
|---|---|---|---|
| `--paper` | `#F4F2ED` | high | Warm off-white canvas background, all gallery images |
| `--card` | `#FFFFFF` | high | Component cards on paper |
| `--ink` | `#1C1B1A` | high | Primary text, warm black |
| `--ink-soft` | `#6F6A61` | medium | Small labels ("Invoice draft", "Next departure") |
| `--ink-faint` | `#A8A29A` | medium | Captions, placeholders |
| `--dark-card` | `#3A3F4C` | high | Focus-timer card; dark variant surface |
| `--halo` | `#F6D9E6` @ ~60% | medium | Pink selection glow around wireframes |
| `--block-lav` | `#E3E0F6` | high | Lavender layout blocks |
| `--block-peri` | `#DEE7FB` | high | Periwinkle layout blocks |
| `--grid-line` | `#C7D5F2` | medium | Fine blue grid overlay |
| `--pink-grid` | `#F3D9E4` | medium | Pink grid under layout blocks (exploded view) |
| `--variant-blue` | `#2B4BD8` | medium | Saturated blue theme in variant trees |
| `--variant-purple` | `#9B8AFB` | low | Purple theme variant |
| `--variant-beige` | `#E8DCC8` | low | Beige theme variant |

**Typography**

| Role | Spec | Notes |
|---|---|---|
| UI labels | Inter 11–12px, 500, `--ink-soft`, tight tracking | "Invoice draft", "Next departure", "Motion postcards" |
| Titles | Inter 13–14px, 600, `--ink` | Card titles |
| Display numerals | 28–32px, tight letter-spacing | "$1,500", "15:00", "1:44" |
| Editorial serif | Serif for display moments | "Follow the light. The rest can wait." — quotes/pull-quotes get a serif; **typeface TBD** (see §11) |
| System/mono | `ui-monospace` stack, ~12px | The thinking trace (`typography.placeHierarchy()`) |
| Tabular numerals | `font-variant-numeric: tabular-nums` | Timers, invoice amounts — inferred from usage |

**Spacing, radius, shadow**

- Base grid: **8px**. Card padding 16–24px. Gaps 8–12px.
- Card radius: 16–20px. Prompt bar: full pill. Buttons/inputs: 8–12px.
- Shadows: soft and low-contrast —
  `0 1px 2px rgba(16,16,20,.04), 0 8px 32px rgba(16,16,20,.08)` for cards;
  prompt bar slightly deeper. No hard shadows anywhere.
- The prompt bar (image 4): floating pill, white, × left, query text,
  **black circular submit button with ↑** right. This exact pattern is the
  reference for Atelier's own prompt bar.

**Variant tree visual language (images 1–2)**

- Parent card → up to 5 children, curved bezier connectors, rows of trees.
- Variants explore **color themes** first (dark / light / blue / purple /
  beige / olive) — theme is the primary mutation axis in the reference.
- Node size ~ parent 1.4× child. Generous whitespace between trees.

### 2.2 From the seed components — "the constitution"

The three provided components (ToastStack, Otp, Picker) are not just code;
they are a **design-engineering philosophy**. Decoded into laws, each of
which becomes a machine-readable constraint in §6:

1. **One spring.** `{ stiffness: 380, damping: 34, mass: 0.8 }` — everything
   that settles uses it. "A touch under critical so it settles with a hint
   of give."
2. **Bubbly variant.** `{ stiffness: 500, damping: 18, mass: 0.9 }`
   (ζ ≈ 0.63) — entrances with character. Two springs total, not twenty.
3. **Frames, not milliseconds.** `dt` in sixtieths; damping *raised* to dt.
   Frame-rate-independent motion. Loops self-park (no permanent rAF).
4. **`prefers-reduced-motion` is read once** — "a preference, not a live
   input" — and honored everywhere.
5. **Goo filter** (feGaussianBlur + feColorMatrix, blur 7 / cut 28; Otp uses
   3/24) for liquid merges — and **never on text**: "glyph antialiasing
   lives entirely below 0.5, so type under this filter loses its edges and
   then itself."
6. **Concentric radii.** Inner radius = outer radius − gap (e.g. 22 − 6px
   padding = 16px). Published as a CSS var whenever the outer radius is a
   knob, so the pair stays correct at every setting.
7. **Computed, not measured.** Widths derived arithmetically so animations
   are zoom-independent (no layout-measuring animation libs).
8. **Knob honesty.** Every prop stays meaningful in every mode — "a knob
   that goes dead in half the modes is a knob you have to explain."
9. **Real inputs under drawn UI.** Otp: one invisible input over drawn
   cells — paste, autofill, screen readers all work. Focus/blur parity with
   pointer handlers.
10. **The pill is the readout.** Components report *state*, not
    instructions: "Unassigned" (not "Assign"), faces (not "3 selected").
11. **Demo in the doing state.** Picker opens with two already chosen —
    "a picker drawn shut is a pill with a word in it: true of the component
    and useless as a picture of it."
12. **Don't refactor tuned live code to prove a point.** Engineering
    culture: two working copies stay; new code uses the shared one.
13. **Comments explain why, not what.** The voice of the codebase — and the
    model for the thinking trace (§7).

### 2.3 The voice

The thinking trace speaks in **function calls**: `typography.placeHierarchy()`.
The seed code speaks in **named principles** ("THE PILL IS THE READOUT").
Atelier's generated narration must use the same register: short, declarative,
mechanical-poetic. Never marketing copy. Never emoji. The trace is a lab
notebook, not a chatbot.

---

## 3. Product: the five views (detailed)

### View 1 — Prompt bar + thinking trace
- Floating pill prompt bar (per §2.1 reference): × clears, black circular ↑
  submits. Inter 14px query text.
- On submit: the bar collapses to a "Thinking…" line; decisions stream below
  as mono function calls (`typography.placeHierarchy()`,
  `spacing.applyScale(8)`, `color.assignRole('surface')` …), each resolving
  with a check. Then the component materializes on canvas.
- Each trace line is a **logged constraint application** — the UX *is* the
  data pipeline (§7).

### View 2 — Exploded layers (provenance)
- Select a component → "Explode" pulls it apart isometrically:
  **grid → layout blocks → wireframe → finished component**.
- Layers: blue grid base, pink-grid + lavender/periwinkle blocks, wireframe
  (Title/Body/Cap placeholders, thin borders), finished design on top.
- Purpose: trust. "Show your work" as a first-class view, not a marketing
  video.

### View 3 — Variant tree
- Any component can "Branch": parent node → N children via bezier
  connectors, each a constraint mutation (theme first, per reference).
- The tree **is the recursive loop's search history made visible** (§8):
  kept branches solid, pruned branches ghosted with the reason
  ("score 0.41 < 0.62 — dropped").
- Clicking any node promotes it to the canvas.

### View 4 — Factory gallery
- All components at once: finished pieces beside wireframes with grids
  exposed, on warm paper. The "simultaneous and super fast" view.
- Doubles as the **benchmark view** later: every component badged with its
  critic score.

### View 5 — Canvas editor (the home view)
- Infinite tldraw canvas. Components are live HTML/React shapes:
  **select, drag, resize** (free from tldraw), **double-click to edit text**
  (wired via contentEditable → shape props), **right-click → Copy HTML**,
  **Copy CSS**.
- Property panel (later phases): sliders bound to constraint knobs —
  dragging one re-renders live (the playground).
- "Prefer this" affordance on variants → preference labels (§8).

---

## 4. Seed components — integration plan

ToastStack, Otp, Picker ship as **the first wall**: the canvas opens with
all three placed, demonstrating the bar.

**Gaps found in analysis (must be closed in P0):**
- **CSS missing.** All three import `./X.css` files that were not provided.
  Author them from the §2.1 tokens. Class hooks are stable
  (`.tst`, `.tst-toast`, `.otp`, `.otp-cell`, `.pik`, `.pik-pill` …) —
  write CSS to the hooks, don't rename the hooks.
- **Avatars empty.** `AVATARS` record is unpopulated (rightly — Bencho's
  photos aren't licensed to travel). Use generated initial-discs in the
  Atelier palette until real photos exist. Never hotlink strangers' photos.
- **`motion` package.** Code uses `framer-motion`; current package is
  `motion` (its successor). Migrate imports at integration; spring configs
  are plain objects and carry over untouched.
- **Otp `length` prop** accepts 4|6; keep. **`answer` knob** ("Accept" |
  "Reject") stays — it's the demo control.

**What each seed proves on day one:**
- ToastStack → the spring system + stacked/expandable layout math.
- Otp → the goo filter + invisible-input a11y pattern + frame-loop
  discipline.
- Picker → knob honesty + computed-not-measured + readout philosophy.

---

## 5. Architecture & repo layout

```
atelier/
  apps/web/                    # Bun + Vite + React 19 + tldraw 5.x
    src/
      shapes/                  # ComponentShape: renders HTML string OR React component
      views/                   # promptbar, exploded, variants, gallery, canvas chrome
      thinking/                # trace renderer + event log
      constraints/             # loader, validator, UI bindings
      critic/                  # programmatic critic (P4)
      learn/                   # style profiles, loop runner (P5–P6)
    public/fonts/              # Inter (self-hosted, §11)
  packages/constraints/        # schema + validator + quantizer (shared by app & extractor)
  packages/extractor/          # browser extension (parallel track, §12)
  docs/                        # PLAN.md, SPEC.md, DESIGN-LANGUAGE.md (generated from §2)
  assets/
```

**Monorepo:** Bun workspaces. One lockfile. `bun dev` runs the app.

**Shape strategy (critical detail).** tldraw positions shapes with CSS
transforms on the shape container — **the shape root stays tldraw-controlled**.
All framer/motion animation and goo filters live on **inner divs**. Selection
bounds follow `w/h`; animated overflow (e.g. toasts fanning out) may paint
outside bounds — acceptable, do not clip.

**Text editing.** Double-click (or Enter) on a text region → `editing` state
→ contentEditable div → blur/Escape commits to shape props → **edit event
emitted** (§6). This is the dataset tap.

---

## 6. Data models

### 6.1 Constraint file (per document, versioned JSON)

```ts
interface ConstraintFile {
  version: number;
  document: string;              // which canvas this belongs to
  spacing: { base: 8; scale: number[] };          // e.g. [4,8,12,16,20,24,32]
  radius: { rule: "concentric"; card: number; gap: number };
  type: {
    families: ["Inter"];                       // + display serif TBD (§11)
    mono: string[];                            // ui-monospace stack
    scale: number[];                           // px sizes allowed
    roles: { label: {...}; title: {...}; display: {...} };
    tabularNumerals: boolean;
  };
  color: Record<string, string>;                // §2.1 tokens
  shadow: { card: string; float: string };
  motion: {
    settle: { stiffness: 380; damping: 34; mass: 0.8 };
    bubbly: { stiffness: 500; damping: 18; mass: 0.9 };
    reducedMotion: "read-once-and-honor";
  };
  effects: { goo: { blur: 7; cut: 28 }; neverOnText: true };
  knobs: Record<string, { default: unknown; min?: number; max?: number }>;
}
```

Seed v1 is **hand-written from §2** (Marvin-style). The extractor (§12,
parallel track) produces starter files from sites you love; you hand-tune.

### 6.2 Edit event (the dataset)

```ts
interface EditEvent {
  id: string; timestamp: number; documentId: string;
  componentId: string; componentType: string;   // "toast-stack" | "otp" | …
  property: string;                             // "padding" | "fontSize" | …
  oldValue: unknown; newValue: unknown;
  context: {
    contentType: string;        // "image" | "dense-text" | "numeric" | …
    siblingDensity: number;     // 0..1
    position: "hero" | "card" | "toolbar" | …;
    theme: string;
  };
}
```

Every canvas tweak emits one. This stream is the only training data the
system ever needs.

### 6.3 Style profile (per document — never shared across documents)

```ts
interface StyleProfile {
  documentId: string;
  prefs: Array<{
    contextSig: string;         // hashed context
    property: string;
    value: unknown;
    confidence: number;         // 0..1, from count + consistency
    evidence: number;           // K examples
    lastUsed: number;
  }>;
}
```

### 6.4 Thinking-trace event

```ts
interface TraceEvent {
  seq: number;
  call: string;                 // "typography.placeHierarchy()"
  args: Record<string, unknown>;
  status: "ok" | "adjusted" | "skipped";
  note?: string;                // one-line rationale, lab-notebook voice
  constraintRef?: string;       // which constraint file entry applied
}
```

---

## 7. The constraint engine (thinking = function calls)

Generation is **not** "prompt → magic". It is a sequence of named,
logged, replayable function calls, each applying one constraint-file entry:

```
prompt("music card")
  → layout.chooseGrid(8)
  → spacing.applyScale([16, 24])
  → typography.placeHierarchy()      // label 12/500, title 14/600
  → color.assignRole('surface')      // paper → card → ink
  → radius.applyConcentric(20, gap 6)
  → motion.assign('settle')
  → render()
```

- The trace renders live in View 1 and is stored per component.
- Exploded view (§3, View 2) is literally the trace replayed spatially.
- The programmatic critic (§8) replays the trace and verifies each call's
  output against the constraint file — **provenance becomes verification**.

---

## 8. The learning loop (recursive self-improvement)

### 8.1 The critic (two layers)
1. **Programmatic** (P4, no AI): parse computed styles of the rendered
   component; every value must be ∈ the token sets; score = weighted
   pass rate. Deterministic, instant, free.
2. **Vision** (later): multimodal model judges balance/hierarchy against a
   rubric; score 0..1. API call, cents per judgment, used sparingly
   (sampling, not every frame).

### 8.2 The mutation loop (P5)
Hill climbing on the constraint file — no gradients needed:
1. Pick one parameter (e.g. `spacing.scale`, `radius.card`).
2. Perturb within bounds → regenerate affected components → critic scores.
3. Keep iff score improves. Log the decision to the variant tree
   (kept solid / pruned ghosted with reason).
4. Run on a schedule (the "overnight" loop) or on demand.

### 8.3 Human preference learning (P6)
- "Prefer this" clicks + edit events → preference labels, **per document**.
- Style profile (§6.3) updated by counting: same
  (context, property) → value distribution sharpens.
- **Application policy:** confidence ≥ 0.85 and evidence ≥ 5 → auto-apply;
  below → suggest (spellcheck-underline treatment, never autocorrect).
  Every application cites evidence ("based on 4 similar cards you edited")
  and is one click to revert.
- This is RLHF-shaped: your clicks are the preference data, the profile
  is the reward model, the loop is the policy update — except the "policy"
  is a legible JSON file, not weights.

### 8.4 Anti-rigidity (hard requirements)
- Learn **conditional** taste only: the context signature is part of every
  preference key. "24px padding" is never learned; "24px padding on
  image-cards next to dense text" is.
- Profiles are **per-document**; cross-document leakage is a bug.
- Suggestions, never mandates, below confidence threshold.
- Every AI decision inspectable (trace) and reversible.

---

## 9. Tech stack (locked)

| Layer | Choice | Rationale |
|---|---|---|
| Runtime | **Bun** (latest) | User requirement; workspaces; fast |
| Build | **Vite 7** | tldraw's native habitat; instant HMR |
| UI | **React 19** | tldraw 5.x requires it |
| Canvas | **tldraw 5.x** | Infinite canvas, custom React shapes, free select/drag/resize; verified vs docs |
| Motion | **motion 12.x** (framer-motion successor) | Seed code migrates cleanly; spring objects unchanged |
| Icons | **lucide-react** (latest) | Seed code already uses it |
| Language | **TypeScript 5.x**, strict | |
| Font | **Inter Variable**, self-hosted from GitHub | §11 |
| AI (P3+) | Model API calls only (generator + vision critic) | No agent frameworks; API key + per-call cost; proxied via tiny Bun server in P3 |

**tldraw license note.** The SDK is under the tldraw license (starter kits
are MIT). Fine for personal/thesis/portfolio; re-check before any
commercial use.

**Versions** resolve at scaffold time (`bun install` latest); pin in the
lockfile then.

---

## 10. Fonts

- **Inter**: download from GitHub `rsms/inter` releases (v4.1):
  `InterVariable.woff2` + `InterVariable-Italic.woff2` (+ `OFL.txt` license)
  into `apps/web/public/fonts/`. `@font-face` with `font-display: swap`,
  preloaded. **No Google Fonts** — their build strips the optical-size
  (`opsz`) axis and OpenType features; the GitHub build is canonical.
- **Mono**: system stack (`ui-monospace, SFMono-Regular, Menlo, monospace`)
  for the thinking trace. No download needed.
- **Display serif** (for editorial moments, §2.1): **decision open**.
  Candidates from GitHub (not Google Fonts): `adobe-fonts/source-serif`
  (Source Serif 4). Evaluate in P0 against the reference screenshots;
  may also decide serif is out-of-scope for v1.

---

## 11. Phases — build order with exit criteria

> Nothing starts until the previous phase's exit criteria are met.
> Each phase ends with an X post (build in public).

**P0 — Foundation.** Fonts wired (Inter self-hosted, rendering identically
to reference). §2 tokens encoded as CSS custom properties. Seed components
integrated: CSS authored to hooks, `motion` migrated, avatars replaced with
initial-discs. **Exit:** the three seeds render on a blank page, pixel-true
to the reference aesthetic. **X:** "collecting the raw materials."

**P1 — Canvas.** tldraw app shell; `ComponentShape` (renders HTML string,
later React); place/move/resize free; double-click text editing wired;
right-click Copy HTML / Copy CSS; seeds placed as the first wall.
**Exit:** you can arrange all three seeds, edit their text, copy one out
as working HTML/CSS. **X:** "day 1 of building my own design tool."

**P2 — Edit stream + thinking trace.** Every edit emits §6.2 events (visible
in a dev drawer). Prompt bar (pill per §2.1) submits → trace streams as
mono function calls → component materializes. **Exit:** prompt "music card"
produces a traced, logged component. **X:** "my canvas narrates every
decision it makes."

**P3 — Gallery + variants.** Simultaneous multi-generation; variant tree
view with bezier branches; theme as first mutation axis (per reference).
**Exit:** one prompt → 5 themed variants in a tree, each promotable.
**X:** the speed demo. *(First AI API usage: generator calls via tiny Bun
proxy — key never in browser code.)*

**P4 — Critic.** Programmatic scorer (§8.1); scores badged in gallery;
trace replay verification. **Exit:** gallery shows scores; a deliberately
off-token component scores < 0.5 with reasons listed. **X:** "it grades its
own homework."

**P5 — Recursive loop.** Hill-climbing mutation runner (§8.2); variant
tree shows kept/pruned with reasons; overnight mode. **Exit:** leave it
running; morning constraint file differs and mean score is up, with a
readable changelog. **X:** "it redesigned its own taste overnight."

**P6 — Taste profiles.** Per-document profiles (§6.3); confidence-gated
suggestions with evidence citations; "prefer this" labels. **Exit:** in a
fresh document, after ~10 edits, suggestions appear citing your edits;
switching documents shows different behavior. **X:** "it designs like me
now — per project."

**P7 — Thesis.** Falsifiable claim ("constraint files improved by the
recursive loop reach human acceptance in fewer iterations than
hand-written ones"), experiments, write-up. **X:** the paper.

**Parallel track — Extractor.** Browser extension: DOM walk →
computed styles → aggregate → quantize → constraint JSON download.
**Exit:** point it at a site you love, get a starter file that scores
> 0.8 on the P4 critic against that site. (Captures the *what*; you
hand-tune the *why*.)

---

## 12. Risks & mitigations

| Risk | Mitigation |
|---|---|
| tldraw transform vs motion transforms conflict | Motion only on inner divs; shape root stays tldraw-controlled (§5) |
| Goo filter perf with many instances | `useId` per instance (already in seed code); cap concurrent goo scenes; measure in P1 |
| Text editing UX edge cases | contentEditable commit on blur/Escape; plain-text only (no rich text in v1) |
| Missing seed CSS | Authored in P0 to stable hooks; visual QA vs reference images |
| Avatar licensing | Initial-discs; never hotlink |
| tldraw license (commercial) | Personal/thesis/portfolio is fine; re-check before commercializing |
| API costs (P3+) | Generator/critic calls only; sampling + caching; tiny Bun proxy keeps keys server-side |
| Scope creep ("Figma clone") | Non-goals in §1 are load-bearing; component canvas only |

---

## 13. Learning map

- **3Blue1Brown** → optimization intuition: hill climbing (P5); nets as
  function approximators: the critic as a learned reward function (P4/P6);
  conditional computation: attention ≈ conditional taste (§8.4).
- **Karpathy** → tokens/transformers: how the generator works (P3);
  RLHF: preference labels from your clicks (P6); "Software 2.0":
  the constraint file *is* the program, the model fills the weights.

---

## 14. Appendix — seed knob inventory (for constraint extraction)

- ToastStack: `peek=14, gap=10, corner=20, W=300, H=64, SHOWN=3`,
  spring 380/34/1.
- Otp: `length ∈ {4,6}, corner=12, W=36, H=44, G=7`, goo 3/24,
  merge spring k=0.075 ζ=0.42, shake 620ms, pop 260ms.
- Picker: `corner=20, overlap=LAP 10, stack ∈ {Row, Grid}, W=264, H=268,
  FACE=28`, springs 500/18/0.8 (character) + 380/34/0.7 (tracking).

These become the first entries in `constraintFile.knobs` — the factory
starts by describing *these exact components*, then generalizes.
