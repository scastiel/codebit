import { CreateSnippetButton } from '@/app/my/snippets/create-snippet-button'
import { SnippetList } from '@/app/my/snippets/snippet-list'
import { env } from '@/lib/env'
import { createTutorialSnippet, getSnippets } from '@/lib/snippet'
import { getCurrentUserOrRedirect } from '@/lib/user'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My snippets',
}

export default async function SnippetsPage() {
  const user = await getCurrentUserOrRedirect(
    `${env.NEXT_PUBLIC_BASE_URL}/my/snippets`,
  )
  let snippets = await getSnippets(user)
  if (snippets.length === 0) {
    snippets = [await createTutorialSnippet(user)]
  }

  return (
    <div className="p-4 flex flex-col gap-4 max-w-screen-lg mx-auto">
      <SnippetList snippets={snippets}>
        <CreateSnippetButton />
      </SnippetList>
    </div>
  )
}
