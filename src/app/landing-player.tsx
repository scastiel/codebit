'use client'
import { SnippetPlayer } from '@/components/snippet-player'
import { useIsBrowser } from '@/lib/hooks'
import { landingPageSnippet } from '@/lib/landing-page-snippet'
import useSize from '@react-hook/size'
import { useRef } from 'react'

export function LandingPlayer() {
  const playerRef = useRef<HTMLDivElement | null>(null)
  const [width, height] = useSize(playerRef)
  const browser = useIsBrowser()

  const fontSize = Math.min(Math.max(8, Math.min(0.02 * width, 16)))

  return (
    <div className="w-full max-w-2xl rounded-[10px] p-[2px] bg-gradient-to-b from-slate-100 to-slate-800">
      <div
        className="w-full h-full aspect-video overflow-hidden rounded-[8px]"
        ref={playerRef}
      >
        {browser && width > 0 && height > 0 && (
          <SnippetPlayer
            markdown={landingPageSnippet}
            width={width}
            height={height}
            fontSize={fontSize}
            autoMode
            watermark={false}
          />
        )}
      </div>
    </div>
  )
}
