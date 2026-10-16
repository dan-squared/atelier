/* Placeholder avatars for the seed wall. The originals were someone's
   own photographs and are not licensed to travel — point this at real
   photos when they exist. Until then: initial discs in the Atelier
   palette, as inline SVG data URIs (offline-safe). */

const disc = (initials: string, bg: string): string =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">` +
      `<rect width="64" height="64" rx="32" fill="${bg}"/>` +
      `<text x="32" y="42" font-family="Inter,sans-serif" font-size="24" font-weight="600" fill="#ffffff" text-anchor="middle">${initials}</text>` +
      `</svg>`,
  )}`

export const AVATARS: Record<string, string> = {
  kai: disc('AM', '#4C6EF5'),
  mara: disc('PR', '#9C36B5'),
  sofia: disc('NW', '#0C8599'),
  ines: disc('MB', '#E8890C'),
}
