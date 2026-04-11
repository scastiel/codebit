'use client'
import {
  CodeVideo,
  CodeVideoOptions,
} from '@/components/remotion/code-composition'
import {
  compositionDurationInFrames,
  getCompositionData,
} from '@/components/remotion/composition-data'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { applyCanvasFontStretchShim } from '@/lib/canvas-shim'
import { renderMediaOnWeb } from '@remotion/web-renderer'
import { Download, FileVideo, Loader2 } from 'lucide-react'
import { usePlausible } from 'next-plausible'
import { useState } from 'react'

type Props = {
  options: CodeVideoOptions
  snippetSlug: string
  save: () => Promise<void>
}

type Status = 'idle' | 'rendering' | 'done' | 'error'

export function GenerateButton({
  options,
  snippetSlug,
  save,
}: Props): JSX.Element {
  const [status, setStatus] = useState<Status>('idle')
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()
  const plausible = usePlausible()

  const generate = async () => {
    try {
      setStatus('rendering')
      setProgress(0)
      plausible('Snippet: Generate video')
      applyCanvasFontStretchShim()
      await save()
      const renderOptions = { ...options, fontSize: 0.02 * 1920 }
      const compositionData = getCompositionData(renderOptions)
      const durationInFrames = compositionDurationInFrames(compositionData)
      const { getBlob } = await renderMediaOnWeb({
        composition: {
          id: 'Code',
          component: CodeVideo,
          durationInFrames,
          fps: 30,
          width: 1920,
          height: 1080,
          defaultProps: { options: renderOptions },
        },
        inputProps: { options: renderOptions },
        videoCodec: 'h264',
        muted: true,
        licenseKey: 'free-license',
        onProgress: (arg: any) =>
          setProgress(
            typeof arg === 'number' ? arg : (arg?.progress ?? 0),
          ),
      })
      const blob = await getBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${snippetSlug}.mp4`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setStatus('done')
      toast({
        title: 'Video downloaded',
        description: `${snippetSlug}.mp4`,
      })
    } catch (err) {
      console.error(err)
      setStatus('error')
      toast({
        title: 'Video generation failed',
        description: err instanceof Error ? err.message : String(err),
      })
    }
  }

  if (status === 'rendering') {
    return (
      <Button disabled variant="secondary" className="flex gap-2">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        {Math.round(progress * 100)}%
      </Button>
    )
  }

  return (
    <Button variant="secondary" onClick={generate}>
      {status === 'done' ? (
        <Download className="mr-2 h-4 w-4" />
      ) : (
        <FileVideo className="mr-2 h-4 w-4" />
      )}
      MP4
    </Button>
  )
}
