import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Husdetaljer } from "./Husdetaljer";
import { Huskonfigurator } from "./Huskonfigurator";
import { Floor } from "./floor";
import { AllFloor } from "./allFloor";

export const EditHouseModel = () => {
  const [activeTab, setActiveTab] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const activeTabFromParam = params.get("activeTab");
    setActiveTab(Number(activeTabFromParam));
  }, []);

  return (
    <>
      {(activeTab === 0 || activeTab === 1) && (
        <div className="py-4 px-4 md:px-6 bg-lightPurple">
          <div className="flex items-center gap-1.5 mb-4 md:mb-6 flex-wrap">
            <Link
              to={"/Husmodell"}
              className="text-primary text-sm font-medium"
            >
              Boligkonfigurator
            </Link>
            <ChevronRight className="text-[#5D6B98] w-4 h-4" />
            <span className="text-gray text-sm">Legg til kundeinformasjon</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between mb-4 md:mb-5">
            <div>
              {activeTab === 0 && (
                <h1 className="text-darkBlack font-semibold text-2xl md:text-[28px] desktop:text-[32px]">
                  Legg til kundeinformasjon
                </h1>
              )}
              {activeTab === 1 && (
                <h1 className="text-darkBlack font-semibold text-2xl md:text-[28px] desktop:text-[32px] mb-3">
                  Her laster du opp plantegning
                </h1>
              )}
              {activeTab === 1 && (
                <p className="text-secondary">
                  Du må laste opp hvert enkelt plan
                </p>
              )}
            </div>
            <div>
              <div className="flex gap-1.5">
                {["Kundedetaljer", "Plantegninger"]
                  .filter(Boolean)
                  .map((tab, index) => (
                    <button
                      key={tab}
                      onClick={() => {
                        if (location.pathname.includes("/edit-husmodell")) {
                          setActiveTab(index);
                        }
                      }}
                      className={`px-2 md:px-4 py-2 text-sm md:text-base font-medium ${
                        activeTab === index
                          ? "border-b-2 border-purple text-purple"
                          : "text-darkBlack"
                      } ${
                        location.pathname.includes("/edit-husmodell")
                          ? "cursor-pointer"
                          : "cursor-default"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
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
  );
};
