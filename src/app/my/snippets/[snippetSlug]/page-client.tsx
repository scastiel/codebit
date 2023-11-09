'use client'
import { CodeEditor } from '@/components/code-editor'
import { Button } from '@/components/ui/button'
import { getPlan } from '@/lib/plans'
import { Snippet } from '@prisma/client'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'

export function SnippetClientPage({
  snippet,
  lastRenderId,
  saveSnippetAction,
  planId,
}: {
  snippet: Snippet
  lastRenderId: string | null
  saveSnippetAction: (content: string) => Promise<void>
  planId: string
}) {
  const toolbarRef = useRef<HTMLDivElement | null>(null)
  const plan = getPlan(planId)

  return (
    <div className="flex flex-col">
      <div className="px-4 flex gap-2 flex-wrap" ref={toolbarRef}>
        <Button variant="ghost" asChild>
          <Link href="/my/snippets">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to snippets</span>
          </Link>
        </Button>
      </div>
      <div className="flex-1 flex [&>div]:w-full">
        <CodeEditor
          snippetSlug={snippet.slug}
          initialContent={snippet.content}
          saveSnippetAction={saveSnippetAction}
          lastRenderId={lastRenderId}
          toolbarRef={toolbarRef}
          plan={plan}
        />
      </div>
    </div>
  )
}
