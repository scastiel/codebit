'use client'
import { CodeEditor } from '@/components/code-editor'
import { getPlan } from '@/lib/plans'
import { Snippet } from '@prisma/client'

export function SnippetClientPage({
  snippet,
  lastRenderId,
  saveSnippetAction,
  planId,
  userId,
}: {
  snippet: Snippet
  lastRenderId: string | null
  saveSnippetAction: (content: string) => Promise<void>
  planId: string
  userId: string
}) {
  const plan = getPlan(planId)

  return (
    <div className="flex-1 flex [&>div]:w-full">
      <CodeEditor
        snippetSlug={snippet.slug}
        initialContent={snippet.content}
        saveSnippetAction={saveSnippetAction}
        lastRenderId={lastRenderId}
        plan={plan}
        userId={userId}
      />
    </div>
  )
}
