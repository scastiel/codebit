/* eslint-disable @next/next/no-css-tags */
'use client'
import { SnippetListItem } from '@/app/my/snippets/snippet-list-item'
import { StoredSnippet } from '@/lib/snippet-storage'
import { ReactNode } from 'react'

type Props = {
  snippets: StoredSnippet[]
  onDelete: (slug: string) => void
  children: ReactNode
}

export function SnippetList({ snippets, onDelete, children }: Props) {
  return (
    <>
      <link href="/themes/github-dark.css" rel="stylesheet" />
      <ul className="grid grid-cols-1 flex-col gap-5 justify-stretch sm:grid-cols-2 md:grid-cols-3">
        {children}
        {snippets.map((snippet) => {
          return (
            <li key={snippet.slug}>
              <SnippetListItem snippet={snippet} onDelete={onDelete} />
            </li>
          )
        })}
      </ul>
    </>
  )
}
