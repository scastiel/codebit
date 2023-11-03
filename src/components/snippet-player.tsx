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
  autoMode,
  watermark,
}: {
  markdown: string
  width: number
  height: number
  fontSize?: number
  autoMode?: boolean
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
      loop={autoMode}
      clickToPlay={false}
      autoPlay={autoMode}
      controls={!autoMode}
      allowFullscreen={false}
      moveToBeginningWhenEnded={false}
      showVolumeControls={false}
    />
  )
}
