import { useRef } from 'react'
import {
  ShapeUtil,
  T,
  HTMLContainer,
  Rectangle2d,
  useEditor,
  type TLShape,
  type RecordProps,
} from 'tldraw'
import { registry } from '../registry'

/* ══ ComponentShape ═══════════════════════════════════════
   A tldraw custom shape that renders either an HTML string or a
   React component from the registry (PLAN §5).

   The shape root stays tldraw-controlled (it positions via CSS
   transform). All motion/filters live on INNER divs.

   Canvas owns the frame: content is pointer-inert in view mode
   (Figma-like — you arrange, not click through). Double-click
   (or Enter) enters edit mode: html-kind shapes become
   contentEditable and commit back to shape props on blur —
   every commit is a future edit-event (P2). */

declare module 'tldraw' {
  export interface TLGlobalShapePropsMap {
    component: { w: number; h: number; ref: string; name: string; html: string }
  }
}

export type ComponentShape = TLShape<'component'>

export class ComponentShapeUtil extends ShapeUtil<ComponentShape> {
  static override type = 'component' as const

  static override props: RecordProps<ComponentShape> = {
    w: T.number,
    h: T.number,
    ref: T.string,
    name: T.string,
    html: T.string,
  }

  override canEdit = () => true
  override canResize = () => true

  getDefaultProps(): ComponentShape['props'] {
    return { w: 360, h: 240, ref: 'music-card', name: 'Component', html: '' }
  }

  getGeometry(shape: ComponentShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    })
  }

  component(shape: ComponentShape) {
    return <ComponentBody shape={shape} />
  }

  getIndicatorPath(shape: ComponentShape) {
    const path = new Path2D()
    path.rect(0, 0, shape.props.w, shape.props.h)
    return path
  }
}

function ComponentBody({ shape }: { shape: ComponentShape }) {
  const editor = useEditor()
  const entry = registry[shape.props.ref]
  const isEditing = editor.getEditingShapeId() === shape.id
  const bodyRef = useRef<HTMLDivElement>(null)

  if (!entry) {
    return (
      <HTMLContainer id={shape.id}>
        <div className="acomp">
          <div className="acomp-missing">unknown component “{shape.props.ref}”</div>
        </div>
      </HTMLContainer>
    )
  }

  const commit = () => {
    const el = bodyRef.current
    if (!el || entry.kind !== 'html') return
    const html = el.innerHTML
    if (html !== (shape.props.html || entry.html)) {
      editor.updateShape({
        id: shape.id,
        type: 'component',
        props: { html },
      })
      // P2: emit EditEvent here (what changed + context)
    }
  }

  return (
    <HTMLContainer id={shape.id}>
      <div className="acomp">
        {entry.kind === 'react' && entry.component ? (
          <div className="acomp-view">
            <entry.component />
          </div>
        ) : (
          <div className={isEditing ? 'acomp-edit' : 'acomp-view'}>
            <div
              ref={bodyRef}
              contentEditable={isEditing && entry.kind === 'html'}
              suppressContentEditableWarning
              onBlur={commit}
              style={{ width: '100%', height: '100%' }}
              dangerouslySetInnerHTML={{
                __html: shape.props.html || entry.html || '',
              }}
            />
          </div>
        )}
      </div>
    </HTMLContainer>
  )
}
