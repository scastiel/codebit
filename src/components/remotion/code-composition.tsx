import { TransitionSeries, linearTiming } from '@remotion/transitions'
import { slide } from '@remotion/transitions/slide'
import { Fragment, useEffect, useMemo } from 'react'
import Highlight from 'react-highlight'
import {
  AbsoluteFill,
  Composition,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { GradientCanvas } from '../../components/remotion/gradient-canvas'
import { fonts } from '../../components/remotion/themes'
import { WatermarkText } from '../../components/remotion/watermark-text'
import { landingPageSnippet } from '../../lib/landing-page-snippet'
import { cn } from '../../lib/utils'
import {
  CompositionData,
  compositionDurationInFrames,
  getCompositionData,
} from './composition-data'
import { loadFonts } from './load-fonts'
import './style.css'

export type Watermark =
  | { type: 'get-your-own' }
  | { type: 'url'; slug: string }
  | { type: 'none' }

export type CodeVideoOptions = {
  seed?: string
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

  const scale = metadata.zooming
    ? interpolate(currentFrame, [0, durationInFrames], [93, 103])
    : 100
  return (
    <AbsoluteFill className="root" style={{ fontSize }}>
      <GradientCanvas
        seed={metadata.background}
        animated={metadata.animatedBackground}
      />
      <link
        href={staticFile(`themes/${metadata.highlightTheme}.min.css`)}
        rel="stylesheet"
      />

      <style>{`
        ${Object.keys(fonts)
          .map((fontName) => `.font-${fontName} { font-family: '${fontName}' }`)
          .join('\n')}
      `}</style>

      <CodeSequences
        sequences={sequences}
        speed={metadata.speed}
        watermark={watermark}
        scale={scale}
        font={metadata.font}
      />
    </AbsoluteFill>
  )
}

function WindowHeader({
  filename,
  filenames,
}: {
  filename: string | undefined
  filenames: string[]
}) {
  return (
    <div className="window-buttons">
      <svg viewBox="0 0 450 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#fe5f57" />
        <circle cx="225" cy="50" r="50" fill="#ffbc2e" />
        <circle cx="400" cy="50" r="50" fill="#27cd41" />
      </svg>
      <div className="tabs">
        {filenames.map((f, index) => (
          <span
            key={index}
            className={cn('tab', f === filename && 'tab-active')}
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  )
}

function CodeSequences({
  sequences: seqs,
  speed,
  watermark,
  scale,
  font,
}: {
  sequences: CompositionData['sequences']
  speed: number
  watermark: Watermark
  scale: number
  font: string
}) {
  const filenames = Array.from(
    new Set(seqs.map((seq) => seq.filename).filter(Boolean)).values(),
  )
  const sequences = seqs.map((seq, i) => {
    return (
      <Fragment key={i}>
        {seq.isTransition && (
          <TransitionSeries.Transition
            presentation={slide({
              direction:
                seq.transition === 'from-left' ? 'from-left' : 'from-right',
            })}
            timing={linearTiming({ durationInFrames: seq.durationInFrames })}
            key={`trans-${i}`}
          />
        )}
        <TransitionSeries.Sequence
          durationInFrames={seq.durationInFrames}
          layout="none"
          key={`seq-${i}`}
        >
          <CodeSequence
            lang={seq.lang}
            filename={seq.filename}
            filenames={filenames}
            codeForFrame={(frame) => {
              const effectiveSpeed = seq.isTransition ? 1 : speed
              const index = Math.min(
                Math.floor(frame * effectiveSpeed),
                seq.frames.length - 1,
              )
              return seq.frames[index]
            }}
            watermark={watermark}
            scale={scale}
            font={font}
          />
        </TransitionSeries.Sequence>
      </Fragment>
    )
  })

  return <TransitionSeries>{sequences}</TransitionSeries>
}

function CodeSequence({
  lang,
  codeForFrame,
  filename,
  filenames,
  watermark,
  scale,
  font,
}: {
  lang: string
  filename?: string
  filenames: string[]
  codeForFrame: (frame: number) => string
  watermark: Watermark
  scale: number
  font: string
}) {
  const frame = useCurrentFrame()
  const code = codeForFrame(frame)
  return (
    <div className="code-wrapper" style={{ transform: `scale(${scale}%)` }}>
      <div className="code">
        <WindowHeader filename={filename} filenames={filenames} />
        <Highlight className={`language-${lang} font-${font}`}>
          {code}
        </Highlight>
      </div>
      <WatermarkText watermark={watermark} />
    </div>
  )
}

export function CodeComposition() {
  const options: CodeVideoOptions = {
    fontSize: 24,
    //     markdown: `
    // \`\`\`ts
    // console.log("First line")
    // console.log("Second line")
    // //aaa
    // console.log("Hello?")
    // //bbb
    // console.log("Ante-last line")
    // console.log("Last line")

    // \`\`\`

    // ---

    // \`\`\`ts
    // console.log("First line")
    // console.log("Line between")
    // console.log("Second line")
    // //aaa
    // console.log("Good bye!")
    // //bbb
    // console.log("Ante-last line")

    // \`\`\`
    //     `,
    //     markdown: `
    // \`\`\`ts filename="hello.ts"
    // console.log("Hello World!")
    // \`\`\`

    // ---

    // \`\`\`ts filename="hello.ts"
    // console.log("")
    // \`\`\`
    //     `,
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
