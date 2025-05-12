import React, { useState } from "react";
import Modal from "../../../components/common/modal";
import Ic_trash from "../../../assets/images/Ic_trash.svg";
import Img_noTask from "../../../assets/images/Img_noTask.png";
import Button from "../../../components/common/button";
// import { Spinner } from "../../../components/Spinner";
import { Pencil, Plus } from "lucide-react";
import { AddNewCat } from "../editHusmodel/AddNewCat";
import { Customization } from "./customization";

export const Inventory = () => {
  const [activeTabData, setActiveTabData] = useState<number>(0);
  const [AddCategory, setAddCategory] = useState(false);
  const [Category, setCategory] = useState<any>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editCategory, setEditCategory] = useState<null | {
    index: number;
    data: any;
  }>(null);

  // const [loading, setLoading] = useState(true);

  const handleToggleSubCategoryPopup = () => {
    if (AddCategory) {
      setAddCategory(false);
      setEditCategory(null);
    } else {
      setAddCategory(true);
    }
  };
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedCategories = [...Category];
    const draggedItem = updatedCategories[draggedIndex];

    updatedCategories.splice(draggedIndex, 1);

    updatedCategories.splice(index, 0, draggedItem);

    setCategory(updatedCategories);
    setDraggedIndex(null);
  };

  return (
    <>
      <div className="p-8 flex gap-3 items-center justify-between bg-lightPurple">
        <div>
          <h1 className="text-darkBlack font-medium text-[32px] mb-2">
            Inventar
          </h1>
          <p className="text-secondary text-lg">
            Hovedkategorier med varer, leverandør, pris og arbeidsstruktur
          </p>
        </div>
        <Button
          text="Legg til husmodell"
          className="border border-purple bg-purple text-white text-base rounded-[40px] h-[48px] font-medium relative px-5 py-3 flex items-center gap-2"
          path="/add-husmodell"
        />
      </div>

      <div className="flex gap-6 px-6 pt-6 pb-[156px]">
        <div className="w-[25%] border border-[#EFF1F5] rounded-lg shadow-shadow2 h-[540px]">
          <div className="p-4 border-b border-[#EFF1F5] text-darkBlack text-lg font-medium flex items-center justify-between gap-2">
            <span className="truncate">Housing Configuration Elements</span>
          </div>
          <div className="flex flex-col p-4 pb-0 rounded-lg gap-3 h-full max-h-[calc(100%-129px)] overflow-y-auto overFlowAutoY sticky top-[80px]">
            {Category.length > 0 ? (
              Category.map((tab: any, index: number) => (
                <div
                  key={index}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  className={`bg-white cursor-pointer rounded-lg flex items-center justify-between gap-1 px-3 ${
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
                    <span className="w-[135px] truncate">{tab.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditCategory({ index, data: tab });
                        setAddCategory(true);
                      }}
                    >
                      <Pencil className="w-5 h-5 text-primary" />
                    </div>

                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCategory((prev: any[]) =>
                          prev.filter((_, i) => i !== index)
                        );
                        setActiveTabData(0);
                      }}
                      className="w-5 h-5"
                    >
                      <img
                        src={Ic_trash}
                        alt="delete"
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                  <img src={Img_noTask} alt="no_data" />
                  <h3 className="text-black font-semibold text-center mb-1.5">
                    No Housing Configuration <br /> Elements Added
                  </h3>
                  <p className="text-sm text-center text-secondary">
                    Please Click on Add New button <br /> to add Element
                  </p>
                </div>
              </div>
            )}
          </div>
          <div
            className="flex items-center text-purple gap-2 cursor-pointer py-3 px-6"
            onClick={() => setAddCategory(true)}
            style={{
              boxShadow:
                "0px -3px 4px -2px #1018280F, 0px -4px 8px -2px #1018281A",
            }}
          >
            <div className="flex items-center gap-2 w-full justify-center border-2 border-primary rounded-[40px] p-2">
              <Plus />
              <span className="text-base font-medium whitespace-nowrap">
                Add new
              </span>
            </div>
          </div>
        </div>

        <div className="w-[75%] border border-[#EFF1F5] rounded-lg overflow-hidden h-max">
          <Customization
            // labelName={Category[activeTabData]?.name || ""}
            Category={Category}
            activeTabData={activeTabData}
            setCategory={setCategory}
          />
        </div>
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
              editData={editCategory}
            />
          </div>
        </Modal>
      )}
      {/* {loading && <Spinner />} */}
    </>
  );
};
