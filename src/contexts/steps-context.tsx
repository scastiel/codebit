import { ReactNode, createContext, useContext, useState } from 'react'
import { v4 as uuid } from 'uuid'

const defaultSteps = [
  {
    lang: 'ts',
    code: "console.log('Hello World!')",
  },
]

type stepType = {
  steps: Steps
  updateSteps: (param: Steps) => void
  id: string
}

const stepsContextDefaultValues: stepType = {
  steps: defaultSteps,
  updateSteps: () => {},
  id: '',
}

const StepsContext = createContext<stepType | null>(stepsContextDefaultValues)

export function useSteps() {
  const context = useContext(StepsContext)
  if (context === null) throw new Error('Unexpected null context')
  return context
}

type Props = {
  initialSteps?: Steps
  children: ReactNode
}

export function StepsProvider({ initialSteps, children }: Props) {
  const [steps, setSteps] = useState<Steps>(initialSteps ?? defaultSteps)
  const [id, setId] = useState<string>(uuid())

  const updateSteps = (param: Steps) => {
    setSteps(param)
    setId(uuid())
  }

  const value = {
    steps,
    updateSteps,
    id,
  }

  return (
    <>
      <StepsContext.Provider value={value}>{children}</StepsContext.Provider>
    </>
  )
}
