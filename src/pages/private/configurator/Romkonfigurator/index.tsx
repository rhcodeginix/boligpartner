import { useState } from "react";
import { Huskonfigurator } from "./Huskonfigurator";
import { Floor } from "./floor";
import { AllFloor } from "./allFloor";
// import { AllRoomkonfigurator } from "./allRoomConfigurator";

export const Romkonfigurator: React.FC<{ Prev: any; Next: any }> = ({
  // Prev,
  Next,
}) => {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <>
      <div className="mb-12">
        {/* {activeTab === 0 && <AllRoomkonfigurator setActiveTab={setActiveTab} />} */}
        {activeTab === 1 && (
          <Huskonfigurator setActiveTab={setActiveTab} Next={Next} />
        )}
        {activeTab === 2 && <Floor setActiveTab={setActiveTab} />}
        {activeTab === 3 && <AllFloor setActiveTab={setActiveTab} />}
      </div>
    </>
  );
};
