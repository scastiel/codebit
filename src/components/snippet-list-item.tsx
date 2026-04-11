import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StoredSnippet } from '@/lib/snippet-storage'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { Trash2 } from 'lucide-react'
import { MouseEvent } from 'react'
import Highlight from 'react-highlight'

function derivePreview(content: string): { code: string; lang: string } | null {
  const regex = /^```(\w*)[^\n]*\n([\s\S]*?)\n^```\s*$/gm
  let last: RegExpExecArray | null = null
  let match: RegExpExecArray | null
  while ((match = regex.exec(content)) !== null) {
    last = match
  }
  if (!last) return null
  return { lang: last[1] || '', code: last[2].trim() }
}

export function SnippetListItem({
  snippet,
  onDelete,
}: {
  snippet: StoredSnippet
  onDelete: (slug: string) => void
}) {
  const createdAt = new Date(snippet.createdAt)
  const preview = derivePreview(snippet.content)

  const handleDelete = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (confirm('Delete this snippet?')) {
      onDelete(snippet.slug)
    }
  }

  return (
    <Link
      to="/my/snippets/$snippetSlug"
      params={{ snippetSlug: snippet.slug }}
      className="flex flex-col justify-end border rounded-md overflow-hidden group bg-black"
    >
      <div className="h-32 overflow-hidden relative">
        {preview && (
          <Highlight
            className={cn(
              'absolute inset-0 !p-3 text-xs !overflow-hidden opacity-60 group-hover:opacity-100',
              preview.lang && `language-${preview.lang}`,
            )}
          >
            {preview.code}
          </Highlight>
        )}
      </div>
      <div className="flex gap-2 text-sm border-t p-2 items-center">
        {preview?.lang && <Badge className="uppercase">{preview.lang}</Badge>}
        <span className="opacity-50">
          Created on{' '}
          {createdAt.toLocaleDateString('en-US', {
            dateStyle: 'medium',
          })}
        </span>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleDelete}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Link>
  )
}
