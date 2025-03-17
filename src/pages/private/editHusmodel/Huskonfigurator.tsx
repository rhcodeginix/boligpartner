import React, { useState } from "react";
import { Eksterior } from "./Eksterior";

export const Huskonfigurator: React.FC<{ setActiveTab: any }> = ({
  setActiveTab,
}) => {
  const [activeTabData, setActiveTabData] = useState(0);

  const tabData = [
    { label: "Eksteriør", content: <Eksterior setActiveTab={setActiveTab} /> },
    { label: "Carport & utebod" },
    { label: "Inngangsdører" },
    { label: "Gulv & flis" },
    { label: "Interiørfarger" },
    { label: "Bad 1" },
    { label: "Bad 2" },
    { label: "Bad 3" },
    { label: "Ildsted" },
    { label: "Peis" },
    { label: "Innvendige dører" },
    { label: "Listverk" },
  ];

  return (
    <>
      <h3 className="text-darkBlack text-2xl font-semibold mb-8 px-6">
        Her konfigurerer du husmodellen
      </h3>
      <div className="flex gap-6 px-6 relative">
        <div className="w-[20%] flex flex-col bg-[#F9FAFB] p-3 rounded-lg gap-3 h-[690px] overflow-y-auto overFlowAutoY sticky top-[80px]">
          {tabData.map((tab, index) => (
            <button
              key={index}
              className={`text-sm rounded-lg text-darkBlack py-3 px-5 flex items-center gap-2 font-semibold bg-white ${
                activeTabData === index
                  ? "border-2 border-primary bg-lightPurple rounded-t-[12px]"
                  : "border border-gray2"
              }`}
              onClick={() => setActiveTabData(index)}
            >
              <span className="w-5 h-5 rounded-full bg-lightPurple flex items-center justify-center text-darkBlack font-semibold text-xs">
                {index + 1}
              </span>
              {tab.label}
            </button>
          ))}
        </div>
        {tabData.map((tab, index) =>
          activeTabData === index ? (
            <div className="w-[80%] mb-[130px]" key={index}>
              {tab.content || tab.label}
            </div>
          ) : null
        )}
      </div>
    </>
  );
};
