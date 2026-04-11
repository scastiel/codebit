'use client'
import { CreateSnippetButton } from '@/app/my/snippets/create-snippet-button'
import { SnippetList } from '@/app/my/snippets/snippet-list'
import {
  StoredSnippet,
  createTutorialSnippet,
  deleteSnippet,
  listSnippets,
} from '@/lib/snippet-storage'
import { useEffect, useState } from 'react'

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<StoredSnippet[] | null>(null)

  useEffect(() => {
    let all = listSnippets()
    if (all.length === 0) {
      createTutorialSnippet()
      all = listSnippets()
    }
    setSnippets(all)
  }, [])

  const handleDelete = (slug: string) => {
    deleteSnippet(slug)
    setSnippets(listSnippets())
  }

  if (snippets === null) return null

  return (
    <div className="p-4 flex flex-col gap-4 max-w-screen-lg mx-auto">
      <SnippetList snippets={snippets} onDelete={handleDelete}>
        <CreateSnippetButton />
      </SnippetList>
    </div>
  )
}
