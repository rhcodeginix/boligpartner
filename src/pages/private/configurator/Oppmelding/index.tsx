import { useEffect, useState } from "react";
import VerticalWizard from "../../../../components/ui/stepper/verticalStepper";
import { Prosjektdetaljer } from "./Prosjektdetaljer";
import { Leveransedetaljer } from "./Leveransedetaljer";

export const Oppmelding = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedIndex = localStorage.getItem("currVerticalIndex");
      if (savedIndex) {
        setCurrentStep(Number(savedIndex));
      } else {
        setCurrentStep(1);
      }
    }
  }, [currentStep]);
  const handleNext = () => {
    if (currentStep < wizardSteps.length) {
      const nextStep = currentStep + 1;

      setCurrentStep(nextStep);
    }
  };
  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
    }
  };

  const wizardSteps = [
    {
      id: 1,
      title: "Prosjektdetaljer",
      content: <Prosjektdetaljer handleNext={handleNext} />,
    },
    {
      id: 2,
      title: "Leveransedetaljer",
      content: (
        <Leveransedetaljer
          handleNext={handleNext}
          handlePrevious={handlePrevious}
        />
      ),
    },
    {
      id: 3,
      title: "Payment Details",
      content: <>abc</>,
    },
    {
      id: 4,
      title: "Review & Complete",
      content: <>abc</>,
    },
  ];

  return (
    <>
      <div className="bg-lightPurple px-8 py-3">
        <h3 className="text-darkBlack font-medium text-xl md:text-[24px] lg:text-[28px] desktop:text-[2rem] desktop:leading-[44.8px] mb-2">
          Boligkonfigurator
        </h3>
        <p className="text-secondary text-sm md:text-base desktop:text-lg">
          Her melder du opp huset til produksjon til BoligPartner.
        </p>
      </div>
      <div className="px-8 my-12">
        {/* <VerticalWizard /> */}
        <VerticalWizard
          steps={wizardSteps}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      </div>
    </>
  );
};
