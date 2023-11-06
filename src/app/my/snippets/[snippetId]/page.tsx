import { SnippetClientPage } from '@/app/my/snippets/[snippetId]/page-client'
import { parseSnippetMardown } from '@/lib/code-steps-utils'
import { env } from '@/lib/env'
import { getPrisma } from '@/lib/prisma'
import { getLastRenderId } from '@/lib/render'
import { getSnippet } from '@/lib/snippet'
import { getCurrentUser, getCurrentUserOrRedirect } from '@/lib/user'
import { Metadata as NextMetadata } from 'next'
import { revalidatePath } from 'next/cache'
import { notFound } from 'next/navigation'

export const metadata: NextMetadata = {
  title: 'Edit snippet',
}

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
  const lastRenderId = await getLastRenderId(snippetId)

  async function saveSnippetAction(content: string) {
    'use server'
    const snippet = await getSnippet(snippetId)
    if (!snippet) throw new Error('Missing snippet')
    const user = await getCurrentUser()
    if (!user || user.id !== snippet.userId) throw new Error('Unauthorized')

    const { steps } = parseSnippetMardown(snippet.content)
    const lastStep = steps[steps.length - 1]

    await getPrisma().snippet.update({
      where: { id: snippet.id },
      data: { content, preview: lastStep?.code, previewLang: lastStep?.lang },
    })
    revalidatePath(`/my/snippets/${snippet.id}`)
    revalidatePath(`/${snippet.id}`)
  }

  return (
    <SnippetClientPage
      snippet={snippet}
      lastRenderId={lastRenderId}
      saveSnippetAction={saveSnippetAction}
    />
  )
}
