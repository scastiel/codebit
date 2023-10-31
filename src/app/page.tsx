'use client'

import { CodeEditor } from '@/components/code-editor'
import { StepsProvider } from '@/contexts/steps-context'

export default function Home() {
  return (
    <StepsProvider>
      <CodeEditor />
    </StepsProvider>
  )
}
