import { Steps } from '@/lib/types'
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
  theme: 'light' | 'dark'
  updateSteps: (param: Steps) => void
  updateTheme: (theme: 'light' | 'dark') => void
  id: string
}

const StepsContext = createContext<stepType | null>(null)

export function useSteps() {
  const context = useContext(StepsContext)
  if (context === null) throw new Error('Unexpected null context')
  return context
}

type Props = {
  initialSteps?: Steps
  initialTheme?: 'light' | 'dark'
  children: ReactNode
}

export function StepsProvider({ initialSteps, initialTheme, children }: Props) {
  const [steps, setSteps] = useState<Steps>(initialSteps ?? defaultSteps)
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme ?? 'light')
  const [id, setId] = useState<string>(uuid())

  const updateSteps = (steps: Steps) => {
    setSteps(steps)
    setId(uuid())
  }
  const updateTheme = (theme: 'light' | 'dark') => {
    setTheme(theme)
    setId(uuid())
  }

  const value = {
    steps,
    theme,
    updateSteps,
    updateTheme,
    id,
  }

  return (
    <>
      <StepsContext.Provider value={value}>{children}</StepsContext.Provider>
    </>
  )
}
