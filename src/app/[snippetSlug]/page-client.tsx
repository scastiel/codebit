'use client'
import { SnippetPlayer } from '@/components/snippet-player'
import { parseSnippetMardown } from '@/lib/code-steps-utils'
import { useIsBrowser } from '@/lib/hooks'
import { Plan } from '@/lib/plans'
import { Snippet } from '@prisma/client'
import { useWindowSize } from '@react-hook/window-size'

type Props = {
  snippet: Snippet
  plan: Plan
}

export function PublicSnippetPageClient({ snippet, plan }: Props) {
  const [width, height] = useWindowSize()
  const browser = useIsBrowser()

  if (!browser) return null

  const fontSize = Math.min(
    Math.max(8, Math.min(0.02 * width, 16)),
    Math.max(8, Math.min(0.03 * height, 16)),
  )

  const { metadata } = parseSnippetMardown(snippet.content)

  return (
    <SnippetPlayer
      options={{
        markdown: snippet.content,
        fontSize,
        watermark:
          plan.watermark || metadata.watermark
            ? { type: 'get-your-own' }
            : { type: 'none' },
        maxDurationInSeconds: plan.maxVideoDurationInSeconds,
        multiFile: plan.multiFile,
      }}
      width={width}
      height={height}
      autoPlay
      loop
    />
  )
}
