import { Change, diffWordsWithSpace } from 'diff'
import GraphemeSplitter from 'grapheme-splitter'
// import 'highlight.js/styles/github-dark.css'
import { Code2 } from 'lucide-react'
import Highlight from 'react-highlight'
import {
  AbsoluteFill,
  Composition,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion'
import { getCodeFragments } from '../../lib/code-steps-utils'
import { input } from '../../mocks/input'
import './style.css'
import { number } from 'zod'

const splitter = new GraphemeSplitter()

function diffCode(from: string, to: string) {
  const reverseString = (str: string) =>
    splitter.splitGraphemes(str).reverse().join('')
  return diffWordsWithSpace(
    `\n${reverseString(from)}\n`,
    `\n${reverseString(to)}\n`,
  )
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
  const sequences = [
    <Sequence durationInFrames={framesAtStart} layout="none" key={-1}>
      <CodeSequence
        diff={diffCode(steps[0].code, steps[0].code)}
        lang={steps[0].lang}
        fontSize={fontSize}
        jitterFrame={Array.from({ length: framesAtStart }, (_, i) => i + 1)}
      />
    </Sequence>,
  ]
  let from = framesAtStart
  console.log(steps.length);
  for (let i = 0; i < steps.length - 1; i++) {
    const diff = diffCode(steps[i].code, steps[i + 1].code)
    const nbRealFrame = durationInFramesForDiff(diff)
    console.log('real frame', nbRealFrame);
    const jitteredFrame = jitterFrame(nbRealFrame, 5, framesBetweenSteps)
    const duration = jitteredFrame.length
    console.log('jittered duration', duration)
    sequences.push(
      <Sequence durationInFrames={duration} from={from} key={i} layout="none">
        <CodeSequence
          diff={diff}
          fontSize={fontSize}
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
        fontSize={fontSize}
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
            href="https://codevideo.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Code2 /> <span>CodeBit.xyz</span>
          </a>
        </p>
      )}
    </AbsoluteFill>
  )
}

function durationInFramesForDiff(diff: Change[]) {
  return diff
    .map((change) => (change.added || change.removed ? change.value.length : 0))
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
      } else if (i > frame - change.value.length) {
        codeToDisplay += change.value.slice(0, frame - i)
        i = frame
        currentChangeIndex++
      } else {
        codeToDisplay += change.value
        currentChangeIndex++
        i += change.value.length
      }
    } else if (change.removed) {
      if (i > frame) {
        codeToDisplay += change.value
        currentChangeIndex++
      } else if (i > frame - change.value.length) {
        codeToDisplay += change.value.slice(
          0,
          change.value.length - (frame - i),
        )
        i = frame
        currentChangeIndex++
      } else {
        currentChangeIndex++
        i += change.value.length
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
  fontSize,
  lang,
  jitterFrame,
}: {
  diff: Change[]
  fontSize: number
  lang: string
  jitterFrame: number[]
}) {
  const frame = useCurrentFrame()
  const codeToDisplay = codeFromFrame(diff, jitterFrame[frame])
  return <Highlight className={`language-${lang}`}>{codeToDisplay}</Highlight>
}

const jitterFrame = (
  maxFrameIdx: number,
  jitterFrameCount: number,
  framesBetweenSteps: number,
) => {
  let jitteredFrame: number[] = []
  if (maxFrameIdx > 30) {
    jitteredFrame = [10, 20, 25]
  }
  
  const allFrames = Array.from({ length: maxFrameIdx }, (_, i) => i + 1)
  for (let i = 0; i < jitterFrameCount; i++) {
    allFrames.push(...jitteredFrame)
  }

  allFrames.sort((a, b) => a - b)
  for (let i = 0; i < framesBetweenSteps; i++) {
    allFrames.push(maxFrameIdx + i)
  }

  return allFrames
}

export function CodeComposition() {
  console.log('----> im code composition');
  return (
    <Composition
      id="Code"
      component={CodeVideo}
      fps={30}
      width={1280}
      height={720}
      defaultProps={{
        markdown: input,
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
  const { steps } = getCodeFragments(markdown)
  let duration = framesAtStart
  for (let i = 0; i < steps.length - 1; i++) {
    const diff = diffCode(steps[i].code, steps[i + 1].code)
    duration +=
      durationInFramesForDiff(diff) +
      (i < steps.length - 2 ? framesBetweenSteps : 0)
  }
  duration += framesAtEnd
  return duration
}
