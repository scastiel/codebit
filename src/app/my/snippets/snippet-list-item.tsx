'use client'
import { Badge } from '@/components/ui/badge'
import { getCodeFragments } from '@/lib/code-steps-utils'
import { Snippet } from '@prisma/client'
import 'highlight.js/styles/github.css'
import Link from 'next/link'
import Highlight from 'react-highlight'

export function SnippetListItem({ snippet }: { snippet: Snippet }) {
  const steps = getCodeFragments(snippet.content)
  const step = steps[steps.length - 1]
  const createdAt = new Date(parseInt(snippet.id.slice(1, 9), 36))

  return (
    <Link
      href={`/my/snippets/${snippet.id}`}
      className="flex flex-col justify-end gap-1 border rounded-lg overflow-hidden group"
    >
      <div className="h-32 overflow-hidden relative">
        {step && (
          <Highlight
            className={`absolute inset-0 p-3 text-xs !overflow-hidden language-${step.lang} opacity-60 group-hover:opacity-100`}
          >
            {step.code}
          </Highlight>
        )}
      </div>
      <div className="flex gap-2 text-sm border-t p-2">
        <Badge className="uppercase">{step ? step.lang : '?'}</Badge>
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
