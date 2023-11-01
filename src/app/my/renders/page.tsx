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
          </TableRow>
        </TableHeader>
        <TableBody>
          {renders.map((render) => (
            <TableRow key={render.id}>
              <TableCell>{render.id}</TableCell>
              <TableCell>
                <Link href={`/my/snippets/${render.snippetId}`}>Snippet</Link>
              </TableCell>
              <TableCell>
                {render.error ? (
                  'Error'
                ) : render.done ? (
                  <Link
                    href={render.videoUrl!}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Done
                  </Link>
                ) : (
                  'In progress'
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
