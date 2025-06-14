import { useEffect, useState } from "react";
import VerticalWizard from "../../../../components/ui/stepper/verticalStepper";
import { Prosjektdetaljer } from "./Prosjektdetaljer";
import { Leveransedetaljer } from "./Leveransedetaljer";
import { GrunnerOgSkorstein } from "./GrunnerOgSkorstein";
import { GulvBjelkelagHimling } from "./GulvBjelkelagHimling";
import { Yttervegger } from "./Yttervegger";
import { Innervegger } from "./Innervegger";
import { TakogTaktekking } from "./TakogTaktekking";
import { Dører } from "./Dører";
import { Vinduer } from "./Vinduer";
import { KjøkkenGarderobeBad } from "./KjøkkenGarderobeBad";
import { TrappogLuker } from "./TrappogLuker";
import { BalkongTerrasse } from "./BalkongTerrasse";
import { ListverkogBelistning } from "./ListverkogBelistning";
import { VentilasjonSentralstøvsuger } from "./VentilasjonSentralstøvsuger";

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
      title: "Grunnmur og pipe/skorstein",
      content: (
        <GrunnerOgSkorstein
          handleNext={handleNext}
          handlePrevious={handlePrevious}
        />
      ),
    },
    {
      id: 4,
      title: "Gulv, bjelkelag og himling",
      content: (
        <GulvBjelkelagHimling
          handleNext={handleNext}
          handlePrevious={handlePrevious}
        />
      ),
    },
    {
      id: 5,
      title: "Yttervegger",
      content: (
        <Yttervegger handleNext={handleNext} handlePrevious={handlePrevious} />
      ),
    },
    {
      id: 6,
      title: "Innervegger",
      content: (
        <Innervegger handleNext={handleNext} handlePrevious={handlePrevious} />
      ),
    },
    {
      id: 7,
      title: "Tak og taktekking",
      content: (
        <TakogTaktekking
          handleNext={handleNext}
          handlePrevious={handlePrevious}
        />
      ),
    },
    {
      id: 8,
      title: "Dører",
      content: (
        <Dører handleNext={handleNext} handlePrevious={handlePrevious} />
      ),
    },
    {
      id: 9,
      title: "Vinduer",
      content: (
        <Vinduer handleNext={handleNext} handlePrevious={handlePrevious} />
      ),
    },
    {
      id: 10,
      title: "Kjøkken, Garderobe, Bad",
      content: (
        <KjøkkenGarderobeBad
          handleNext={handleNext}
          handlePrevious={handlePrevious}
        />
      ),
    },
    {
      id: 11,
      title: "Trapp og Luker",
      content: (
        <TrappogLuker handleNext={handleNext} handlePrevious={handlePrevious} />
      ),
    },
    {
      id: 12,
      title: "Balkong & Terrasse",
      content: (
        <BalkongTerrasse
          handleNext={handleNext}
          handlePrevious={handlePrevious}
        />
      ),
    },
    {
      id: 13,
      title: "Listverk og Belistning",
      content: (
        <ListverkogBelistning
          handleNext={handleNext}
          handlePrevious={handlePrevious}
        />
      ),
    },
    {
      id: 14,
      title: "Ventilasjon og Sentralstøvsuger",
      content: (
        <VentilasjonSentralstøvsuger
          handleNext={handleNext}
          handlePrevious={handlePrevious}
        />
      ),
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
