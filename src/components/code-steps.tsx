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
import { diffLines } from 'diff'
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

function useControls(stepsCount: number) {
  const [state, dispatch] = useReducer(reducer, {
    stepsCount,
    currentStep: 0,
    auto: false,
    animate: false,
  })

  const currentStepRef = useRef(state.currentStep)
  useEffect(() => {
    currentStepRef.current = state.currentStep
  }, [state.currentStep])

  const goTo = (step: number) => dispatch({ type: 'goTo', step })

  const reset = () => {
    dispatch({ type: 'reset' })
  }

  const previous = () => {
    dispatch({ type: 'previous' })
  }

  const next = () => {
    dispatch({ type: 'next' })
  }

  const pause = () => {
    dispatch({ type: 'pause' })
  }

  const play = () => {
    dispatch({ type: 'play' })
  }

  return {
    currentStep: state.currentStep,
    goTo,
    reset,
    previous,
    next,
    pause,
    play,
    canPrevious: state.currentStep > 0,
    canNext: state.currentStep < stepsCount - 1,
    auto: state.auto,
    animate: state.animate,
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
    canPrevious,
    canNext,
    auto,
    animate,
  } = useControls(steps.length)

  const autoRef = useRef(auto)
  useEffect(() => {
    autoRef.current = auto
  }, [auto])
  const canNextRef = useRef(canNext)
  useEffect(() => {
    canNextRef.current = canNext
  }, [canNext])

  return (
    <Card className="m-4">
      <CardHeader />
      <CardContent>
        <CodeDiff
          key={`${currentStep},${animate},${auto}`}
          animate={animate}
          fromCode={currentStep === 0 ? null : steps[currentStep - 1].code}
          toCode={steps[currentStep].code}
          done={() => {
            // console.log({ auto: autoRef.current, canNext: canNextRef.current })
            setTimeout(() => {
              if (autoRef.current && canNextRef.current) {
                play()
              } else {
                pause()
              }
            }, 1000)
          }}
        />
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
          disabled={!canNext}
          onClick={() => {
            if (auto) {
              pause()
            } else {
              play()
            }
          }}
        >
          {auto ? (
            <PauseIcon className="h-4 w-4" />
          ) : (
            <PlayIcon className="h-4 w-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
