import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { env } from '@/lib/env'
import { getRendersForUser } from '@/lib/render'
import { getCurrentUserOrRedirect } from '@/lib/user'
import { Bug, ExternalLink, Loader2 } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'My renders',
}

export default async function SnippetsPage() {
  const user = await getCurrentUserOrRedirect(
    `${env.NEXT_PUBLIC_BASE_URL}/my/renders`,
  )
  const renders = await getRendersForUser(user.id)

  return (
    <div className="p-4 flex flex-col gap-4 max-w-screen-lg mx-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Snippet</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Started at</TableHead>
            <TableHead>Finished at</TableHead>
            <TableHead>Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {renders.map((render) => (
            <TableRow key={render.id}>
              <TableCell>{render.id}</TableCell>
              <TableCell>
                <Link href={`/my/snippets/${render.snippet.slug}`}>
                  Snippet
                </Link>
              </TableCell>
              <TableCell>
                {render.error ? (
                  <Badge className="bg-red-300">
                    <Bug className="w-3 h-3 mr-1" />
                    Error
                  </Badge>
                ) : render.done ? (
                  <Link
                    href={render.videoUrl!}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <Badge className="bg-green-300">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Finished
                    </Badge>
                  </Link>
                ) : (
                  <Badge className="bg-orange-300">
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    In progress
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {render.startedAt.toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'medium',
                })}
              </TableCell>
              <TableCell>
                {render.endedAt?.toLocaleString('en-US', {
                  timeStyle: 'medium',
                })}
              </TableCell>
              <TableCell>
                {render.endedAt && (
                  <>
                    {Math.round(
                      (render.endedAt.valueOf() - render.startedAt.valueOf()) /
                        1000,
                    )?.toLocaleString('en-US', {})}{' '}
                    secs{' '}
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
