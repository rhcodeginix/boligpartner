import React, { ReactNode } from "react";
import Ic_Check_white from "../../../assets/images/Ic_Check_white.svg";

// Types for the wizard
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
}

const VerticalWizard: React.FC<VerticalWizardProps> = ({
  steps,
  className = "",
  currentStep,
  setCurrentStep,
}) => {
  const handleStepClick = (stepId: number) => {
    if (stepId < currentStep) {
      setCurrentStep(stepId);
    }
    localStorage.setItem("currVerticalIndex", stepId.toString());
  };

  const currentStepData = steps[currentStep - 1];

  return (
    <div className={`${className}`}>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Vertical Step Indicator */}
        <div className="w-full lg:w-80 bg-[#F9F9FB] border border-[#EFF1F5] rounded-lg p-5 h-full max-h-[500px] overflow-y-auto overFlowAutoY sticky top-[90px]">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-3 z-30 w-0.5 h-16 border-l border-dashed border-[#B9C0D4]`}
                  />
                )}

                <div
                  onClick={() => handleStepClick(step.id)}
                  className={`flex items-start space-x-4 rounded-lg transition-all ${
                    step.id < currentStep ? "cursor-pointer" : "cursor-default"
                  } relative z-40`}
                >
                  <div
                    className={`w-6 h-6 flex items-center text-xs rounded-full justify-center ${
                      currentStep === step.id
                        ? "bg-primary text-white"
                        : currentStep > step.id
                        ? "bg-[#099250]"
                        : "bg-[#ECE9FE] text-darkBlack"
                    } `}
                  >
                    {currentStep > step.id ? (
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

        {/* Content Area */}
        <div className="flex-1">
          <div>{currentStepData?.content}</div>
        </div>
      </div>
    </div>
  );
};

export default VerticalWizard;
