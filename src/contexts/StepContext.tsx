import { createContext, useContext, ReactNode, useState } from "react";
import {v4 as uuid} from 'uuid'

const defaultSteps = [
  {
    lang: "c",
    code: "toto",
  },
  {
    lang: "c",
    code: "toto\ntutu",
  },
];

type Steps = { lang: string; code: string }[];

type stepType = {
  steps: Steps;
  sStep: (param: Steps) => void;
  id: string
};

const stepContextDefaultValues: stepType = {
  steps: defaultSteps,
  sStep: () => {},
  id: ''
};

const StepContext = createContext<stepType>(stepContextDefaultValues);

export function useStep() {
  return useContext(StepContext);
}

type Props = {
  children: ReactNode;
};

export function StepProvider({ children }: Props) {
  const [steps, setSteps] = useState<Steps>(defaultSteps);
  const [id, setId] = useState<string>(uuid())

  const sStep = (param: Steps) => {
    console.log("in sStep with: ", param);
    setSteps(param);
    setId(uuid())
  };

  const value = {
    steps,
    sStep,
    id
  };

  return (
    <>
      <StepContext.Provider value={value}>{children}</StepContext.Provider>
    </>
  );
}
