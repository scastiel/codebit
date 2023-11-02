'use client'
import { Button } from '@/components/ui/button'
import { Download, FileVideo, Loader } from 'lucide-react'
import Link from 'next/link'
import { ReactNode, useEffect, useState } from 'react'
import useSWR from 'swr'

type Props = {
  initialRenderId: string | null
  snippetId: string
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
  snippetId,
}: Props): JSX.Element {
  const [renderId, setRenderId] = useState(initialRenderId)

  const { data, error, isLoading } = useSWR(
    renderId ? `/my/renders/${renderId}/status` : '',
    fetcher,
    { refreshInterval: 5000, refreshWhenHidden: true },
  )

  const [status, setStatus] = useState<Status>(
    getStatus(isLoading, error, data),
  )

  useEffect(() => {
    setStatus(getStatus(isLoading, error, data))
  }, [isLoading, error, data])

  const GenerateButton = ({ children }: { children: ReactNode }) => (
    <Button
      variant="secondary"
      onClick={async () => {
        setStatus('starting')
        fetch(`/api/renders?snippetId=${snippetId}`, { method: 'POST' })
          .then((res) => res.json())
          .then(({ renderId }) => setRenderId(renderId))
        setRenderId(renderId)
      }}
      className="flex gap-2"
    >
      <FileVideo className="w-4 h-4" />
      <span>{children}</span>
    </Button>
  )

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
          <GenerateButton>Re-generate video</GenerateButton>
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

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json())

function LoadingButton({ children }: { children: ReactNode }) {
  return (
    <Button disabled variant="secondary" className="flex gap-2">
      <Loader className="w-4 h-4 animate-spin" />
      <span>{children}</span>
    </Button>
  )
}
