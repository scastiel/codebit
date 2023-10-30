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
import { useEffect, useReducer, useRef } from 'react'
import { CodeDiff } from '@/components/code-diff'

export type Props = {
  steps: { lang: string; code: string }[]
}

type State = {
  stepsCount: number
  currentStep: number
  auto: boolean
  animate: boolean
}

type Action =
  | { type: 'next' }
  | { type: 'previous' }
  | { type: 'reset' }
  | { type: 'goTo'; step: number }
  | { type: 'play' }
  | { type: 'pause' }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'next':
      return {
        ...state,
        currentStep: Math.max(0, state.currentStep + 1),
        auto: false,
      }
    case 'previous':
      return {
        ...state,
        currentStep: Math.min(state.currentStep - 1, state.stepsCount - 1),
        auto: false,
      }
    case 'goTo':
      return { ...state, currentStep: action.step, animate: false, auto: false }
    case 'reset':
      return { ...state, currentStep: 0, animate: false, auto: false }
    case 'play':
      return {
        ...state,
        currentStep: Math.max(0, state.currentStep + 1),
        auto: true,
        animate: true,
      }
    case 'pause':
      return { ...state, auto: false, animate: false }
  }
}

export function CodeSteps({ steps }: Props) {
  const [state, dispatch] = useReducer(reducer, {
    stepsCount: steps.length,
    currentStep: 0,
    auto: false,
    animate: false,
  })

  const canPrevious = state.currentStep > 0
  const canNext = state.currentStep < steps.length - 1

  const autoRef = useRef(state.auto)
  useEffect(() => {
    autoRef.current = state.auto
  }, [state.auto])

  const canNextRef = useRef(canNext)
  useEffect(() => {
    canNextRef.current = canNext
  }, [canNext])

  return (
    <Card className="m-4">
      <CardHeader />
      <CardContent>
        <CodeDiff
          key={`${state.currentStep},${state.animate},${state.auto}`}
          animate={state.animate}
          fromCode={
            state.currentStep === 0 ? null : steps[state.currentStep - 1].code
          }
          toCode={steps[state.currentStep].code}
          done={() => {
            setTimeout(() => {
              if (autoRef.current && canNextRef.current) {
                dispatch({ type: 'play' })
              } else {
                dispatch({ type: 'pause' })
              }
            }, 1000)
          }}
        />
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Slider
          max={steps.length - 1}
          step={1}
          value={[state.currentStep]}
          onValueChange={([step]) => dispatch({ type: 'goTo', step })}
        />
        <Button
          disabled={!canPrevious}
          variant="secondary"
          onClick={() => dispatch({ type: 'reset' })}
        >
          <SkipBackIcon className="h-4 w-4" />
        </Button>
        <Button
          disabled={!canPrevious}
          variant="secondary"
          onClick={() => dispatch({ type: 'play' })}
        >
          <StepBackIcon className="h-4 w-4" />
        </Button>
        <Button
          disabled={!canNext}
          variant="secondary"
          onClick={() => dispatch({ type: 'next' })}
        >
          <StepForwardIcon className="h-4 w-4" />
        </Button>
        <Button
          disabled={!canNext}
          onClick={() => dispatch({ type: state.auto ? 'pause' : 'play' })}
        >
          {state.auto ? (
            <PauseIcon className="h-4 w-4" />
          ) : (
            <PlayIcon className="h-4 w-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
