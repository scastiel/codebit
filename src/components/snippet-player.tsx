'use client'
import {
  CodeVideo,
  CodeVideoOptions,
} from '@/components/remotion/code-composition'
import {
  compositionDurationInFrames,
  getCompositionData,
} from '@/components/remotion/composition-data'
import { Player } from '@remotion/player'

export function SnippetPlayer({
  options,
  width,
  height,
  autoPlay = false,
  loop = false,
  controls = true,
}: {
  options: CodeVideoOptions
  width: number
  height: number
  autoPlay?: boolean
  loop?: boolean
  controls?: boolean
}) {
  const compositionData = getCompositionData(options)
  const fps = 30
  const durationInFrames = Math.min(
    (options.maxDurationInSeconds ?? Infinity) * fps,
    compositionDurationInFrames(compositionData),
  )
  return (
    <Player
      component={CodeVideo}
      inputProps={{ options }}
      durationInFrames={durationInFrames}
      compositionWidth={width}
      compositionHeight={height}
      fps={fps}
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
