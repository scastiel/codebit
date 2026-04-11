'use client'
import {
  CodeVideo,
  CodeVideoOptions,
} from '@/components/remotion/code-composition'
import {
  compositionDurationInFrames,
  getCompositionData,
} from '@/components/remotion/composition-data'
import { Player, PlayerRef } from '@remotion/player'
import { useRef } from 'react'

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
  const durationInFrames = compositionDurationInFrames(compositionData)
  const playerRef = useRef<PlayerRef>(null)

  // useEffect(() => {
  //   playerRef.current?.seekTo(0)
  // }, [options])

  return (
    <Player
      ref={playerRef}
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
      acknowledgeRemotionLicense
    />
  )
}
