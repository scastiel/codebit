import randomSeed from 'random-seed'

export function gradientCssFromSeed(seed: string) {
  const rand = randomSeed.create(seed)
  const grad = Array.from(Array(rand.intBetween(4, 10)))
    .map(() => {
      const x = rand.intBetween(0, 100)
      const y = rand.intBetween(0, 100)
      const h = rand.intBetween(0, 360)
      const s = rand.intBetween(85, 95)
      const l = rand.intBetween(50, 70)
      return `radial-gradient(at ${x}% ${y}%, hsla(${h}, ${s}%, ${l}%, 1) 0, hsla(${h}, ${s}%, ${l}%, 0) 50%)`
    })
    .join(',')
  const r = rand.intBetween(0, 255)
  const g = rand.intBetween(0, 255)
  const b = rand.intBetween(0, 255)
  const bgColor = `rgb(${r}, ${g}, ${b})`
  const css = `background-color: ${bgColor}; background-image: ${grad};`
  return css
}
