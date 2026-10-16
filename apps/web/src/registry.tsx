import type { ComponentType } from 'react'
import { ToastStack } from './seeds/ToastStack'
import { Otp } from './seeds/Otp'
import { Picker } from './seeds/Picker'
import toastCss from './seeds/toast.css?raw'
import otpCss from './seeds/otp.css?raw'
import pickerCss from './seeds/picker.css?raw'

/* ══ component registry ═══════════════════════════════════
   Every component on the canvas is an entry here — either a
   live React component ('react') or an HTML+CSS string ('html').
   React from day one; HTML strings for generated content later.
   Copy-out (§3 View 5): html-kind copies its strings; react-kind
   copies renderToStaticMarkup + its css (static — JS
   interactivity does not travel). */

export interface RegistryEntry {
  key: string
  name: string
  kind: 'react' | 'html'
  w: number
  h: number
  component?: ComponentType
  html?: string
  css?: string
}

const MUSIC_HTML = `<div class="mc">
  <div class="mc-top">
    <div class="mc-art"><svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg></div>
    <div><div class="mc-title">The Visit</div><div class="mc-artist">Agar Agar</div></div>
  </div>
  <div class="mc-bar"><i></i></div>
  <div class="mc-times"><span>1:44</span><span>-2:26</span></div>
</div>`

const MUSIC_CSS = `/* music card — see index.css (.mc) for the live styles */`

export const registry: Record<string, RegistryEntry> = {
  'toast-stack': {
    key: 'toast-stack',
    name: 'Toast stack',
    kind: 'react',
    w: 320,
    h: 240,
    component: ToastStack,
    css: toastCss,
  },
  'otp': {
    key: 'otp',
    name: 'One-time code',
    kind: 'react',
    w: 300,
    h: 140,
    component: Otp,
    css: otpCss,
  },
  'picker': {
    key: 'picker',
    name: 'Assignees',
    kind: 'react',
    w: 300,
    h: 300,
    component: Picker,
    css: pickerCss,
  },
  'music-card': {
    key: 'music-card',
    name: 'Music card',
    kind: 'html',
    w: 360,
    h: 210,
    html: MUSIC_HTML,
    css: MUSIC_CSS,
  },
}

export const registryList = Object.values(registry)
