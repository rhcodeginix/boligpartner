import React, { useEffect, useRef, useState } from "react";
import VerticalWizard from "../../../../components/ui/stepper/verticalStepper";
import { Prosjektdetaljer } from "./Prosjektdetaljer";
import { GrunnerOgSkorstein } from "./GrunnerOgSkorstein";
import { GulvBjelkelagHimling } from "./GulvBjelkelagHimling";
import { Yttervegger } from "./Yttervegger";
import { Innervegger } from "./Innervegger";
import { TakogTaktekking } from "./TakogTaktekking";
import { Dører } from "./Dører";
import { Vinduer } from "./Vinduer";
import { TrappogLuker } from "./TrappogLuker";
import { BalkongTerrasse } from "./BalkongTerrasse";
import { VentilasjonSentralstøvsuger } from "./VentilasjonSentralstøvsuger";
import { Brannvern } from "./Brannvern";
import { TekniskeInstallasjoner } from "./TekniskeInstallasjoner";
import { useLocation } from "react-router-dom";
import { fetchRoomData } from "../../../../lib/utils";

export const Oppmelding: React.FC<{ Next: any; Prev: any }> = ({
  Next,
  Prev,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [invalidSteps, setInvalidSteps] = useState<number[]>([]);

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

  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const id = pathSegments.length > 2 ? pathSegments[2] : null;

  const [roomsData, setRoomsData] = useState<any>([]);

  useEffect(() => {
    if (!id) {
      return;
    }
    const getData = async () => {
      const data = await fetchRoomData(id);

      if (data) {
        setRoomsData(data);
      }
    };

    getData();
  }, [id]);

  const wizardSteps = [
    {
      id: 1,
      title: "Prosjekt- og leveransedetaljer",
      content: (
        <Prosjektdetaljer
          ref={(ref: any): void => {
            formRefs.current[1] = ref;
          }}
          handleNext={handleNext}
          Prev={Prev}
          setRoomsData={setRoomsData}
        />
      ),
    },
    // {
    //   id: 2,
    //   title: "Leveransedetaljer",
    //   content: (
    //     <Leveransedetaljer
    //       ref={(ref: any): void => {
    //         formRefs.current[2] = ref;
    //       }}
    //       handleNext={handleNext}
    //       handlePrevious={handlePrevious}
    //       roomsData={roomsData}
    //       setRoomsData={setRoomsData}
    //     />
    //   ),
    // },
    {
      id: 2,
      title: "Grunnmur og pipe",
      content: (
        <GrunnerOgSkorstein
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          ref={(ref: any): void => {
            formRefs.current[2] = ref;
          }}
          roomsData={roomsData}
          setRoomsData={setRoomsData}
        />
      ),
    },
    {
      id: 3,
      title: "Gulv og bjelkelag",
      content: (
        <GulvBjelkelagHimling
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          ref={(ref: any): void => {
            formRefs.current[3] = ref;
          }}
          roomsData={roomsData}
          setRoomsData={setRoomsData}
        />
      ),
    },
    {
      id: 4,
      title: "Yttervegger",
      content: (
        <Yttervegger
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          ref={(ref: any): void => {
            formRefs.current[4] = ref;
          }}
          roomsData={roomsData}
          setRoomsData={setRoomsData}
        />
      ),
    },
    {
      id: 5,
      title: "Tak og taktekking",
      content: (
        <TakogTaktekking
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          ref={(ref: any): void => {
            formRefs.current[5] = ref;
          }}
          roomsData={roomsData}
          setRoomsData={setRoomsData}
        />
      ),
    },
    {
      id: 6,
      // title: "Innervegger",
      title: "Romskjema",
      content: (
        <Innervegger
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          ref={(ref: any): void => {
            formRefs.current[6] = ref;
          }}
          roomsData={roomsData}
          setRoomsData={setRoomsData}
        />
      ),
    },
    {
      id: 7,
      title: "Dører",
      content: (
        <Dører
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          ref={(ref: any): void => {
            formRefs.current[7] = ref;
          }}
          setRoomsData={setRoomsData}
          roomsData={roomsData}
        />
      ),
    },
    {
      id: 8,
      title: "Vinduer",
      content: (
        <Vinduer
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          ref={(ref: any): void => {
            formRefs.current[8] = ref;
          }}
          roomsData={roomsData}
          setRoomsData={setRoomsData}
        />
      ),
    },
    // {
    //   id: 9,
    //   title: "Kjøkken, Garderobe, Bad",
    //   content: (
    //     <KjøkkenGarderobeBad
    //       handleNext={handleNext}
    //       handlePrevious={handlePrevious}
    //       ref={(ref: any): void => {
    //         formRefs.current[9] = ref;
    //       }}
    //       roomsData={roomsData}
    //       setRoomsData={setRoomsData}
    //     />
    //   ),
    // },
    {
      id: 9,
      title: "Trapp og Luker",
      content: (
        <TrappogLuker
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          ref={(ref: any): void => {
            formRefs.current[9] = ref;
          }}
          roomsData={roomsData}
          setRoomsData={setRoomsData}
        />
      ),
    },
    {
      id: 10,
      title: "Balkong & Terrasse",
      content: (
        <BalkongTerrasse
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          ref={(ref: any): void => {
            formRefs.current[10] = ref;
          }}
          roomsData={roomsData}
          setRoomsData={setRoomsData}
        />
      ),
    },
    // {
    //   id: 11,
    //   title: "Listverk og Belistning",
    //   content: (
    //     <ListverkogBelistning
    //       handleNext={handleNext}
    //       handlePrevious={handlePrevious}
    //       ref={(ref: any): void => {
    //         formRefs.current[11] = ref;
    //       }}
    //       roomsData={roomsData}
    //       setRoomsData={setRoomsData}
    //     />
    //   ),
    // },
    {
      id: 11,
      title: "Ventilasjon og Sentralstøvsuger",
      content: (
        <VentilasjonSentralstøvsuger
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          ref={(ref: any): void => {
            formRefs.current[11] = ref;
          }}
          roomsData={roomsData}
          setRoomsData={setRoomsData}
        />
      ),
    },
    {
      id: 12,
      title: "Brannvern",
      content: (
        <Brannvern
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          ref={(ref: any): void => {
            formRefs.current[12] = ref;
          }}
          roomsData={roomsData}
          setRoomsData={setRoomsData}
        />
      ),
    },
    {
      id: 13,
      title: "Tekniske Installasjoner",
      content: (
        <TekniskeInstallasjoner
          handleNext={Next}
          handlePrevious={handlePrevious}
          ref={(ref: any): void => {
            formRefs.current[13] = ref;
          }}
          roomsData={roomsData}
          setRoomsData={setRoomsData}
        />
      ),
    },
    // {
    //   id: 14,
    //   title: "Sluttføring og Dokumentasjon",
    //   content: (
    //     <SluttføringDokumentasjon
    //       handlePrevious={handlePrevious}
    //       Next={Next}
    //       ref={(ref: any): void => {
    //         formRefs.current[14] = ref;
    //       }}
    //       roomsData={roomsData}
    //       setRoomsData={setRoomsData}
    //     />
    //   ),
    // },
    // {
    //   id: 17,
    //   title: "Takrenner/beslag",
    //   content: (
    //     <TakrennerBeslag
    //       handlePrevious={handlePrevious}
    //       Next={Next}
    //       ref={(ref: any): void => {
    //         formRefs.current[17] = ref;
    //       }}
    //       roomsData={roomsData}
    //       setRoomsData={setRoomsData}
    //     />
    //   ),
    // },
  ];

  const wizardInvalidSteps = [
    {
      id: 1,
      title: "Prosjekt- og leveransedetaljer",
      valueName: "Prosjektdetaljer",
    },
    {
      id: 2,
      title: "Grunnmur og pipe",
      valueName: "GrunnerOgSkorstein",
    },
    {
      id: 3,
      title: "Gulv og bjelkelag",
      valueName: "GulvBjelkelagHimling",
    },
    {
      id: 4,
      title: "Yttervegger",
      valueName: "Yttervegger",
    },
    {
      id: 5,
      title: "Tak og taktekking",
      valueName: "TakogTaktekkingTakogTaktekking",
    },
    {
      id: 6,
      title: "Romskjema",
      valueName: "Innervegger",
    },
    {
      id: 7,
      title: "Dører",
      valueName: "Dører",
    },
    {
      id: 8,
      title: "Vinduer",
      valueName: "Vinduer",
    },
    {
      id: 9,
      title: "Trapp og Luker",
      valueName: "TrappogLuker",
    },
    {
      id: 10,
      title: "Balkong & Terrasse",
      valueName: "BalkongTerrasse",
    },
    {
      id: 11,
      title: "Ventilasjon og Sentralstøvsuger",
      valueName: "VentilasjonSentralstøvsuger",
    },
    {
      id: 12,
      title: "Brannvern",
      valueName: "Brannvern",
    },
    {
      id: 13,
      title: "Tekniske Installasjoner",
      valueName: "TekniskeInstallasjoner",
    },
  ];

  useEffect(() => {
    if (roomsData) {
      let firstInvalidStepId: number | null = null;

      for (const step of wizardInvalidSteps) {
        const value = roomsData?.[step.valueName];
        const isEmpty =
          !value ||
          (typeof value === "object" && Object.keys(value).length === 0);

        if (isEmpty) {
          firstInvalidStepId = step.id;
          break;
        }
      }

      if (firstInvalidStepId !== null) {
        setCurrentStep(firstInvalidStepId);
      } else {
        const lastStepId = wizardInvalidSteps[wizardInvalidSteps.length - 1].id;
        setCurrentStep(lastStepId);
      }
    }
  }, [roomsData]);

  return (
    <>
      <div className="bg-lightPurple px-4 md:px-6 desktop:px-8 py-3">
        <h3 className="text-darkBlack font-medium text-xl md:text-[24px] lg:text-[28px] desktop:text-[2rem] desktop:leading-[44.8px] mb-2">
          Boligkonfigurator
        </h3>
        <p className="text-secondary text-sm md:text-base desktop:text-lg">
          Her melder du opp huset til produksjon til BoligPartner.
        </p>
      </div>
      <div className="px-4 md:px-6 desktop:px-8 my-8 md:my-12">
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
