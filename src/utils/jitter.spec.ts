import { buildJitter, noJitterFrame } from './jitter' // Import the function from your code

describe('buildJitter', () => {
  it('should build the jittered frame array correctly', () => {
    const maxFrameIdx = 10
    const jitterFrames = [3, 7, 2]
    const framesBetweenSteps = 5

    const expected = [
      0, 1, 2, 2, 2, 3, 3, 3, 4, 5, 6, 7, 7, 7, 8, 9, 10, 11, 12, 13, 14,
    ]
    const result = buildJitter(maxFrameIdx, jitterFrames, framesBetweenSteps)

    expect(result).toEqual(expected)
  })
})

describe('noJitter', () => {
  it('should build not jitter the aray', () => {
    const expected = [0, 1, 2, 3]
    const result = noJitterFrame(4)
    expect(result).toEqual(expected)
  })
})
