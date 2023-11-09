import { PublicSnippetPageClient } from '@/app/[snippetSlug]/page-client'
import { getPlan } from '@/lib/plans'
import { getSnippetById, getSnippetBySlug } from '@/lib/snippet'
import { getUserPlanId } from '@/lib/user'
import { notFound, redirect } from 'next/navigation'

export default async function PublicSnippetPage({
  params: { snippetSlug },
}: {
  params: { snippetSlug: string }
}) {
  const snippet = await getSnippetBySlug(snippetSlug)

  if (!snippet) {
    // legacy
    const snippetById = await getSnippetById(snippetSlug)
    if (snippetById) {
      redirect(`/${snippetById.slug}`)
    } else {
      notFound()
    }
  }

  const userPlan = getPlan(await getUserPlanId(snippet.userId))

  return <PublicSnippetPageClient snippet={snippet} plan={userPlan} />
}
