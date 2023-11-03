import { SnippetList } from '@/app/my/snippets/snippet-list'
import { Button } from '@/components/ui/button'
import { env } from '@/lib/env'
import { createSnippet, getSnippets } from '@/lib/snippet'
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
  console.time('getSnippets')
  const snippets = await getSnippets(user)
  console.timeEnd('getSnippets')

  return (
    <div className="p-4 flex flex-col gap-4 max-w-screen-lg mx-auto">
      <form action={createSnippetAction}>
        <Button type="submit">Create snippet</Button>
      </form>
      <SnippetList snippets={snippets} />
    </div>
  )
}

async function createSnippetAction() {
  'use server'
  const user = await getCurrentUser()
  const snippet = await createSnippet(user)
  redirect(`/my/snippets/${snippet.id}`)
}
