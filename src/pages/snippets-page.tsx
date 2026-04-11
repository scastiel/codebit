import { CreateSnippetButton } from '@/components/create-snippet-button'
import { MyShell } from '@/components/my-shell'
import { SnippetList } from '@/components/snippet-list'
import {
  StoredSnippet,
  createTutorialSnippet,
  deleteSnippet,
  listSnippets,
} from '@/lib/snippet-storage'
import { useEffect, useState } from 'react'

export function SnippetsPage() {
  const [snippets, setSnippets] = useState<StoredSnippet[] | null>(null)

  useEffect(() => {
    document.title = 'My snippets – CodeBit'
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

  if (snippets === null) return <MyShell>{null}</MyShell>

  return (
    <MyShell>
      <div className="p-4 flex flex-col gap-4 max-w-screen-lg mx-auto">
        <SnippetList snippets={snippets} onDelete={handleDelete}>
          <CreateSnippetButton />
        </SnippetList>
      </div>
    </MyShell>
  )
}
