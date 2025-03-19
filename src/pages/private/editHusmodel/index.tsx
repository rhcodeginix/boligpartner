import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Tabs from "../../../components/ui/tabnav";
import { Husdetaljer } from "./Husdetaljer";
import { Huskonfigurator } from "./Huskonfigurator";
import { Prisliste } from "./Prisliste";

export const EditHouseModel = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabData = [
    { label: "Husdetaljer" },
    { label: "Huskonfigurator" },
    { label: "Prisliste" },
  ];

  return (
    <>
      <div className="py-4 px-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to={"/Husmodeller"} className="text-gray text-sm font-medium">
            Husmodeller
          </Link>
          <ChevronRight className="text-gray2 w-4 h-4" />
          <span className="text-primary text-sm font-medium">
            Endre husmodell
          </span>
        </div>
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-darkBlack font-medium text-[24px]">
            Endre husmodell
          </h1>
          <div className="flex gap-3 items-center">
            <p className="text-gray text-lg">
              Sum antatte anleggskostnader inkl. mva.
            </p>
            <h1 className="text-darkBlack font-bold text-[24px]">
              8.451.200 NOK
            </h1>
          </div>
        </div>
      </div>
      <div>
        <div className="border-b border-gray2 flex items-center justify-between gap-2 mb-6 px-6">
          <Tabs
            tabs={tabData}
            activeTab={activeTab}
            // setActiveTab={setActiveTab}
          />
        </div>
        {activeTab === 0 && <Husdetaljer setActiveTab={setActiveTab} />}
        {activeTab === 1 && <Huskonfigurator setActiveTab={setActiveTab} />}
        {activeTab === 2 && <Prisliste setActiveTab={setActiveTab} />}
      </div>
    </>
  );
};
