import randomSeed from 'random-seed'
import { interpolate } from 'remotion'

export function gradientCssFromSeed(
  seed: string,
  frame: number,
  durationInFrames: number,
) {
  const rand = randomSeed.create(seed)
  const inter = (value: number, direction: number) =>
    interpolate(
      frame,
      [0, durationInFrames],
      direction === 0 ? [value - 50, value + 50] : [value + 50, value - 50],
    )
  const grad = Array.from(Array(rand.intBetween(4, 10)))
    .map((_, index) => {
      const x = inter(rand.intBetween(0, 100), index % 2)
      const y = inter(rand.intBetween(0, 100), index % 2)
      const h = rand.intBetween(0, 360)
      const s = rand.intBetween(85, 95)
      const l = rand.intBetween(50, 70)
      return `radial-gradient(in oklch at ${x}% ${y}%, hsla(${h}, ${s}%, ${l}%, 1) 0, hsla(${h}, ${s}%, ${l}%, 0) 50%)`
    })
    .join(',')
  const r = rand.intBetween(0, 255)
  const g = rand.intBetween(0, 255)
  const b = rand.intBetween(0, 255)
  const bgColor = `rgb(${r}, ${g}, ${b})`
  const css = `background-color: ${bgColor}; background-image: ${grad};`
  return css
}
