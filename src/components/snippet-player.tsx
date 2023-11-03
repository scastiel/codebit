'use client'
import {
  CodeVideo,
  snippetDurationInFrames,
} from '@/components/remotion/code-composition'
import { Player } from '@remotion/player'

export function SnippetPlayer({
  markdown,
  width,
  height,
  fontSize,
  autoPlay = false,
  loop = false,
  controls = true,
  watermark = true,
}: {
  markdown: string
  width: number
  height: number
  fontSize?: number
  autoPlay?: boolean
  loop?: boolean
  controls?: boolean
  watermark?: boolean
}) {
  const framesBetweenSteps = 10
  const framesAtStart = 20
  const framesAtEnd = 30

  return (
    <Player
      component={CodeVideo}
      inputProps={{
        markdown,
        framesBetweenSteps,
        framesAtStart,
        framesAtEnd,
        fontSize: fontSize ?? 16,
        watermark,
      }}
      durationInFrames={snippetDurationInFrames(
        markdown,
        framesBetweenSteps,
        framesAtStart,
        framesAtEnd,
      )}
      compositionWidth={width}
      compositionHeight={height}
      fps={30}
      style={{ width, height }}
      loop={loop}
      clickToPlay={false}
      autoPlay={autoPlay}
      controls={controls}
      allowFullscreen={false}
      moveToBeginningWhenEnded={false}
      showVolumeControls={false}
    />
  )
}
