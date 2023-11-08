'use client'
import { CodeEditor } from '@/components/code-editor'
import { Button } from '@/components/ui/button'
import { Snippet } from '@prisma/client'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'

export function SnippetClientPage({
  snippet,
  lastRenderId,
  saveSnippetAction,
}: {
  snippet: Snippet
  lastRenderId: string | null
  saveSnippetAction: (content: string) => Promise<void>
}) {
  const toolbarRef = useRef<HTMLDivElement | null>(null)

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
        />
      </div>
    </div>
  )
}
