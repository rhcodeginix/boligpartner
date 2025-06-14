import React, { useEffect, useRef } from "react";
import Ic_Check_white from "../../../assets/images/Ic_Check_white.svg";

interface Step {
  name: string;
  component: any;
}

interface StepperProps {
  steps: Step[];
  currIndex: any;
  setCurrIndex: any;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currIndex,
  setCurrIndex,
}) => {
  const stepRefs = useRef<any>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && currIndex) {
      localStorage.setItem("currIndexBolig", currIndex.toString());
    }
    const currentStepEl = stepRefs.current[currIndex];
    if (currentStepEl) {
      currentStepEl.scrollIntoView({ behavior: "smooth", inline: "start" });
    }
  }, [currIndex]);

  const handleStepClick = (index: number) => {
    if (index <= currIndex) {
      setCurrIndex(index);
    }
    localStorage.setItem("currIndexBolig", index.toString());
  };

  return (
    <>
      <>
        <div className="py-3 bg-[#00284C]">
          <div className="px-6 lg:px-8">
            <div className="stepper_main overFlowScrollHidden">
              <div className="stepper-wrapper">
                <div className="progress"></div>
                {steps.map((step, index) => (
                  <div
                    key={index}
                    ref={(el: any) => (stepRefs.current[index] = el)}
                    className={`screen-indicator-span cursor-pointer ${
                      index < currIndex
                        ? "completed"
                        : index === currIndex
                        ? "current"
                        : ""
                    }`}
                    onClick={() => handleStepClick(index)}
                    style={{
                      color: index === currIndex ? "#2a343e" : "",
                    }}
                  >
                    <div
                      className="flex items-center gap-1.5 md:gap-2 px-1 md:px-2 bg-[#00284C]"
                      style={{ zIndex: 2 }}
                    >
                      {index < currIndex ? (
                        <div className="w-6 h-6 bg-[#099250] flex items-center justify-center rounded-full">
                          <img src={Ic_Check_white} alt="Completed" />
                        </div>
                      ) : (
                        <span className="screen-index">{index + 1}</span>
                      )}
                      <span>{step.name}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`screen-indicator ${
                          index < currIndex
                            ? "completed"
                            : index === currIndex
                            ? "current"
                            : ""
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="active_page">
          {steps[currIndex]?.component || <div>Unknown step</div>}
        </div>
      </>
    </>
  );
};

export default Stepper;
