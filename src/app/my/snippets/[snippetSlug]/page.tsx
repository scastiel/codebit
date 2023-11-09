import { parseSnippetMardown } from '@/lib/code-steps-utils'
import { env } from '@/lib/env'
import { getPrisma } from '@/lib/prisma'
import { getLastRenderId } from '@/lib/render'
import { getSnippetBySlug } from '@/lib/snippet'
import {
  getCurrentUser,
  getCurrentUserOrRedirect,
  getUserPlanId,
} from '@/lib/user'
import { Metadata as NextMetadata } from 'next'
import { revalidatePath } from 'next/cache'
import { notFound } from 'next/navigation'
import { SnippetClientPage } from './page-client'

export const metadata: NextMetadata = {
  title: 'Edit snippet',
}

export default async function SnippetPage({
  params: { snippetSlug },
}: {
  params: { snippetSlug: string }
}) {
  const user = await getCurrentUserOrRedirect(
    `${env.NEXT_PUBLIC_BASE_URL}/my/snippets/${snippetSlug}`,
  )
  const snippet = await getSnippetBySlug(snippetSlug)
  if (!snippet) notFound()
  if (snippet.userId !== user.id) {
    return <p>You are not authorized to edit this snippet.</p>
  }
  const lastRenderId = await getLastRenderId(snippetSlug)
  const planId = await getUserPlanId(user.id)

  async function saveSnippetAction(content: string) {
    'use server'
    const snippet = await getSnippetBySlug(snippetSlug)
    if (!snippet) throw new Error('Missing snippet')
    const user = await getCurrentUser()
    if (user.id !== snippet.userId) throw new Error('Unauthorized')

    const { steps } = parseSnippetMardown(snippet.content)
    const lastStep = steps[steps.length - 1]

    await getPrisma().snippet.update({
      where: { id: snippet.id },
      data: { content, preview: lastStep?.code, previewLang: lastStep?.lang },
    })
    revalidatePath(`/my/snippets/${snippet.slug}`)
    revalidatePath(`/${snippet.slug}`)
  }

  return (
    <SnippetClientPage
      snippet={snippet}
      lastRenderId={lastRenderId}
      saveSnippetAction={saveSnippetAction}
      planId={planId}
    />
  )
}
