import { useEffect, useState } from "react";
import Stepper from "../../../components/ui/stepper";
import { Romkonfigurator } from "./Romkonfigurator";
import { Oppsummering } from "./Oppsummering";
import { Oppmelding } from "./Oppmelding";

export const BoligConfiuratorStepper = () => {
  const [currIndex, setCurrIndex] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedIndex = localStorage.getItem("currIndexBolig");
      if (savedIndex) {
        setCurrIndex(Number(savedIndex));
      } else {
        setCurrIndex(0);
      }
    }
  }, [currIndex]);

  const handleNext = () => {
    if (typeof currIndex === "number" && currIndex < steps.length - 1) {
      setCurrIndex(currIndex + 1);
    }
  };
  const handlePrevious = () => {
    if (typeof currIndex === "number" && currIndex > 0) {
      setCurrIndex(currIndex - 1);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currIndex]);

  const steps = [
    {
      name: "Romkonfigurator",
      component: <Romkonfigurator Prev={handlePrevious} Next={handleNext} />,
    },
    {
      name: "Oppmelding av tiltak",
      component: <Oppmelding Next={handleNext} Prev={handlePrevious} />,
    },
    {
      name: "Oppsummering",
      component: <Oppsummering Prev={handlePrevious} />,
    },
  ];
  return (
    <>
      <Stepper
        steps={steps}
        currIndex={currIndex}
        setCurrIndex={setCurrIndex}
      />
    </>
  );
};
