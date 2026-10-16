/* ══ @atelier/constraints ═════════════════════════════════
   Schema + validator for Atelier constraint files (PLAN §6.1).
   Shared by the app, the critic (P4), and the extractor. */

export interface ConstraintFile {
  version: number
  document: string
  spacing: { base: number; scale: number[] }
  radius: { rule: 'concentric'; card: number; gap: number }
  type: {
    families: string[]
    mono: string[]
    scale: number[]
    roles: Record<string, { size: number; weight: number; color: string; tracking?: string }>
    tabularNumerals: boolean
  }
  color: Record<string, string>
  shadow: { card: string; float: string }
  motion: {
    settle: { stiffness: number; damping: number; mass: number }
    bubbly: { stiffness: number; damping: number; mass: number }
    reducedMotion: string
    framesNotMs: boolean
    selfParkingLoops: boolean
  }
  effects: { goo: { blur: number; cut: number }; neverOnText: boolean }
  knobs: Record<string, Record<string, unknown>>
}

const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/

/** Returns a list of violations; empty means the file is sound. */
export function validate(c: ConstraintFile): string[] {
  const bad: string[] = []

  if (c.version !== 1) bad.push(`version: expected 1, got ${c.version}`)

  for (const s of c.spacing.scale) {
    if (s % c.spacing.base !== 0)
      bad.push(`spacing.scale: ${s} is not a multiple of base ${c.spacing.base}`)
  }

  if (c.radius.card <= c.radius.gap)
    bad.push(`radius: card (${c.radius.card}) must exceed gap (${c.radius.gap}) for concentric rule`)

  const asc = [...c.type.scale].sort((a, b) => a - b)
  if (JSON.stringify(asc) !== JSON.stringify(c.type.scale))
    bad.push('type.scale: must be ascending')

  for (const [k, v] of Object.entries(c.color)) {
    if (typeof v === 'string' && v.startsWith('#') && !HEX.test(v))
      bad.push(`color.${k}: "${v}" is not a valid hex color`)
  }

  for (const name of ['settle', 'bubbly'] as const) {
    const m = c.motion[name]
    for (const p of ['stiffness', 'damping', 'mass'] as const) {
      if (!(m[p] > 0)) bad.push(`motion.${name}.${p}: must be positive`)
    }
  }

  return bad
}

/** Concentric radius law (PLAN §2.2 law 6): inner = outer − gap. */
export function concentricRadius(outer: number, gap: number): number {
  return Math.max(0, outer - gap)
}
