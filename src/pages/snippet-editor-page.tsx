import { CodeEditor } from '@/components/code-editor'
import { MyShell } from '@/components/my-shell'
import { getSnippet, updateSnippet } from '@/lib/snippet-storage'
import { useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export function SnippetEditorPage() {
  const { snippetSlug } = useParams({ from: '/my/snippets/$snippetSlug' })
  const [state, setState] = useState<
    | { status: 'loading' }
    | { status: 'found'; content: string }
    | { status: 'not-found' }
  >({ status: 'loading' })

  useEffect(() => {
    document.title = 'Edit snippet – CodeBit'
    const snippet = getSnippet(snippetSlug)
    setState(
      snippet
        ? { status: 'found', content: snippet.content }
        : { status: 'not-found' },
    )
  }, [snippetSlug])

  if (state.status === 'loading') return <MyShell>{null}</MyShell>
  if (state.status === 'not-found') {
    return (
      <MyShell>
        <p className="p-4">Snippet not found.</p>
      </MyShell>
    )
  }

  return (
    <MyShell>
      <div className="flex-1 flex [&>div]:w-full">
        <CodeEditor
          snippetSlug={snippetSlug}
          initialContent={state.content}
          saveSnippetAction={async (content) => {
            updateSnippet(snippetSlug, content)
          }}
        />
      </div>
    </MyShell>
  )
}
