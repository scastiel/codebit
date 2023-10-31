import { Button } from '@/components/ui/button'
import { env } from '@/lib/env'
import { createSnippet, getSnippets } from '@/lib/snippet'
import { getCurrentUser, getCurrentUserOrRedirect } from '@/lib/user'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { SnippetListItem } from './snippet-list-item'

export const metadata: Metadata = {
  title: 'My snippets',
}

export default async function SnippetsPage() {
  const user = await getCurrentUserOrRedirect(
    `${env.NEXT_PUBLIC_BASE_URL}/my/snippets`,
  )
  const snippets = await getSnippets(user)

  return (
    <div className="p-4 flex flex-col gap-4 max-w-screen-lg mx-auto">
      <form action={createSnippetAction}>
        <Button type="submit">Create snippet</Button>
      </form>
      <ul className="grid grid-cols-1 flex-col gap-5 justify-stretch sm:grid-cols-2 md:grid-cols-3">
        {snippets.map((snippet) => {
          return (
            <li key={snippet.id}>
              <SnippetListItem snippet={snippet} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

async function createSnippetAction() {
  'use server'
  const user = await getCurrentUser()
  const snippet = await createSnippet(user)
  redirect(`/my/snippets/${snippet.id}`)
}
