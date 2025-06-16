import React, { useEffect, useRef, useState } from "react";
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
import { Brannvern } from "./Brannvern";
import { TekniskeInstallasjoner } from "./TekniskeInstallasjoner";
import { SluttføringDokumentasjon } from "./SluttføringDokumentasjon";

export const Oppmelding: React.FC<{ Next: any }> = ({ Next }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [invalidSteps, setInvalidSteps] = useState<number[]>([]);

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
  // const handleNext = () => {
  //   if (currentStep < wizardSteps.length) {
  //     const nextStep = currentStep + 1;

  //     setCurrentStep(nextStep);
  //   }
  // };

  const handleNext = async () => {
    const currentStepComponent = wizardSteps[currentStep - 1]?.content;

    if (typeof currentStepComponent?.props?.validateForm === "function") {
      const isValid = await currentStepComponent.props.validateForm();
      if (!isValid) {
        if (!invalidSteps.includes(currentStep)) {
          setInvalidSteps([...invalidSteps, currentStep]);
        }
        return;
      } else {
        // Remove from invalidSteps if it was previously marked invalid
        setInvalidSteps(invalidSteps.filter((id) => id !== currentStep));
      }
    }

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
  const formRefs = useRef<Record<number, any>>({});

  const wizardSteps = [
    {
      id: 1,
      title: "Prosjektdetaljer",
      content: (
        <Prosjektdetaljer
          // ref={(ref) => (formRefs.current[1] = ref)}
          ref={(ref: any): void => {
            formRefs.current[1] = ref;
          }}
          handleNext={handleNext}
        />
      ),
    },
    {
      id: 2,
      title: "Leveransedetaljer",
      content: (
        <Leveransedetaljer
          ref={(ref: any): void => {
            formRefs.current[2] = ref;
          }}
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
          ref={(ref: any): void => {
            formRefs.current[3] = ref;
          }}
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
          ref={(ref: any): void => {
            formRefs.current[4] = ref;
          }}
        />
      ),
    },
    {
      id: 5,
      title: "Yttervegger",
      content: (
        <Yttervegger
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          ref={(ref: any): void => {
            formRefs.current[5] = ref;
          }}
        />
      ),
    },
    {
      id: 6,
      title: "Innervegger",
      content: (
        <Innervegger
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          ref={(ref: any): void => {
            formRefs.current[6] = ref;
          }}
        />
      ),
    },
    {
      id: 7,
      title: "Tak og taktekking",
      content: (
        <TakogTaktekking
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          ref={(ref: any): void => {
            formRefs.current[7] = ref;
          }}
        />
      ),
    },
    {
      id: 8,
      title: "Dører",
      content: (
        <Dører
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          ref={(ref: any): void => {
            formRefs.current[8] = ref;
          }}
        />
      ),
    },
    {
      id: 9,
      title: "Vinduer",
      content: (
        <Vinduer
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          ref={(ref: any): void => {
            formRefs.current[9] = ref;
          }}
        />
      ),
    },
    {
      id: 10,
      title: "Kjøkken, Garderobe, Bad",
      content: (
        <KjøkkenGarderobeBad
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          ref={(ref: any): void => {
            formRefs.current[10] = ref;
          }}
        />
      ),
    },
    {
      id: 11,
      title: "Trapp og Luker",
      content: (
        <TrappogLuker
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          ref={(ref: any): void => {
            formRefs.current[11] = ref;
          }}
        />
      ),
    },
    {
      id: 12,
      title: "Balkong & Terrasse",
      content: (
        <BalkongTerrasse
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          ref={(ref: any): void => {
            formRefs.current[12] = ref;
          }}
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
          ref={(ref: any): void => {
            formRefs.current[13] = ref;
          }}
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
          ref={(ref: any): void => {
            formRefs.current[14] = ref;
          }}
        />
      ),
    },
    {
      id: 15,
      title: "Brannvern",
      content: (
        <Brannvern
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          ref={(ref: any): void => {
            formRefs.current[15] = ref;
          }}
        />
      ),
    },
    {
      id: 16,
      title: "Tekniske Installasjoner",
      content: (
        <TekniskeInstallasjoner
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          ref={(ref: any): void => {
            formRefs.current[16] = ref;
          }}
        />
      ),
    },
    {
      id: 17,
      title: "Sluttføring og Dokumentasjon",
      content: (
        <SluttføringDokumentasjon
          handlePrevious={handlePrevious}
          Next={Next}
          ref={(ref: any): void => {
            formRefs.current[17] = ref;
          }}
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
          invalidSteps={invalidSteps}
          formRefs={formRefs}
          setInvalidSteps={setInvalidSteps}
        />
      </div>
    </>
  );
};
