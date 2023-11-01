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
}: {
  snippet: Snippet
  width: number
  height: number
}) {
  const framesBetweenSteps = 10

  return (
    <Player
      component={CodeVideo}
      inputProps={{
        markdown: snippet.content,
        framesBetweenSteps,
        fontSize: 16,
      }}
      durationInFrames={snippetDurationInFrames(
        snippet.content,
        framesBetweenSteps,
      )}
      compositionWidth={width}
      compositionHeight={height}
      fps={30}
      style={{ width, height }}
      loop={false}
      clickToPlay={false}
      controls
      allowFullscreen={false}
      moveToBeginningWhenEnded={false}
      showVolumeControls={false}
    />
  )
}
