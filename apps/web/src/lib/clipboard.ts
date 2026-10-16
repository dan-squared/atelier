import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { registry } from '../registry'

/* Copy-out for View 5 (§3): HTML + CSS of the selected component.
   react-kind renders to static markup — structure and styles
   travel, JS interactivity does not. */

export function shapeToHTML(ref: string, htmlOverride?: string): string {
  const entry = registry[ref]
  if (!entry) return ''
  if (entry.kind === 'react' && entry.component) {
    return renderToStaticMarkup(createElement(entry.component))
  }
  return htmlOverride || entry.html || ''
}

export function shapeToCSS(ref: string): string {
  return registry[ref]?.css || '/* no css for this component */'
}

export async function copyText(text: string): Promise<void> {
  await navigator.clipboard.writeText(text)
}
