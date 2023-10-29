'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import {
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  StepBackIcon,
  StepForwardIcon,
} from 'lucide-react'
import { useEffect, useReducer, useRef, useState } from 'react'

export type Props = {
  steps: { lang: string; code: string }[]
}

type State = { stepsCount: number; currentStep: number }

type Action =
  | { type: 'next' }
  | { type: 'previous' }
  | { type: 'reset' }
  | { type: 'goTo'; step: number }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'next':
      return { ...state, currentStep: Math.max(0, state.currentStep + 1) }
    case 'previous':
      return {
        ...state,
        currentStep: Math.min(state.currentStep - 1, state.stepsCount - 1),
      }
    case 'goTo':
      return { ...state, currentStep: action.step }
    case 'reset':
      return { ...state, currentStep: 0 }
  }
}

function useControls(stepsCount: number) {
  const [state, dispatch] = useReducer(reducer, {
    stepsCount,
    currentStep: 0,
  })
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  const currentStepRef = useRef(state.currentStep)
  useEffect(() => {
    currentStepRef.current = state.currentStep
  }, [state.currentStep])

  const intervalIdRef = useRef(intervalId)
  useEffect(() => {
    intervalIdRef.current = intervalId
  }, [intervalId])

  useEffect(() => {
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId)
      }
    }
  }, [intervalId])

  const goTo = (step: number) => dispatch({ type: 'goTo', step })

  const reset = () => {
    if (intervalId) {
      setIntervalId(null)
      clearInterval(intervalId)
    }
    dispatch({ type: 'reset' })
  }

  const previous = () => {
    if (intervalId) {
      setIntervalId(null)
      clearInterval(intervalId)
    }
    dispatch({ type: 'previous' })
  }

  const next = () => {
    if (intervalId) {
      setIntervalId(null)
      clearInterval(intervalId)
    }
    dispatch({ type: 'next' })
  }

  const pause = () => {
    if (intervalId) {
      setIntervalId(null)
      clearInterval(intervalId)
    }
  }

  const play = () => {
    setIntervalId(
      setInterval(() => {
        if (currentStepRef.current < stepsCount - 1) dispatch({ type: 'next' })
        if (
          currentStepRef.current >= stepsCount - 2 &&
          intervalIdRef.current !== null
        ) {
          setIntervalId(null)
          clearInterval(intervalIdRef.current)
        }
      }, 1000)
    )
  }

  return {
    currentStep: state.currentStep,
    goTo,
    reset,
    previous,
    next,
    pause,
    play,
    isPlaying: intervalId !== null,
    canPrevious: state.currentStep > 0,
    canNext: state.currentStep < stepsCount - 1,
  }
}

export function CodeSteps({ steps }: Props) {
  const {
    currentStep,
    goTo,
    reset,
    previous,
    next,
    pause,
    play,
    isPlaying,
    canPrevious,
    canNext,
  } = useControls(steps.length)

  return (
    <Card>
      <CardHeader />
      <CardContent>
        <pre>
          <code>{steps[currentStep].code}</code>
        </pre>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Slider
          max={steps.length - 1}
          step={1}
          value={[currentStep]}
          onValueChange={([step]) => goTo(step)}
        />
        <Button disabled={!canPrevious} variant="secondary" onClick={reset}>
          <SkipBackIcon className="h-4 w-4" />
        </Button>
        <Button disabled={!canPrevious} variant="secondary" onClick={previous}>
          <StepBackIcon className="h-4 w-4" />
        </Button>
        <Button disabled={!canNext} variant="secondary" onClick={next}>
          <StepForwardIcon className="h-4 w-4" />
        </Button>
        <Button
          disabled={isPlaying && !canNext}
          onClick={() => {
            if (isPlaying) {
              pause()
            } else {
              play()
            }
          }}
        >
          {isPlaying ? (
            <PauseIcon className="h-4 w-4" />
          ) : (
            <PlayIcon className="h-4 w-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
