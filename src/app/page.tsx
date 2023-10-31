'use client'

import { CodeSteps } from '@/components/code-steps'
import { Create } from '@/components/create'
import { StepProvider } from '@/contexts/StepContext';

export default function Home() {
  return (
    <main>
      <StepProvider>
        <Create />
        { /* retrieve the value of the input field and pass it to CodeSteps component */}
        <CodeSteps />
        {/* <pre>{JSON.stringify(getCodeFragments(input), null, 2)}</pre> */}
      </StepProvider>
    </main>
  )
}

