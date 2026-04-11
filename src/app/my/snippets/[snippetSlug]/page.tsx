'use client'
import { CodeEditor } from '@/components/code-editor'
import { getSnippet, updateSnippet } from '@/lib/snippet-storage'
import { useEffect, useState } from 'react'

export default function SnippetPage({
  params: { snippetSlug },
}: {
  params: { snippetSlug: string }
}) {
  const [state, setState] = useState<
    { status: 'loading' } | { status: 'found'; content: string } | { status: 'not-found' }
  >({ status: 'loading' })

  useEffect(() => {
    const snippet = getSnippet(snippetSlug)
    setState(
      snippet
        ? { status: 'found', content: snippet.content }
        : { status: 'not-found' },
    )
  }, [snippetSlug])

  if (state.status === 'loading') return null
  if (state.status === 'not-found') {
    return <p className="p-4">Snippet not found.</p>
  }

  return (
    <div className="flex-1 flex [&>div]:w-full">
      <CodeEditor
        snippetSlug={snippetSlug}
        initialContent={state.content}
        saveSnippetAction={async (content) => {
          updateSnippet(snippetSlug, content)
        }}
      />
    </div>
  )
}
