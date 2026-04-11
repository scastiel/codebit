'use client'
import { CodeVideoOptions } from '@/components/remotion/code-composition'
import { SnippetPlayer } from '@/components/snippet-player'
import { SnippetSettingsToolbar } from '@/components/snippet-settings-toolbar'
import { useIsBrowser } from '@/lib/hooks'
import { landingPageSnippet } from '@/lib/landing-page-snippet'
import { metadataSchema } from '@/lib/types'
import useSize from '@react-hook/size'
import fm from 'front-matter'
import { useRef, useState } from 'react'
import yaml from 'yaml'

export function LandingPlayer() {
  const playerRef = useRef<HTMLDivElement | null>(null)
  const [width, height] = useSize(playerRef)
  const browser = useIsBrowser()

  const fontSize = Math.min(Math.max(8, Math.min(0.02 * width, 16)))

  const { attributes, body } = fm(landingPageSnippet)
  const [metadata, setMetadata] = useState(metadataSchema.parse(attributes))

  const options: CodeVideoOptions = {
    markdown: `---\n${yaml.stringify(metadata)}---\n\n${body}`,
    fontSize,
    watermark: metadata.watermark ? { type: 'get-your-own' } : { type: 'none' },
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full rounded-[10px] p-[2px] bg-gradient-to-b from-slate-100 to-slate-800">
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
      <SnippetSettingsToolbar metadata={metadata} setMetadata={setMetadata} />
    </div>
  )
}
