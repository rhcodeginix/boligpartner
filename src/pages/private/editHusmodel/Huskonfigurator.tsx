import React, { useState } from "react";
import { Eksterior } from "./Eksterior";
import Modal from "../../../components/common/modal";
import { AddNewCat } from "./AddNewCat";
import Ic_trash from "../../../assets/images/Ic_trash.svg";

export const Huskonfigurator: React.FC<{ setActiveTab: any }> = ({
  setActiveTab,
}) => {
  const [activeTabData, setActiveTabData] = useState(0);
  const [AddCategory, setAddCategory] = useState(false);
  const [Category, setCategory] = useState<any>([]);

  const handleToggleSubCategoryPopup = () => {
    if (AddCategory) {
      setAddCategory(false);
    } else {
      setAddCategory(true);
    }
  };

  return (
    <>
      <h3 className="text-darkBlack text-2xl font-semibold mb-8 px-6">
        Her konfigurerer du husmodellen
      </h3>
      <div className="flex gap-6 px-6 relative">
        <div className="w-[20%] flex flex-col bg-[#F9FAFB] p-3 pb-0 rounded-lg gap-3 h-full max-h-[690px] overflow-y-auto overFlowAutoY sticky top-[80px]">
          {Category.map((tab: any, index: number) => (
            <button
              key={index}
              className={`bg-white rounded-lg flex items-center justify-between gap-2 px-5 ${
                activeTabData === index
                  ? "border-2 border-primary bg-lightPurple rounded-t-[12px]"
                  : "border border-gray2"
              }`}
              onClick={() => setActiveTabData(index)}
            >
              <div className="text-sm text-darkBlack py-3 flex items-center gap-2 font-semibold">
                <span className="w-5 h-5 rounded-full bg-lightPurple flex items-center justify-center text-darkBlack font-semibold text-xs">
                  {index + 1}
                </span>
                {tab.navn}
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCategory((prev: any[]) =>
                    prev.filter((_, i) => i !== index)
                  );
                }}
              >
                <img src={Ic_trash} alt="delete" />
              </div>
            </button>
          ))}
          <div
            className="sticky bottom-0 mb-3 bg-purple border-gray2 rounded-lg p-3 flex items-center gap-2 text-white font-semibold text-sm cursor-pointer"
            onClick={() => setAddCategory(true)}
          >
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-darkBlack text-xs font-semibold bg-white">
              +
            </div>
            Legg til nytt rom/kategori
          </div>
        </div>

        {Category.length > 0 && (
          <div className="w-[80%] mb-[130px]">
            <Eksterior
              setActiveTab={setActiveTab}
              labelName={Category[activeTabData]?.navn || ""}
              Category={Category}
              activeTabData={activeTabData}
              setCategory={setCategory}
            />
          </div>
        )}
      </div>
      {AddCategory && (
        <Modal onClose={handleToggleSubCategoryPopup} isOpen={true}>
          <div className="bg-white relative rounded-[12px] p-6 md:m-0 w-full sm:w-[518px]">
            <h4 className="mb-[20px] text-darkBlack font-medium text-xl">
              Legg til ny underkategori
            </h4>
            <AddNewCat
              onClose={handleToggleSubCategoryPopup}
              setCategory={setCategory}
            />
          </div>
        </Modal>
      )}
    </>
  );
};
