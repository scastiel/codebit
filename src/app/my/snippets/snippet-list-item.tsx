'use client'
import { Badge } from '@/components/ui/badge'
import { Snippet } from '@prisma/client'
import Link from 'next/link'
import Highlight from 'react-highlight'

export function SnippetListItem({
  snippet,
}: {
  snippet: Pick<Snippet, 'id' | 'slug' | 'preview' | 'previewLang'>
}) {
  const createdAt = new Date(parseInt(snippet.id.slice(1, 9), 36))

  return (
    <Link
      href={`/my/snippets/${snippet.slug}`}
      className="flex flex-col justify-end gap-1 border rounded-lg overflow-hidden group dark:bg-black"
    >
      <div className="h-32 overflow-hidden relative">
        {snippet.preview && (
          <Highlight
            className={`absolute inset-0 p-3 text-xs !overflow-hidden ${
              snippet.previewLang ? `language-${snippet.previewLang}` : ''
            } opacity-60 group-hover:opacity-100`}
          >
            {snippet.preview}
          </Highlight>
        )}
      </div>
      <div className="flex gap-2 text-sm border-t p-2">
        {snippet.previewLang && (
          <Badge className="uppercase">{snippet.previewLang}</Badge>
        )}
        <span className="opacity-50">
          Created on{' '}
          {createdAt.toLocaleDateString('en-US', {
            dateStyle: 'medium',
          })}
        </span>
      </div>
    </Link>
  )
}
