import React, { ReactNode, useEffect, useRef } from "react";
import Ic_Check_white from "../../../assets/images/Ic_Check_white.svg";

interface WizardStep {
  id: number;
  title: string;
  content: ReactNode;
}

interface VerticalWizardProps {
  steps: WizardStep[];
  className?: string;
  currentStep: any;
  setCurrentStep: any;
  invalidSteps: any;
  formRefs: React.MutableRefObject<Record<number, any>>;
  setInvalidSteps: any;
  validInitialSteps: any;
}

const VerticalWizard: React.FC<VerticalWizardProps> = ({
  steps,
  className = "",
  currentStep,
  setCurrentStep,
  invalidSteps,
  formRefs,
  setInvalidSteps,
  validInitialSteps,
}) => {
  const handleStepClick = async (stepId: number) => {
    if (stepId === currentStep) return;

    const currentStepForm = formRefs.current[currentStep];

    // if (typeof currentStepForm?.handleSubmit === "function") {
    //   await currentStepForm.handleSubmit();
    // }

    const isValid = await currentStepForm?.validateForm?.();

    if (!isValid) {
      if (!invalidSteps.includes(currentStep)) {
        setInvalidSteps([...invalidSteps, currentStep]);
      }
      return;
    } else {
      setInvalidSteps(invalidSteps.filter((id: any) => id !== currentStep));
    }

    if (
      validInitialSteps?.includes(stepId) ||
      stepId < currentStep ||
      stepId === currentStep + 1
    ) {
      setCurrentStep(stepId);
      localStorage.setItem("currVerticalIndex", stepId.toString());
    }
  };

  const currentStepData = steps[currentStep - 1];

  const stepRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const currentRef = stepRefs.current[currentStep];
    if (currentRef) {
      currentRef.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [currentStep]);

  return (
    <div className={`${className}`}>
      <div className="flex flex-col desktop:flex-row gap-6">
        <div className="w-full desktop:w-80 bg-[#F9F9FB] border border-[#EFF1F5] rounded-lg p-5 h-full max-h-[200px] desktop:max-h-[calc(100vh-300px)] overflow-y-auto overFlowAutoY sticky top-[74px] lg:top-[90px] z-50">
          <div className="space-y-5 md:space-y-6">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={"relative"}
                ref={(el: any) => (stepRefs.current[step.id] = el)}
              >
                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-3 z-30 w-0.5 h-10 md:h-16 border-l border-dashed border-[#B9C0D4]`}
                  />
                )}

                <div
                  onClick={() => handleStepClick(step.id)}
                  // className={`flex items-start space-x-4 rounded-lg transition-all  relative z-40
                  // ${
                  //   step.id < currentStep ||
                  //   step.id === currentStep ||
                  //   step.id === currentStep + 1
                  //     ? "cursor-pointer"
                  //     : "cursor-default opacity-50"
                  // }`}
                  className={`flex items-start space-x-4 rounded-lg transition-all relative z-40 ${
                    validInitialSteps.includes(step.id) ||
                    step.id <= currentStep + 1
                      ? "cursor-pointer"
                      : "cursor-default opacity-50"
                  }`}
                >
                  <div
                    // className={`w-6 h-6 flex items-center text-xs rounded-full justify-center ${
                    //   currentStep === step.id
                    //     ? "bg-primary text-white"
                    //     : currentStep > step.id
                    //     ? invalidSteps.includes(step.id)
                    //       ? "bg-[#ECE9FE] text-darkBlack"
                    //       : "bg-[#099250]"
                    //     : "bg-[#ECE9FE] text-darkBlack"
                    // } `}
                    className={`w-6 h-6 flex items-center text-xs rounded-full justify-center ${
                      currentStep === step.id
                        ? "bg-primary text-white"
                        : Array.isArray(validInitialSteps) &&
                          validInitialSteps.length === 0
                        ? currentStep > step.id &&
                          !invalidSteps.includes(step.id)
                          ? "bg-[#099250]"
                          : "bg-[#ECE9FE] text-darkBlack"
                        : validInitialSteps.includes(step.id)
                        ? "bg-[#099250]"
                        : currentStep > step.id &&
                          !invalidSteps.includes(step.id)
                        ? "bg-[#099250]"
                        : "bg-[#ECE9FE] text-darkBlack"
                    }`}
                    // className={`w-6 h-6 flex items-center text-xs rounded-full justify-center ${
                    //   validInitialSteps.includes(step.id)
                    //     ? "bg-[#099250]"
                    //     : currentStep === step.id
                    //     ? "bg-primary text-white"
                    //     : currentStep > step.id &&
                    //       !invalidSteps.includes(step.id)
                    //     ? "bg-[#099250]"
                    //     : "bg-[#ECE9FE] text-darkBlack"
                    // }`}
                  >
                    {/* {currentStep > step.id &&
                    !invalidSteps.includes(step.id) ? (
                      <img src={Ic_Check_white} alt="Completed" />
                    ) : (
                      step.id
                    )} */}
                    {Array.isArray(validInitialSteps) &&
                    validInitialSteps.length === 0 ? (
                      currentStep > step.id &&
                      !invalidSteps.includes(step.id) ? (
                        <img src={Ic_Check_white} alt="Completed" />
                      ) : (
                        step.id
                      )
                    ) : validInitialSteps.includes(step.id) ? (
                      <img src={Ic_Check_white} alt="Completed" />
                    ) : currentStep > step.id &&
                      !invalidSteps.includes(step.id) ? (
                      <img src={Ic_Check_white} alt="Completed" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-black text-sm ${
                        currentStep === step.id
                          ? "font-semibold"
                          : "font-normal"
                      }`}
                    >
                      {step.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 relative z-40">
          <div>{currentStepData?.content}</div>
        </div>
      </div>
    </div>
  );
};

export default VerticalWizard;
