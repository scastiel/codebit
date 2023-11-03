import { Change, diffChars } from 'diff'
import GraphemeSplitter from 'grapheme-splitter'
import { Code2 } from 'lucide-react'
import createRandomSeed from 'random-seed'
import { useEffect } from 'react'
import Highlight from 'react-highlight'
import {
  AbsoluteFill,
  Composition,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion'
import { getCodeFragments } from '../../lib/code-steps-utils'
import { landingPageSnippet } from '../../lib/landing-page-snippet'
import { jitterFrame, noJitterFrame } from '../../utils/jitter'
import { loadFonts } from './load-fonts'
import './style.css'

const splitter = new GraphemeSplitter()

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

export function CodeVideo({
  markdown,
  framesBetweenSteps,
  framesAtStart,
  framesAtEnd,
  fontSize,
  watermark = true,
}: {
  markdown: string
  framesBetweenSteps: number
  framesAtStart: number
  framesAtEnd: number
  fontSize: number
  watermark?: boolean
}) {
  const { metadata, steps } = getCodeFragments(markdown)
  const rand = createRandomSeed.create(markdown)

  useEffect(() => {
    loadFonts()
  }, [])

  const sequences = [
    <Sequence durationInFrames={framesAtStart} layout="none" key={-1}>
      <CodeSequence
        diff={diffCode(steps[0].code, steps[0].code)}
        lang={steps[0].lang}
        jitterFrame={noJitterFrame(framesAtStart)}
      />
    </Sequence>,
  ]
  let from = framesAtStart

  for (let i = 0; i < steps.length - 1; i++) {
    const diff = diffCode(steps[i].code, steps[i + 1].code)
    const nbRealFrame = durationInFramesForDiff(diff)
    const jitteredFrame = jitterFrame(nbRealFrame, framesBetweenSteps, rand)
    const duration = jitteredFrame.length
    sequences.push(
      <Sequence durationInFrames={duration} from={from} key={i} layout="none">
        <CodeSequence
          diff={diff}
          lang={steps[0].lang}
          jitterFrame={jitteredFrame}
        />
      </Sequence>,
    )
    from += duration
  }
  sequences.push(
    <Sequence
      durationInFrames={framesAtEnd}
      from={from}
      layout="none"
      key={steps.length}
    >
      <CodeSequence
        diff={diffCode(
          steps[steps.length - 1].code,
          steps[steps.length - 1].code,
        )}
        lang={steps[steps.length - 1].lang}
        jitterFrame={[]}
      />
    </Sequence>,
  )

  return (
    <AbsoluteFill className={`root ${metadata.theme}`} style={{ fontSize }}>
      {metadata.theme === 'dark' ? (
        <link href={staticFile('themes/github-dark.css')} rel="stylesheet" />
      ) : (
        <link href={staticFile('themes/github.css')} rel="stylesheet" />
      )}
      <div className="code-wrapper">
        <div className="code">
          <div className="window-buttons">
            <svg viewBox="0 0 450 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="50" fill="#fe5f57" />
              <circle cx="225" cy="50" r="50" fill="#ffbc2e" />
              <circle cx="400" cy="50" r="50" fill="#27cd41" />
            </svg>
          </div>
          {sequences}
        </div>
      </div>
      {watermark && (
        <p className="watermark">
          Generated with
          <a
            href={process.env.NEXT_PUBLIC_BASE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Code2 /> <strong>CodeBit.xyz</strong>
          </a>
        </p>
      )}
    </AbsoluteFill>
  )
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

const codeFromFrame = (diff: Change[], frame: number) => {
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

function CodeSequence({
  diff,
  lang,
  jitterFrame,
}: {
  diff: Change[]
  lang: string
  jitterFrame: number[]
}) {
  const frame = useCurrentFrame()
  const codeToDisplay = codeFromFrame(diff, jitterFrame[frame])
  return <Highlight className={`language-${lang}`}>{codeToDisplay}</Highlight>
}

export function CodeComposition() {
  return (
    <Composition
      id="Code"
      component={CodeVideo}
      fps={30}
      width={1280}
      height={720}
      defaultProps={{
        markdown: landingPageSnippet,
        framesBetweenSteps: 10,
        framesAtStart: 20,
        framesAtEnd: 30,
        fontSize: 24,
      }}
      calculateMetadata={async ({
        props: { markdown },
        defaultProps: { framesBetweenSteps, framesAtStart, framesAtEnd },
      }) => {
        return {
          durationInFrames: snippetDurationInFrames(
            markdown,
            framesBetweenSteps,
            framesAtStart,
            framesAtEnd,
          ),
        }
      }}
    />
  )
}

export function snippetDurationInFrames(
  markdown: string,
  framesBetweenSteps: number,
  framesAtStart: number,
  framesAtEnd: number,
) {
  const rand = createRandomSeed.create(markdown)
  const { steps } = getCodeFragments(markdown)
  let duration = framesAtStart
  for (let i = 0; i < steps.length - 1; i++) {
    const diff = diffCode(steps[i].code, steps[i + 1].code)
    const nbRealFrame = durationInFramesForDiff(diff)
    const jitteredFrame = jitterFrame(nbRealFrame, framesBetweenSteps, rand)
    duration += jitteredFrame.length
  }
  duration += framesAtEnd
  return duration
}
