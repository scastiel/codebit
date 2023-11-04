import { Code2 } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import Highlight from 'react-highlight'
import {
  AbsoluteFill,
  Composition,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion'
import { landingPageSnippet } from '../../lib/landing-page-snippet'
import {
  CompositionData,
  compositionDurationInFrames,
  getCompositionData,
} from './composition-data'
import { loadFonts } from './load-fonts'
import './style.css'

export function CodeVideo({
  framesAtStart,
  framesAtEnd,
  framesBetweenSteps,
  markdown,
  fontSize,
  watermark = true,
}: {
  framesBetweenSteps: number
  framesAtStart: number
  framesAtEnd: number
  markdown: string
  fontSize: number
  watermark?: boolean
}) {
  useEffect(() => {
    loadFonts()
  }, [])

  const { metadata, sequences } = useMemo(
    () =>
      getCompositionData({
        framesAtStart,
        framesAtEnd,
        framesBetweenSteps,
        markdown,
      }),
    [framesAtStart, framesAtEnd, framesBetweenSteps, markdown],
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
          <CodeSequences sequences={sequences} />
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

function CodeSequences({
  sequences: seqs,
}: {
  sequences: CompositionData['sequences']
}) {
  const sequences = seqs.map((seq, i) => (
    <Sequence
      durationInFrames={seq.durationInFrames}
      from={seq.from}
      layout="none"
      key={i}
    >
      <CodeSequence
        lang={seq.lang}
        codeForFrame={(frame) => seq.frames[frame]}
      />
    </Sequence>
  ))

  return <>{sequences}</>
}

function CodeSequence({
  lang,
  codeForFrame,
}: {
  lang: string
  codeForFrame: (frame: number) => string
}) {
  const frame = useCurrentFrame()
  const code = codeForFrame(frame)
  return <Highlight className={`language-${lang}`}>{code}</Highlight>
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
        fontSize: 24,
        framesAtStart: 20,
        framesAtEnd: 30,
        framesBetweenSteps: 10,
        markdown: landingPageSnippet,
      }}
      calculateMetadata={async ({
        props: { framesAtStart, framesAtEnd, framesBetweenSteps, markdown },
      }) => {
        const compositionData = getCompositionData({
          framesAtStart,
          framesAtEnd,
          framesBetweenSteps,
          markdown,
        })
        return {
          durationInFrames: compositionDurationInFrames(compositionData),
        }
      }}
    />
  )
}
