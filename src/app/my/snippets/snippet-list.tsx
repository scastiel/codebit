/* eslint-disable @next/next/no-css-tags */
'use client'
import { SnippetListItem } from '@/app/my/snippets/snippet-list-item'
import { useIsBrowser } from '@/lib/hooks'
import { Snippet } from '@prisma/client'
import { useTheme } from 'next-themes'

type Props = {
  snippets: Pick<Snippet, 'id' | 'preview' | 'previewLang'>[]
}

export function SnippetList({ snippets }: Props) {
  const { theme } = useTheme()
  const browser = useIsBrowser()

  return (
    <>
      {browser &&
        (theme === 'dark' ? (
          <link href="/themes/github-dark.css" rel="stylesheet" />
        ) : (
          <link href="/themes/github.css" rel="stylesheet" />
        ))}
      <ul className="grid grid-cols-1 flex-col gap-5 justify-stretch sm:grid-cols-2 md:grid-cols-3">
        {snippets.map((snippet) => {
          return (
            <li key={snippet.id}>
              <SnippetListItem snippet={snippet} />
            </li>
          )
        })}
      </ul>
    </>
  )
}
