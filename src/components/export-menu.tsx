'use client'
import { DialogItem } from '@/components/dialog-item'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import {
  AlertTriangle,
  ChevronDown,
  Download,
  ExternalLink,
  FileVideo,
  Loader2,
} from 'lucide-react'
import { usePlausible } from 'next-plausible'
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

export function ExportMenu({
  initialRenderId,
  snippetSlug,
  userId,
  save,
}: Props) {
  const {
    remainingCredits,
    renderId,
    setRenderId,
    status,
    setStatus,
    setRefreshTokenCredits,
  } = useGenerationData(userId, initialRenderId)

  const { toast } = useToast()
  const plausible = usePlausible()

  const generate = () => {
    setStatus('starting')
    plausible('Snippet: Generate video', { props: { userId } })
    save()
      .then(() =>
        fetch(`/api/renders?snippetSlug=${snippetSlug}`, {
          method: 'POST',
        }),
      )
      .then((res) => res.json())
      .then((res) => {
        const { renderId } = z.object({ renderId: z.string() }).parse(res)
        setRenderId(renderId)
        setRefreshTokenCredits((t) => t + 1)

        toast({
          title: 'Your video generation has started',
          description:
            'It can take a minute, but you can safely leave the page and come back to get the video when ready.',
        })
      })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          {status === 'in-progress' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <FileVideo className="mr-2 w-4 h-4" />
          )}
          Export
          <ChevronDown className="ml-2 w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Export video</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <GenerateMenuItems
          status={status}
          renderId={renderId}
          remainingCredits={remainingCredits}
          generate={generate}
        />
        <DropdownMenuItem asChild>
          <Link
            href={`/${snippetSlug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Share as webpage
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function useGenerationData(userId: string, initialRenderId: string | null) {
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

  return {
    remainingCredits,
    renderId,
    setRenderId,
    status,
    setStatus,
    setRefreshTokenCredits,
  }
}

function GenerateMenuItem({
  children,
  remainingCredits,
  generate,
}: {
  children: ReactNode
  remainingCredits: number | undefined
  generate: () => void
}) {
  if (remainingCredits === 0) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <DropdownMenuItem>
            <FileVideo className="mr-2 h-4 w-4" />
            {children}
          </DropdownMenuItem>
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
    <DialogItem
      triggerChildren={
        <>
          <FileVideo className="mr-2 h-4 w-4" />
          {children}
        </>
      }
    >
      <DialogHeader>
        <DialogTitle>Generate video</DialogTitle>
        <DialogDescription>
          You currently have {remainingCredits} credit(s) available.
        </DialogDescription>
      </DialogHeader>
      <div className="prose prose-invert">
        <p>
          Generating the video will consume <strong>1 credit</strong> from your
          balance. You will be able to download your video as MP4 in ~1 minute.
        </p>
        <p>
          <em>
            Note that <strong>you don’t need</strong> to generate the video to
            update the preview on the right.
          </em>
        </p>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Cancel</Button>
        </DialogClose>
        <Button onClick={generate}>Generate the video</Button>
      </DialogFooter>
    </DialogItem>
  )
}

export function GenerateMenuItems({
  status,
  renderId,
  remainingCredits,
  generate,
}: {
  status: Status
  renderId: string | null
  remainingCredits: number | undefined
  generate: () => void
}): JSX.Element {
  switch (status) {
    case 'getting-status':
      return <LoadingButton>Getting generation status…</LoadingButton>
    case 'no-render':
      return (
        <>
          <GenerateMenuItem
            remainingCredits={remainingCredits}
            generate={generate}
          >
            Generate MP4 video…
          </GenerateMenuItem>
          <DropdownMenuItem disabled>
            <Download className="w-4 h-4 mr-2" />
            Download generated MP4 video
          </DropdownMenuItem>
        </>
      )
    case 'starting':
      return <LoadingButton>Starting generation…</LoadingButton>
    case 'error-getting-status':
      return (
        <>
          <GenerateMenuItem
            remainingCredits={remainingCredits}
            generate={generate}
          >
            Generate MP4 video…
          </GenerateMenuItem>
          <DropdownMenuItem disabled>
            <AlertTriangle className="w-4 h-4 mr-2" />
            Error getting generation status
          </DropdownMenuItem>
        </>
      )
    case 'generation-error':
      return (
        <>
          <GenerateMenuItem
            remainingCredits={remainingCredits}
            generate={generate}
          >
            Generate MP4 video…
          </GenerateMenuItem>
          <DropdownMenuItem disabled>
            <AlertTriangle className="w-4 h-4 mr-2" />
            Error generating video
          </DropdownMenuItem>
        </>
      )
    case 'generation-done':
      return (
        <>
          <GenerateMenuItem
            remainingCredits={remainingCredits}
            generate={generate}
          >
            Generate MP4 video…
          </GenerateMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/my/renders/${renderId}/download`}>
              <Download className="w-4 h-4 mr-2" />
              Download generated MP4 video
            </Link>
          </DropdownMenuItem>
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
    <DropdownMenuItem disabled>
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      {children}
    </DropdownMenuItem>
  )
}
