'use client'
import { Snippet } from '@prisma/client'
import { useWindowSize } from '@react-hook/window-size'
import { useEffect, useState } from 'react'
import { SnippetPlayer } from '../../components/snippet-player'

type Props = {
  snippet: Snippet
}

export function PublicSnippetPageClient({ snippet }: Props) {
  const [width, height] = useWindowSize()
  const [browser, setBrowser] = useState(false)

  useEffect(() => setBrowser(true), [])

  if (!browser) return null

  const fontSize = Math.min(
    Math.max(8, Math.min(0.02 * width, 16)),
    Math.max(8, Math.min(0.03 * height, 16)),
  )
  return (
    <SnippetPlayer
      snippet={snippet}
      width={width}
      height={height}
      fontSize={fontSize}
    />
  )
}
