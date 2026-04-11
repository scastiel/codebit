let applied = false

function patchProto(proto: any) {
  const desc = Object.getOwnPropertyDescriptor(proto, 'fontStretch')
  if (!desc || !desc.set) return
  const origSet = desc.set
  Object.defineProperty(proto, 'fontStretch', {
    ...desc,
    set(value: string) {
      if (typeof value === 'string' && value.endsWith('%')) {
        origSet.call(this, 'normal')
        return
      }
      try {
        origSet.call(this, value)
      } catch {
        origSet.call(this, 'normal')
      }
    },
  })
}

export function applyCanvasFontStretchShim() {
  if (applied) return
  if (typeof CanvasRenderingContext2D !== 'undefined') {
    patchProto(CanvasRenderingContext2D.prototype)
  }
  if (typeof (globalThis as any).OffscreenCanvasRenderingContext2D !== 'undefined') {
    patchProto((globalThis as any).OffscreenCanvasRenderingContext2D.prototype)
  }
  applied = true
}
