import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Img_plot from "../../../assets/images/Img_plot.png";
import { useState } from "react";
import Tabs from "../../../components/ui/tabnav";
import Button from "../../../components/common/button";
import { Husdetaljer } from "./Husdetaljer";
import { Prisliste } from "./Prisliste";

export const SeHouseModel = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabData = [{ label: "Husdetaljer" }, { label: "Prisliste" }];

  return (
    <>
      <div className="bg-lightPurple py-4 px-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to={"/Husmodeller"} className="text-gray text-sm font-medium">
            Husmodeller
          </Link>
          <ChevronRight className="text-gray2 w-4 h-4" />
          <span className="text-primary text-sm font-medium">Se husmodell</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-4 items-center">
            <img
              src={Img_plot}
              alt="plot-image"
              className="w-[180px] h-[113px]"
            />
            <div className="flex flex-col gap-4">
              <h4 className="text-darkBlack font-medium text-2xl">Almgaard</h4>
              <div className="flex items-center gap-4">
                <div className="text-lg text-darkBlack font-semibold">
                  233 <span className="text-gray font-normal">m2</span>
                </div>
                <div className="h-3 border-l border-gray2"></div>
                <div className="text-lg text-darkBlack font-semibold">
                  5 <span className="text-gray font-normal">soverom</span>
                </div>
                <div className="h-3 border-l border-gray2"></div>
                <div className="text-lg text-darkBlack font-semibold">
                  3 <span className="text-gray font-normal">bad</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray text-sm">Pris fra</p>
            <h5 className="text-darkBlack text-xl font-semibold">
              5.860.000 NOK
            </h5>
          </div>
        </div>
      </div>
      <div className="py-4 px-6">
        <div className="border-b border-gray2 flex items-center justify-between gap-2 mb-6">
          <Tabs
            tabs={tabData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <Button
            text="Endre husmodell"
            className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
            path="/edit-husmodell"
          />
        </div>
        {activeTab === 0 && <Husdetaljer />}
        {activeTab === 1 && <Prisliste />}
      </div>
    </>
  );
};
