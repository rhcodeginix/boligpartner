import { useState } from "react";
import { Huskonfigurator } from "./Huskonfigurator";
import { Floor } from "./floor";
import { AllFloor } from "./allFloor";
import { AllRoomkonfigurator } from "./allRoomConfigurator";

export const Romkonfigurator: React.FC<{ Prev: any; Next: any }> = ({
  // Prev,
  Next,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <div className="bg-lightPurple px-8 py-3">
        <h3 className="text-darkBlack font-medium text-xl md:text-[24px] lg:text-[28px] desktop:text-[2rem] desktop:leading-[44.8px] mb-2">
          Romkonfigurator
        </h3>
        <p className="text-secondary text-sm md:text-base desktop:text-lg">
          Her laster du opp plantegninger som bruker AI til å trekke ut alle
          rommene, du kan så konfigurere hvert enkelt rom.
        </p>
      </div>
      <div className="mb-12">
        {activeTab === 0 && <AllRoomkonfigurator setActiveTab={setActiveTab} />}
        {activeTab === 1 && <Huskonfigurator setActiveTab={setActiveTab} />}
        {activeTab === 2 && <Floor setActiveTab={setActiveTab} />}
        {activeTab === 3 && (
          <AllFloor setActiveTab={setActiveTab} Next={Next} />
        )}
      </div>
    </>
  );
};
