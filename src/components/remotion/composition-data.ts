import { CodeVideoOptions } from '@/components/remotion/code-composition'
import { Change, diffChars } from 'diff'
import GraphemeSplitter from 'grapheme-splitter'
import randomSeed from 'random-seed'
import { parseSnippetMardown } from '../../lib/code-steps-utils'
import { jitterFrame, noJitterFrame } from '../../utils/jitter'

const splitter = new GraphemeSplitter()

export function getCompositionData({
  framesAtStart = 20,
  framesAtEnd = 30,
  framesBetweenSteps = 10,
  markdown,
}: CodeVideoOptions) {
  const { steps, metadata } = parseSnippetMardown(markdown)
  const rand = randomSeed.create(markdown)

  const sequences: {
    durationInFrames: number
    isTransition?: boolean
    transition?: string
    from?: number
    frames: string[]
    lang: string
    filename?: string
  }[] = []

  sequences.push({
    durationInFrames: framesAtStart,
    frames: Array.from(Array(framesAtStart)).map(() =>
      codeFromFrame(
        diffCode(steps[0]?.code ?? '', steps[0]?.code ?? ''),
        noJitterFrame(framesAtStart)[0],
      ),
    ),
    lang: steps[0]?.lang ?? '',
    filename: steps[0].filename,
  })

  const filenames: string[] = []

  let from = framesAtStart
  for (let i = 0; i < steps.length - 1; i++) {
    const prevFilename = steps[i].filename
    const filename = steps[i + 1].filename
    if (filename && !filenames.includes(filename)) filenames.push(filename)
    if (prevFilename && filename && prevFilename !== filename) {
      sequences.push({
        durationInFrames: framesAtEnd,
        from,
        frames: Array.from(Array(framesAtEnd)).map(() =>
          codeFromFrame(
            diffCode(steps[i]?.code ?? '', steps[i]?.code ?? ''),
            noJitterFrame(framesAtEnd)[0],
          ),
        ),
        lang: steps[i]?.lang ?? '',
        filename: steps[i].filename,
      })
      from += framesAtEnd
      sequences.push({
        durationInFrames: 20,
        isTransition: true,
        transition:
          filenames.indexOf(prevFilename) < filenames.indexOf(filename)
            ? 'from-right'
            : 'from-left',
        from,
        frames: Array.from(Array(20)).map(() =>
          codeFromFrame(
            diffCode(steps[i + 1]?.code ?? '', steps[i + 1]?.code ?? ''),
            noJitterFrame(20)[0],
          ),
        ),
        lang: steps[i + 1]?.lang ?? '',
        filename: steps[i + 1].filename,
      })
      from += 20
      sequences.push({
        durationInFrames: framesAtStart,
        from,
        frames: Array.from(Array(framesAtStart)).map(() =>
          codeFromFrame(
            diffCode(steps[i + 1]?.code ?? '', steps[i + 1]?.code ?? ''),
            noJitterFrame(framesAtStart)[0],
          ),
        ),
        lang: steps[i + 1]?.lang ?? '',
        filename: steps[i + 1].filename,
      })
      from += framesAtStart
    } else {
      const diff = diffCode(steps[i].code, steps[i + 1].code)
      const nbRealFrame = durationInFramesForDiff(diff)
      const jitteredFrame = jitterFrame(nbRealFrame, framesBetweenSteps, rand)
      const duration = jitteredFrame.length

      sequences.push({
        durationInFrames: duration,
        from,
        frames: Array.from(Array(duration)).map((_, frame) =>
          codeFromFrame(diff, jitteredFrame[frame]),
        ),
        lang: steps[i].lang,
        filename: steps[i].filename,
      })

      from += duration
    }
  }

  sequences.push({
    durationInFrames: framesAtEnd,
    from,
    frames: Array.from(Array(framesAtEnd)).map(() =>
      codeFromFrame(
        diffCode(
          steps[steps.length - 1]?.code ?? '',
          steps[steps.length - 1]?.code ?? '',
        ),
        noJitterFrame(framesAtEnd)[0],
      ),
    ),
    lang: steps[steps.length - 1]?.lang ?? '',
    filename: steps[steps.length - 1].filename,
  })

  return { sequences, metadata }
}

export type CompositionData = ReturnType<typeof getCompositionData>

function codeFromFrame(diff: Change[], frame: number) {
  let codeToDisplay = ''
  let currentChangeIndex = 0
  let i = 0
  while (true) {
    const change = diff[currentChangeIndex]
    if (change.added) {
      if (i > frame) {
        currentChangeIndex++
      } else if (i > frame - splitter.countGraphemes(change.value)) {
        codeToDisplay += splitter
          .splitGraphemes(change.value)
          .slice(0, frame - i)
          .join('')
        i = frame
        currentChangeIndex++
      } else {
        codeToDisplay += change.value
        currentChangeIndex++
        i += splitter.countGraphemes(change.value)
      }
    } else if (change.removed) {
      if (i > frame) {
        codeToDisplay += change.value
        currentChangeIndex++
      } else if (i > frame - splitter.countGraphemes(change.value)) {
        codeToDisplay += splitter
          .splitGraphemes(change.value)
          .slice(0, splitter.countGraphemes(change.value) - (frame - i))
          .join('')
        i = frame
        currentChangeIndex++
      } else {
        currentChangeIndex++
        i += splitter.countGraphemes(change.value)
      }
    } else {
      codeToDisplay += change.value
      currentChangeIndex++
    }

    if (currentChangeIndex === diff.length) {
      break
    }
  }
  return codeToDisplay
}

function diffCode(from: string, to: string) {
  const reverseString = (str: string) =>
    splitter.splitGraphemes(str).reverse().join('')
  return diffChars(`\n${reverseString(from)}\n`, `\n${reverseString(to)}\n`)
    .reverse()
    .map((change, index, arr) => {
      let value = reverseString(change.value)
      if (index === 0) value = value.replace(/^\n/, '')
      if (index === arr.length - 1) value = value.replace(/\n$/, '')
      return { ...change, value }
    })
}

function durationInFramesForDiff(diff: Change[]) {
  return diff
    .map((change) =>
      change.added || change.removed
        ? splitter.countGraphemes(change.value)
        : 0,
    )
    .reduce((a, b) => a + b, 0)
}

export function compositionDurationInFrames({ sequences }: CompositionData) {
  if (sequences.length === 0) return 1
  return sequences.reduce(
    (sum, seq) => sum + (seq.isTransition ? 0 : seq.durationInFrames),
    0,
  )
}
