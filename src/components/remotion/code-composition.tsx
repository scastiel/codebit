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
  fontSize,
  watermark = true,
}: {
  markdown: string
  framesBetweenSteps: number
  fontSize: number
  watermark?: boolean
}) {
  const { metadata, steps } = getCodeFragments(markdown)
  const sequences = [
    <Sequence durationInFrames={framesBetweenSteps} layout="none" key={-1}>
      <CodeSequence
        diff={diffCode(steps[0].code, steps[0].code)}
        fontSize={fontSize}
        lang={steps[0].lang}
      />
    </Sequence>,
  ]
  let from = framesBetweenSteps
  for (let i = 0; i < steps.length - 1; i++) {
    const diff = diffCode(steps[i].code, steps[i + 1].code)
    const duration = durationInFramesForDiff(diff) + framesBetweenSteps
    sequences.push(
      <Sequence durationInFrames={duration} from={from} key={i} layout="none">
        <CodeSequence diff={diff} fontSize={fontSize} lang={steps[0].lang} />
      </Sequence>,
    )
    from += duration
  }

  return (
    <AbsoluteFill className={`root ${metadata.theme}`}>
      {metadata.theme === 'dark' ? (
        <link href={staticFile('themes/github-dark.css')} rel="stylesheet" />
      ) : (
        <link href={staticFile('themes/github.css')} rel="stylesheet" />
      )}
      <div className="code-wrapper" style={{ fontSize }}>
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
        <p className="watermark" style={{ fontSize }}>
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

function CodeSequence({
  diff,
  fontSize,
  lang,
}: {
  diff: Change[]
  fontSize: number
  lang: string
}) {
  const frame = useCurrentFrame()

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

  return <Highlight className={`language-${lang}`}>{codeToDisplay}</Highlight>
}

export function CodeComposition() {
  return (
    <Composition
      id="Code"
      component={CodeVideo}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        markdown: input,
        framesBetweenSteps: 10,
        fontSize: 32,
      }}
      calculateMetadata={async ({
        props: { markdown },
        defaultProps: { framesBetweenSteps },
      }) => {
        return {
          durationInFrames: snippetDurationInFrames(
            markdown,
            framesBetweenSteps,
          ),
        }
      }}
    />
  )
}

export function snippetDurationInFrames(
  markdown: string,
  framesBetweenSteps: number,
) {
  const { steps } = getCodeFragments(markdown)
  let duration = framesBetweenSteps
  for (let i = 0; i < steps.length - 1; i++) {
    const diff = diffCode(steps[i].code, steps[i + 1].code)
    duration += durationInFramesForDiff(diff) + framesBetweenSteps
  }
  return duration
}
