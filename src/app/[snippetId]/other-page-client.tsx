'use client'
import { Snippet } from '@prisma/client'
import { useWindowSize } from '@react-hook/window-size'
import { SnippetPlayer } from '../../components/snippet-player'

type Props = {
  snippet: Snippet
}

export function PublicSnippetPageClient({ snippet }: Props) {
  const [width, height] = useWindowSize()
  return <SnippetPlayer snippet={snippet} width={width} height={height} />
}
