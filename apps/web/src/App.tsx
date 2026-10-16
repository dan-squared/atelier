import { useCallback, useRef, useState } from 'react'
import { Tldraw, createShapeId, type Editor } from 'tldraw'
import 'tldraw/tldraw.css'
import { ComponentShapeUtil, type ComponentShape } from './shapes/ComponentShape'
import { registry, registryList } from './registry'
import { shapeToHTML, shapeToCSS, copyText } from './lib/clipboard'

/* ══ Atelier shell (P1) ═══════════════════════════════════
   tldraw canvas + floating toolbar. Seeds are placed on first
   mount so the canvas opens as a wall, not a blank page. */

export default function App() {
  const editorRef = useRef<Editor | null>(null)
  const [flash, setFlash] = useState<string | null>(null)
  const flashTimer = useRef<number | undefined>(undefined)

  const say = useCallback((msg: string) => {
    setFlash(msg)
    window.clearTimeout(flashTimer.current)
    flashTimer.current = window.setTimeout(() => setFlash(null), 1600)
  }, [])

  const addComponent = useCallback(
    (ref: string) => {
      const editor = editorRef.current
      const entry = registry[ref]
      if (!editor || !entry) return
      const c = editor.getViewportPageBounds()
      const id = createShapeId()
      editor.createShapes([
        {
          id,
          type: 'component',
          x: c.midX - entry.w / 2,
          y: c.midY - entry.h / 2,
          props: {
            w: entry.w,
            h: entry.h,
            ref,
            name: entry.name,
            html: entry.html ?? '',
          },
        },
      ])
      editor.setSelectedShapes([id])
    },
    [],
  )

  const selectedComponent = useCallback((): ComponentShape | null => {
    const editor = editorRef.current
    if (!editor) return null
    const s = editor.getSelectedShapes().find((sh) => sh.type === 'component')
    return (s as ComponentShape | undefined) ?? null
  }, [])

  const onCopyHTML = useCallback(async () => {
    const s = selectedComponent()
    if (!s) return say('select a component first')
    try {
      await copyText(shapeToHTML(s.props.ref, s.props.html))
      say('HTML copied')
    } catch {
      say('copy failed')
    }
  }, [selectedComponent, say])

  const onCopyCSS = useCallback(async () => {
    const s = selectedComponent()
    if (!s) return say('select a component first')
    try {
      await copyText(shapeToCSS(s.props.ref))
      say('CSS copied')
    } catch {
      say('copy failed')
    }
  }, [selectedComponent, say])

  const onMount = useCallback((editor: Editor) => {
    editorRef.current = editor
    if (editor.getCurrentPageShapes().length === 0) {
      const spots: Array<[string, number, number]> = [
        ['toast-stack', 80, 80],
        ['otp', 480, 80],
        ['picker', 880, 80],
        ['music-card', 80, 400],
      ]
      const ids = spots.map(([ref, x, y]) => {
        const e = registry[ref]
        const id = createShapeId()
        editor.createShapes([
          {
            id,
            type: 'component',
            x,
            y,
            props: { w: e.w, h: e.h, ref, name: e.name, html: e.html ?? '' },
          },
        ])
        return id
      })
      void ids
      editor.setSelectedShapes([])
      editor.zoomToFit({ animation: { duration: 0 } })
    }
  }, [])

  return (
    <>
      <div className="atelier-bar" role="toolbar" aria-label="Atelier">
        <span className="bar-title">Atelier</span>
        {registryList.map((e) => (
          <button key={e.key} onClick={() => addComponent(e.key)}>
            + {e.name}
          </button>
        ))}
        <span className="bar-sep" />
        <button className="primary" onClick={onCopyHTML}>Copy HTML</button>
        <button className="primary" onClick={onCopyCSS}>Copy CSS</button>
        {flash && <span className="bar-flash">{flash}</span>}
        <span className="bar-hint">double-click text to edit · drag to move · corners resize</span>
      </div>
      <div className="tldraw-holder">
        <Tldraw shapeUtils={[ComponentShapeUtil]} onMount={onMount} />
      </div>
    </>
  )
}
