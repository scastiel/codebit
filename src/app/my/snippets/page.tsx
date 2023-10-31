import { Button } from '@/components/ui/button'
import { env } from '@/lib/env'
import { createSnippet, getSnippets } from '@/lib/snippet'
import { getCurrentUser, getCurrentUserOrRedirect } from '@/lib/user'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'My snippets',
}

export default async function SnippetsPage() {
  const user = await getCurrentUserOrRedirect(
    `${env.NEXT_PUBLIC_BASE_URL}/my/snippets`,
  )
  const snippets = await getSnippets(user)

  return (
    <div className="p-4 flex flex-col gap-4">
      <form action={createSnippetAction}>
        <Button type="submit">Create snippet</Button>
      </form>
      <ul className="flex flex-col gap-2 justify-stretch">
        {snippets.map((snippet) => (
          <li key={snippet.id}>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/my/snippets/${snippet.id}`}>{snippet.id}</Link>
            </Button>
          </li>
        ))}
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
