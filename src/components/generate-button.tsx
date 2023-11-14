'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { Download, FileVideo, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { ReactNode, useEffect, useState } from 'react'
import useSWR from 'swr'
import { z } from 'zod'

type Props = {
  initialRenderId: string | null
  snippetSlug: string
  userId: string
  save: () => Promise<void>
}

type Status =
  | 'no-render'
  | 'starting'
  | 'getting-status'
  | 'error-getting-status'
  | 'generation-done'
  | 'generation-error'
  | 'in-progress'

function getStatus(isLoading: boolean, error: boolean, data: any): Status {
  if (isLoading) return 'getting-status'
  if (error) return 'error-getting-status'
  if (!data) return 'no-render'
  if (data.done) return 'generation-done'
  if (data.error) return 'generation-error'
  return 'in-progress'
}

export function GenerateButton({
  initialRenderId,
  snippetSlug,
  userId,
  save,
}: Props): JSX.Element {
  const [renderId, setRenderId] = useState(initialRenderId)
  const [refreshTokenCredits, setRefreshTokenCredits] = useState(0)
  const {
    data: creditsData,
    error: creditsError,
    isLoading: creditsLoading,
  } = useSWR(
    [`/api/renders/credits`, [`credits-${userId}`], [refreshTokenCredits]],
    fetcher,
  )
  const remainingCredits: number | undefined =
    creditsData && (creditsData as any).credits

  const { data, error, isLoading } = useSWR(
    [renderId ? `/my/renders/${renderId}/status` : '', [], []],
    fetcher,
    { refreshInterval: 5000, refreshWhenHidden: true },
  )

  if (error) console.log(error)

  const [status, setStatus] = useState<Status>(
    getStatus(isLoading, error, data),
  )

  useEffect(() => {
    setStatus(getStatus(isLoading, error, data))
  }, [isLoading, error, data])

  const { toast } = useToast()

  const GenerateButton = ({ children }: { children: ReactNode }) => {
    if (remainingCredits === 0) {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">
              <FileVideo className="mr-2 h-4 w-4" />
              {children}
              {/* {remainingCredits !== undefined && (
                <Badge
                  variant="outline"
                  className="bg-slate-400 text-black ml-2"
                >
                  {remainingCredits} credits
                </Badge>
              )} */}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>No credits left</DialogTitle>
              <DialogDescription>
                You can’t generate new videos.
              </DialogDescription>
            </DialogHeader>
            <div>
              <p>
                You used all your render credits for this month. Maybe another
                plan would be a better fit for your needs?
              </p>
            </div>
            <DialogFooter>
              <Button asChild>
                <Link href="/my/plan">See plans</Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
    }

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">
            <FileVideo className="mr-2 h-4 w-4" />
            {children}
            {/* {remainingCredits !== undefined && (
              <Badge variant="outline" className="bg-slate-400 text-black ml-2">
                {remainingCredits} credits
              </Badge>
            )} */}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate video</DialogTitle>
            <DialogDescription>
              You currently have {remainingCredits} credit(s) available.
            </DialogDescription>
          </DialogHeader>
          <div>
            <p>
              Generating the video will consume <strong>1 credit</strong> from
              your balance.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => {
                setStatus('starting')
                save()
                  .then(() =>
                    fetch(`/api/renders?snippetSlug=${snippetSlug}`, {
                      method: 'POST',
                    }),
                  )
                  .then((res) => res.json())
                  .then((res) => {
                    const { renderId } = z
                      .object({ renderId: z.string() })
                      .parse(res)
                    setRenderId(renderId)
                    setRefreshTokenCredits((t) => t + 1)

                    toast({
                      title: 'Your video generation has started',
                      description:
                        'It can take a minute, but you can safely leave the page and come back to get the video when ready.',
                    })
                  })
              }}
            >
              Generate the video
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  switch (status) {
    case 'getting-status':
      return <LoadingButton>Getting generation status…</LoadingButton>
    case 'no-render':
      return <GenerateButton>Generate video</GenerateButton>
    case 'starting':
      return <LoadingButton>Starting generation…</LoadingButton>
    case 'error-getting-status':
      return (
        <>
          <GenerateButton>Generate video</GenerateButton>
          <p>Error getting generation status.</p>
        </>
      )
    case 'generation-error':
      return (
        <>
          <GenerateButton>Generate video</GenerateButton>
          <p>Error generating video.</p>
        </>
      )
    case 'generation-done':
      return (
        <>
          <GenerateButton>Regenerate video</GenerateButton>
          <Button asChild variant="secondary">
            <Link
              href={`/my/renders/${renderId}/download`}
              className="flex gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download video</span>
            </Link>
          </Button>
        </>
      )
    case 'starting':
      return <LoadingButton>Starting generation…</LoadingButton>
    case 'in-progress':
      return <LoadingButton>Generation in progress…</LoadingButton>
  }
}

const fetcher = ([url, tags, refresh]: [string, string[], any]) =>
  url ? fetch(url, { next: { tags } }).then((res) => res.json()) : null

function LoadingButton({ children }: { children: ReactNode }) {
  return (
    <Button disabled variant="secondary" className="flex gap-2">
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      {children}
    </Button>
  )
}
