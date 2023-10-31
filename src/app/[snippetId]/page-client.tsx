'use client'
import { CodeSteps } from '@/components/code-steps'
import { StepsProvider } from '@/contexts/steps-context'
import { getCodeFragments } from '@/lib/code-steps-utils'
import { Snippet } from '@prisma/client'
import { Code2 } from 'lucide-react'
import Link from 'next/link'

type Props = {
  snippet: Snippet
}

export function PublicSnippetPageClient({ snippet }: Props) {
  const steps = getCodeFragments(snippet.content)

  return (
    <div className="h-screen w-screen flex flex-col gap-2 items-center justify-center p-4 bg-gradient-1">
      <div className="w-[600px] max-w-full">
        <StepsProvider initialSteps={steps}>
          <CodeSteps />
        </StepsProvider>
      </div>
      <p className="text-sm flex items-center gap-1.5 opacity-60">
        <span>Generated with </span>
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex font-semibold gap-1 items-center"
        >
          <Code2 /> <span>Share Code</span>
        </Link>
      </p>
    </div>
  )
}
