"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  StepBackIcon,
  StepForwardIcon,
} from "lucide-react";
import { useEffect, useReducer, useRef } from "react";
import { CodeDiff } from "@/components/code-diff";

import { useStep } from "../contexts/steps-context";

type State = {
  steps: Steps;
  currentStep: number;
  animate: boolean;
};

type Action =
  | { type: "next" }
  | { type: "previous" }
  | { type: "reset" }
  | { type: "goTo"; step: number }
  | { type: "play" }
  | { type: "pause" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "next":
      return {
        ...state,
        currentStep: Math.min(state.steps.length - 1, state.currentStep + 1),
      };
    case "previous":
      return { ...state, currentStep: Math.max(0, state.currentStep - 1) };
    case "goTo":
      return { ...state, currentStep: action.step };
    case "reset":
      return { ...state, currentStep: 0 };
    case "play":
      return { ...state, animate: true };
    case "pause":
      return { ...state, animate: false };
  }
};

export function CodeSteps() {
  const { steps, id } = useStep();

  const [state, dispatch] = useReducer(reducer, {
    steps,
    currentStep: 0,
    animate: false,
  });

  const canPrevious = state.currentStep > 0;
  const canNext = state.currentStep < state.steps.length - 1;

  const animateRef = useRef(state.animate);
  useEffect(() => {
    animateRef.current = state.animate;
  }, [state.animate]);

  const canNextRef = useRef(canNext);
  useEffect(() => {
    canNextRef.current = canNext;
  }, [canNext]);

  return (
    <Card className="m-4">
      <CardHeader />
      <CardContent>
        <CodeDiff
          key={`${state.currentStep},${state.animate},${id}`}
          animate={state.animate}
          fromCode={
            state.currentStep === 0 ? null : steps[state.currentStep - 1].code
          }
          toCode={steps[state.currentStep].code}
          done={() => {
            if (animateRef.current && canNextRef.current) {
              setTimeout(() => {
                if (animateRef.current && canNextRef.current) {
                  dispatch({ type: "next" });
                }
              }, 1000);
            } else {
              dispatch({ type: "pause" });
            }
          }}
        />
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Slider
          max={state.steps.length - 1}
          step={1}
          value={[state.currentStep]}
          onValueChange={([step]) => dispatch({ type: "goTo", step })}
        />
        <Button
          disabled={!canPrevious}
          variant="secondary"
          onClick={() => {
            dispatch({ type: "pause" });
            dispatch({ type: "reset" });
          }}
        >
          <SkipBackIcon className="h-4 w-4" />
        </Button>
        <Button
          disabled={!canPrevious}
          variant="secondary"
          onClick={() => {
            dispatch({ type: "pause" });
            dispatch({ type: "previous" });
          }}
        >
          <StepBackIcon className="h-4 w-4" />
        </Button>
        <Button
          disabled={!canNext}
          variant="secondary"
          onClick={() => {
            dispatch({ type: "pause" });
            dispatch({ type: "next" });
          }}
        >
          <StepForwardIcon className="h-4 w-4" />
        </Button>
        <Button
          disabled={!canNext && !state.animate}
          onClick={() => {
            if (state.animate) {
              dispatch({ type: "pause" });
            } else {
              dispatch({ type: "play" });
              dispatch({ type: "next" });
            }
          }}
        >
          {state.animate ? (
            <PauseIcon className="h-4 w-4" />
          ) : (
            <PlayIcon className="h-4 w-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
