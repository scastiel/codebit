import { createContext, useContext, ReactNode, useState } from "react";

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
};

const stepContextDefaultValues: stepType = {
  steps: defaultSteps,
  sStep: () => {},
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

  const sStep = (param: Steps) => {
    console.log("in sStep with: ", param);
    setSteps(param);
  };

  const value = {
    steps,
    sStep,
  };

  return (
    <>
      <StepContext.Provider value={value}>{children}</StepContext.Provider>
    </>
  );
}
