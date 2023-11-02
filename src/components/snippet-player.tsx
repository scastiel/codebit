'use client'
import {
  CodeVideo,
  snippetDurationInFrames,
} from '@/components/remotion/code-composition'
import { Snippet } from '@prisma/client'
import { Player } from '@remotion/player'

export function SnippetPlayer({
  snippet,
  width,
  height,
  fontSize,
  autoMode,
  watermark,
}: {
  snippet: Pick<Snippet, 'content'>
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
        markdown: snippet.content,
        framesBetweenSteps,
        framesAtStart,
        framesAtEnd,
        fontSize: fontSize ?? 16,
        watermark,
      }}
      durationInFrames={snippetDurationInFrames(
        snippet.content,
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
