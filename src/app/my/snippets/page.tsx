import { SnippetList } from '@/app/my/snippets/snippet-list'
import { Button } from '@/components/ui/button'
import { env } from '@/lib/env'
import {
  createSnippet,
  createTutorialSnippet,
  getSnippets,
} from '@/lib/snippet'
import { getCurrentUser, getCurrentUserOrRedirect } from '@/lib/user'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

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
      {snippets.length > 0 ? (
        <>
          <form action={createSnippetAction}>
            <Button type="submit">Create snippet</Button>
          </form>
          <SnippetList snippets={snippets} />
        </>
      ) : (
        <div className="text-center h-72 flex flex-col justify-center gap-8">
          <p>You don’t have any snippet yet.</p>
          <form action={createSnippetAction}>
            <Button type="submit">Create your first one</Button>
          </form>
        </div>
      )}
    </div>
  )
}

async function createSnippetAction() {
  'use server'
  const user = await getCurrentUser()
  const snippet = await createSnippet(user)
  redirect(`/my/snippets/${snippet.slug}`)
}
