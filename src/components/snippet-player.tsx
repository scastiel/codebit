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
}: {
  snippet: Pick<Snippet, 'content'>
  width: number
  height: number
  fontSize?: number
}) {
  const framesBetweenSteps = 10

  return (
    <Player
      component={CodeVideo}
      inputProps={{
        markdown: snippet.content,
        framesBetweenSteps,
        fontSize: fontSize ?? 16,
        theme: 'dark',
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
