import randomSeed from 'random-seed'
import { CSSProperties } from 'react'
import { interpolate } from 'remotion'

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
