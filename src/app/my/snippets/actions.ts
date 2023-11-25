'use server'
import { createSnippet } from '@/lib/snippet'
import { getCurrentUser } from '@/lib/user'
import { redirect } from 'next/navigation'

export async function createSnippetAction() {
  'use server'
  const user = await getCurrentUser()
  const snippet = await createSnippet(user)
  redirect(`/my/snippets/${snippet.slug}`)
}
