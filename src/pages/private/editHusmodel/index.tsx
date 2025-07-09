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

  const pathSegments = location.pathname.split("/");
  const kundeId = pathSegments.length > 4 ? pathSegments[4] : null;
  return (
    <>
      <>
        {(activeTab === 0 || activeTab === 1) && (
          <div className="py-4 px-4 md:px-6 bg-lightPurple">
            <div className="flex items-center gap-1.5 mb-4 md:mb-6 flex-wrap">
              <Link
                to={"/Husmodell"}
                className="text-primary text-sm font-medium"
              >
                Husmodeller
              </Link>
              {/* <ChevronRight className="text-[#5D6B98] w-4 h-4" />
              <Link
                to={`/se-series/${id}`}
                className="text-primary text-sm font-medium"
              >
                Kundeopplysninger
              </Link> */}
              <ChevronRight className="text-[#5D6B98] w-4 h-4" />
              <span className="text-gray text-sm">
                {kundeId ? "Romskjema" : "Legg til nytt hus"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between mb-4 md:mb-5">
              <div>
                <h1 className="text-darkBlack font-semibold text-2xl md:text-[28px] desktop:text-[32px] mb-3">
                  {kundeId ? "Romskjema" : "Legg til nytt hus"}
                </h1>
                <p className="text-secondary">
                  Du må laste opp hvert enkelt plan..
                </p>
              </div>
              <div>
                <div className="border border-[#EFF1F5] bg-[#F9F9FB] p-1.5 rounded-lg w-max">
                  <Tabs
                    tabs={tabData}
                    activeTab={activeTab}
                    {...(location.pathname.includes("/edit-husmodell")
                      ? { setActiveTab }
                      : {})}
                  />
                </div>
              </div>
            </div>
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
