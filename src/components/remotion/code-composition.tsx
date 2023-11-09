import { useEffect, useMemo } from 'react'
import Highlight from 'react-highlight'
import {
  AbsoluteFill,
  Composition,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { gradientCssFromSeed } from '../../components/remotion/gradients'
import { landingPageSnippet } from '../../lib/landing-page-snippet'
import {
  CompositionData,
  compositionDurationInFrames,
  getCompositionData,
} from './composition-data'
import { loadFonts } from './load-fonts'
import './style.css'
import { WatermarkText } from './watermark-text'

export type Watermark =
  | { type: 'get-your-own' }
  | { type: 'url'; slug: string }
  | { type: 'none' }

export type CodeVideoOptions = {
  framesBetweenSteps?: number
  framesAtStart?: number
  framesAtEnd?: number
  markdown: string
  fontSize: number
  watermark: Watermark
}

export type CodeVideoProps = { options: CodeVideoOptions }

export function CodeVideo({ options }: CodeVideoProps) {
  useEffect(() => {
    loadFonts()
  }, [])

  const { fontSize, watermark } = options

  const { metadata, sequences } = useMemo(
    () => getCompositionData(options),
    [options],
  )

  const currentFrame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()

  const scale = interpolate(currentFrame, [0, durationInFrames], [93, 103])
  return (
    <AbsoluteFill className={`root ${metadata.theme}`} style={{ fontSize }}>
      {metadata.theme === 'dark' ? (
        <link href={staticFile('themes/github-dark.css')} rel="stylesheet" />
      ) : (
        <link href={staticFile('themes/github.css')} rel="stylesheet" />
      )}
      <style>{`.root { ${gradientCssFromSeed(
        String(metadata.background),
        currentFrame,
        durationInFrames,
      )} }`}</style>
      <div className="code-wrapper" style={{transform: `scale(${scale}%)`}}>
        <div className="code">
          <div className="window-buttons">
            <svg viewBox="0 0 450 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="50" fill="#fe5f57" />
              <circle cx="225" cy="50" r="50" fill="#ffbc2e" />
              <circle cx="400" cy="50" r="50" fill="#27cd41" />
            </svg>
          </div>
          <CodeSequences sequences={sequences} speed={metadata.speed} />
        </div>
        <WatermarkText watermark={watermark} />
      </div>
    </AbsoluteFill>
  )
}

function CodeSequences({
  sequences: seqs,
  speed,
}: {
  sequences: CompositionData['sequences']
  speed: number
}) {
  const sequences = seqs.map((seq, i) => {
    const durationInFrames =
      i < seqs.length - 1
        ? (seqs[i + 1].from ?? 0) - (seq.from ?? 0)
        : seq.durationInFrames
    return (
      <Sequence
        durationInFrames={durationInFrames / speed}
        from={(seq.from ?? 0) / speed}
        layout="none"
        key={i}
      >
        <CodeSequence
          lang={seq.lang}
          codeForFrame={(frame) => seq.frames[Math.floor(frame * speed)]}
        />
      </Sequence>
    )
  })

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
  const options: CodeVideoOptions = {
    fontSize: 24,
    markdown: landingPageSnippet,
    watermark: { type: 'get-your-own' },
  }
  return (
    <Composition
      id="Code"
      component={CodeVideo}
      fps={30}
      width={1280}
      height={720}
      defaultProps={{ options } as CodeVideoProps}
      calculateMetadata={async ({ props: { options } }) => {
        const compositionData = getCompositionData(options)
        return {
          durationInFrames: compositionDurationInFrames(compositionData),
        }
      }}
    />
  )
}
