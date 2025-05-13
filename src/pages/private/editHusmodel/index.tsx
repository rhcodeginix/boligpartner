import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Tabs from "../../../components/ui/tabnav";
import { Husdetaljer } from "./Husdetaljer";
import { Huskonfigurator } from "./Huskonfigurator";
import { Floor } from "./floor";
import { AllFloor } from "./allFloor";

export const EditHouseModel = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabData = [{ label: "Kundedetaljer" }, { label: "Plantegninger" }];
  const location = useLocation();

  return (
    <>
      <>
        {(activeTab === 0 || activeTab === 1) && (
          <div className="py-4 px-6 bg-lightPurple">
            <div className="flex items-center gap-1.5 mb-6">
              <Link
                to={"/Husmodell"}
                className="text-primary text-sm font-medium"
              >
                Husmodeller
              </Link>
              <ChevronRight className="text-[#5D6B98] w-4 h-4" />
              <span className="text-gray text-sm">Legg til nytt hus</span>
            </div>
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-darkBlack font-semibold text-[32px]">
                Legg til nytt hus
              </h1>
              {/* <div className="flex gap-3 items-center">
                <p className="text-gray text-lg">
                  Sum antatte anleggskostnader inkl. mva.
                </p>
                <h1 className="text-darkBlack font-bold text-[24px]">
                  {house && house?.pris ? formatCurrency(house?.pris) : "0 NOK"}
                </h1>
              </div> */}
              <div>
                <div className="border border-[#EFF1F5] bg-[#F9F9FB] p-1.5 rounded-lg">
                  <Tabs
                    tabs={tabData}
                    activeTab={activeTab}
                    {...(location.pathname.startsWith("/edit-husmodell")
                      ? { setActiveTab }
                      : {})}
                    // setActiveTab={setActiveTab}
                  />
                </div>
              </div>
            </div>
            {/* {house && (
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={house?.photo}
                  alt="house"
                  className="w-[160px] rounded-lg"
                />
                <div>
                  <h2 className="text-darkBlack font-semibold text-[20px]">
                    {house?.husmodell_name}
                  </h2>
                  <p className="text-gray w-[900px]">{house?.Hustittel}</p>
                </div>
              </div>
            )} */}
          </div>
        )}

        {activeTab === 0 && <Husdetaljer setActiveTab={setActiveTab} />}
        {activeTab === 1 && <Huskonfigurator setActiveTab={setActiveTab} />}
        {activeTab === 2 && <Floor setActiveTab={setActiveTab} />}
        {activeTab === 3 && <AllFloor setActiveTab={setActiveTab} />}
      </>
    </>
  );
};
