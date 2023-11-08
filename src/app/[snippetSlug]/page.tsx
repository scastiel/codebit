import { PublicSnippetPageClient } from '@/app/[snippetSlug]/page-client'
import { getSnippetBySlug } from '@/lib/snippet'
import { notFound } from 'next/navigation'

export default async function PublicSnippetPage({
  params: { snippetSlug },
}: {
  params: { snippetSlug: string }
}) {
  const snippet = await getSnippetBySlug(snippetSlug)
  if (!snippet) notFound()

  return <PublicSnippetPageClient snippet={snippet} />
}
