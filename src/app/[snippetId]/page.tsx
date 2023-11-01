import { PublicSnippetPageClient } from '@/app/[snippetId]/other-page-client'
import { getSnippet } from '@/lib/snippet'
import { notFound } from 'next/navigation'

export default async function PublicSnippetPage({
  params: { snippetId },
}: {
  params: { snippetId: string }
}) {
  const snippet = await getSnippet(snippetId)
  if (!snippet) notFound()

  return <PublicSnippetPageClient snippet={snippet} />
}
