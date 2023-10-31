'use client'

import { CodeEditor } from '@/components/code-editor'
import { StepProvider } from '@/contexts/steps-context'

export default function Home() {
  return (
    <StepProvider>
      <CodeEditor />
    </StepProvider>
  )
}
