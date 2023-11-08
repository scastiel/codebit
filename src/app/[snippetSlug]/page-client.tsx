'use client'
import { useIsBrowser } from '@/lib/hooks'
import { Snippet } from '@prisma/client'
import { useWindowSize } from '@react-hook/window-size'
import { SnippetPlayer } from '../../components/snippet-player'

type Props = {
  snippet: Snippet
}

export function PublicSnippetPageClient({ snippet }: Props) {
  const [width, height] = useWindowSize()
  const browser = useIsBrowser()

  if (!browser) return null

  const fontSize = Math.min(
    Math.max(8, Math.min(0.02 * width, 16)),
    Math.max(8, Math.min(0.03 * height, 16)),
  )
  return (
    <SnippetPlayer
      options={{
        markdown: snippet.content,
        fontSize,
        watermark: { type: 'get-your-own' },
      }}
      width={width}
      height={height}
      autoPlay
      loop
    />
  )
}
