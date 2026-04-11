import randomSeed from 'random-seed'
import { CSSProperties } from 'react'
import { interpolate } from 'remotion'

type GradientStop = { x: number; y: number; h: number; s: number; l: number }
type GradientParams = {
  base: { r: number; g: number; b: number }
  stops: GradientStop[]
}

export function gradientParamsFromSeed(
  seed: number,
  frame = 0,
  durationInFrames = 1,
): GradientParams {
  const rand = randomSeed.create(String(seed))
  const inter = (value: number, direction: number) =>
    interpolate(
      frame,
      [0, Math.max(durationInFrames, 30 * 15)],
      direction === 0 ? [value - 50, value + 50] : [value + 50, value - 50],
    )
  const stops = Array.from(Array(rand.intBetween(4, 10))).map((_, index) => ({
    x: inter(rand.intBetween(0, 100), index % 2),
    y: inter(rand.intBetween(0, 100), index % 2),
    h: rand.intBetween(0, 360),
    s: rand.intBetween(85, 95),
    l: rand.intBetween(50, 70),
  }))
  return {
    base: {
      r: rand.intBetween(0, 255),
      g: rand.intBetween(0, 255),
      b: rand.intBetween(0, 255),
    },
    stops,
  }
}

export function drawGradientOnCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: GradientParams,
) {
  ctx.fillStyle = `rgb(${params.base.r}, ${params.base.g}, ${params.base.b})`
  ctx.fillRect(0, 0, width, height)
  for (const stop of params.stops) {
    const cx = (stop.x / 100) * width
    const cy = (stop.y / 100) * height
    const dx = Math.max(cx, width - cx)
    const dy = Math.max(cy, height - cy)
    const radius = Math.sqrt(dx * dx + dy * dy)
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.5)
    grad.addColorStop(0, `hsla(${stop.h}, ${stop.s}%, ${stop.l}%, 1)`)
    grad.addColorStop(1, `hsla(${stop.h}, ${stop.s}%, ${stop.l}%, 0)`)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)
  }
}

export function gradientCssFromSeed(
  seed: number,
  frame = 0,
  durationInFrames = 1,
) {
  const { backgroundColor, backgroundImage } = gradientStyleFromSeed(
    seed,
    frame,
    durationInFrames,
  )
  return `background-color: ${backgroundColor}; background-image: ${backgroundImage};`
}

export function gradientStyleFromSeed(
  seed: number,
  frame = 0,
  durationInFrames = 1,
): CSSProperties {
  const rand = randomSeed.create(String(seed))
  const inter = (value: number, direction: number) =>
    interpolate(
      frame,
      [0, Math.max(durationInFrames, 30 * 15)],
      direction === 0 ? [value - 50, value + 50] : [value + 50, value - 50],
    )
  const backgroundImage = Array.from(Array(rand.intBetween(4, 10)))
    .map((_, index) => {
      const x = inter(rand.intBetween(0, 100), index % 2)
      const y = inter(rand.intBetween(0, 100), index % 2)
      const h = rand.intBetween(0, 360)
      const s = rand.intBetween(85, 95)
      const l = rand.intBetween(50, 70)
      return `radial-gradient(at ${x}% ${y}%, hsla(${h}, ${s}%, ${l}%, 1) 0, hsla(${h}, ${s}%, ${l}%, 0) 50%)`
    })
    .join(',')
  const r = rand.intBetween(0, 255)
  const g = rand.intBetween(0, 255)
  const b = rand.intBetween(0, 255)
  const backgroundColor = `rgb(${r}, ${g}, ${b})`
  return { backgroundColor, backgroundImage }
}
