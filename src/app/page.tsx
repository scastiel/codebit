'use client'

import { CodeSteps } from '@/components/code-steps'
import { Create } from '@/components/create'
import { StepProvider } from '@/contexts/StepContext';

import { useStep } from "../contexts/StepContext";


export default function Home() {
  const { step } = useStep();
  return (
    <main>
      <StepProvider>
        <Create />
        { /* retrieve the value of the input field and pass it to CodeSteps component */}
        <CodeSteps steps={step} />
        {/* <pre>{JSON.stringify(getCodeFragments(input), null, 2)}</pre> */}
      </StepProvider>
    </main>
  )
}

