import { RandomSeed } from 'random-seed'

/* Those 2 hardcoded values could be dynamically set depending on the step diff size in the future */
const JITTER_FRAME_COUNT = 2
const MAX_JITTER_PER_DIFF = 5

export const noJitterFrame = (maxFrameIdx: number) => {
  return Array.from({ length: maxFrameIdx }, (_, i) => i)
}
export const jitterFrame = (
  maxFrameIdx: number,
  framesBetweenSteps: number,
  rand: RandomSeed,
) => {
  const nbMaxJitter = maxFrameIdx / MAX_JITTER_PER_DIFF
  const nbJitter = Math.floor(rand.random() * nbMaxJitter)
  const jitterFrames = Array.from({ length: nbJitter }, () =>
    Math.floor(rand.random() * maxFrameIdx),
  )
  return buildJitter(maxFrameIdx, jitterFrames, framesBetweenSteps)
}

export const buildJitter = (
  maxFrameIdx: number,
  jitterFrames: number[],
  framesBetweenSteps: number,
) => {
  const allFrames = [
    ...Array.from({ length: maxFrameIdx }, (_, i) => i),
    ...Array.from({ length: JITTER_FRAME_COUNT }, () => jitterFrames).flat(),
  ]
  allFrames.sort((a, b) => a - b)
  for (let i = 0; i < framesBetweenSteps; i++) {
    allFrames.push(maxFrameIdx + i)
  }
  return allFrames
}
