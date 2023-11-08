'use client'
import { CodeVideoOptions } from '@/components/remotion/code-composition'
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

  const options: CodeVideoOptions = {
    markdown: landingPageSnippet,
    fontSize,
    watermark: { type: 'none' },
  }

  return (
    <div className="w-full max-w-2xl rounded-[10px] p-[2px] bg-gradient-to-b from-slate-100 to-slate-800">
      <div
        className="w-full h-full aspect-video overflow-hidden rounded-[8px]"
        ref={playerRef}
      >
        {browser && width > 0 && height > 0 && (
          <SnippetPlayer
            options={options}
            width={width}
            height={height}
            autoPlay
            loop
            controls={false}
          />
        )}
      </div>
    </div>
  )
}
