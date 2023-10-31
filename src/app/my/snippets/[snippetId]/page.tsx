import { CodeEditor } from '@/components/code-editor'
import { Button } from '@/components/ui/button'
import { env } from '@/lib/env'
import { getPrisma } from '@/lib/prisma'
import { getSnippet } from '@/lib/snippet'
import { getCurrentUser, getCurrentUserOrRedirect } from '@/lib/user'
import { ArrowLeft } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function SnippetPage({
  params: { snippetId },
}: {
  params: { snippetId: string }
}) {
  const user = await getCurrentUserOrRedirect(
    `${env.NEXT_PUBLIC_BASE_URL}/my/snippets/${snippetId}`,
  )
  const snippet = await getSnippet(snippetId)
  if (!snippet) notFound()
  if (snippet.userId !== user.id) {
    return <p>You are not authorized to edit this snippet.</p>
  }

  async function saveSnippetAction(content: string) {
    'use server'
    if (!snippet) throw new Error('Missing snippet')
    const user = await getCurrentUser()
    if (!user || user.id !== snippet.userId) throw new Error('Unauthorized')
    await getPrisma().snippet.update({
      where: { id: snippet.id },
      data: { content },
    })
    revalidatePath(`/my/snippets/${snippet.id}`)
  }

  return (
    <div className="flex flex-col">
      <div className="px-4">
        <Button variant="ghost" asChild>
          <Link href="/my/snippets">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to snippets</span>
          </Link>
        </Button>
      </div>
      <div className="flex-1 flex [&>div]:w-full">
        <CodeEditor
          snippetId={snippet.id}
          initialContent={snippet.content}
          saveSnippetAction={saveSnippetAction}
        />
      </div>
    </div>
  )
}
