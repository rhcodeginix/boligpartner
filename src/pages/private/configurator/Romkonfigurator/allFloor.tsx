import React, { useEffect, useState } from "react";
import Modal from "../../../../components/common/modal";
import Ic_trash from "../../../../assets/images/Ic_trash.svg";
import Button from "../../../../components/common/button";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "../../../../components/Spinner";
import { fetchRoomData } from "../../../../lib/utils";
import { ChevronRight, Pencil, Plus, X } from "lucide-react";
import { AddNewCat } from "../../editHusmodel/AddNewCat";
import { Eksterior } from "./Eksterior";

export const AllFloor: React.FC<{ setActiveTab: any }> = ({ setActiveTab }) => {
  const navigate = useNavigate();
  const [activeTabData, setActiveTabData] = useState<number | null>(null);
  const [AddCategory, setAddCategory] = useState(false);
  const [Category, setCategory] = useState<any>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editCategory, setEditCategory] = useState<null | {
    index: number;
    data: any;
  }>(null);

  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const id = pathSegments.length > 2 ? pathSegments[2] : null;
  const [loading, setLoading] = useState(true);

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

  const [pdfId, setPdfId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPdfId(params.get("pdf_id"));
  }, []);

  const [FloorData, setFloorData] = useState<any>(null);

  useEffect(() => {
    if (!id || !pdfId) {
      return;
    }

    const getData = async () => {
      const data: any = await fetchRoomData(id);
      if (data) {
        const finalData = data?.Plantegninger.find(
          (item: any) => String(item?.pdf_id) === String(pdfId)
        );
        setFloorData(finalData);
        setCategory(finalData?.rooms);
      }
      setLoading(false);
    };

    getData();
  }, [id, pdfId]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

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
      <div className="py-4 px-6">
        <div className="flex items-center gap-1.5 mb-6">
          <div
            onClick={() => {
              setActiveTab(2);

              const params = new URLSearchParams(location.search);

              navigate(`${location.pathname}?${params.toString()}`, {
                replace: true,
              });
            }}
            className="text-primary text-sm font-medium cursor-pointer"
          >
            Legg til nytt hus
          </div>
          <ChevronRight className="text-[#5D6B98] w-4 h-4" />
          <span className="text-gray text-sm">Detaljer om gulvet</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-2">
            <h1 className="text-darkBlack font-semibold text-[32px]">
              {FloorData?.title}
            </h1>
            <p className="text-secondary text-lg">
              AI har analysert plantegningen og identifisert rommene du kan
              konfigurere. Du kan fritt legge til nye rom eller fjerne
              eksisterende.
            </p>
          </div>
          {activeTabData !== null && (
            // <img
            //   src={FloorData?.image}
            //   alt="floor"
            //   className="w-[120px] h-[120px] rounded-lg"
            // />
            <img
              src={FloorData?.image}
              alt="floor"
              className="w-[120px] h-[120px] rounded-lg cursor-pointer"
              onClick={() => setIsImageModalOpen(true)}
            />
          )}
        </div>
      </div>
      <div className="flex gap-6 px-6 pt-6 pb-[156px]">
        <div className="w-[25%] border border-[#EFF1F5] rounded-lg shadow-shadow2 h-[690px]">
          <div className="p-4 border-b border-[#EFF1F5] text-darkBlack text-lg font-medium flex items-center justify-between gap-2">
            <span className="truncate">Romoversikt</span>
            <div
              className="flex items-center text-purple gap-2 cursor-pointer"
              onClick={() => setAddCategory(true)}
            >
              <Plus />
              <span className="text-sm font-medium whitespace-nowrap">
                Nytt rom
              </span>
            </div>
          </div>
          <div className="flex flex-col p-4 pb-0 rounded-lg gap-3 h-full max-h-[calc(100%-90px)] overflow-y-auto overFlowAutoY sticky top-[80px]">
            {Category && Category?.length > 0
              ? Category.map((tab: any, index: number) => (
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
                      <span className="w-[135px] truncate">
                        {tab?.name_no === "" || !tab?.name_no
                          ? tab?.name
                          : tab?.name_no}
                      </span>
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
              : "No data found!"}
          </div>
        </div>

        <div className="w-[75%] border border-[#EFF1F5] rounded-lg overflow-hidden h-max p-3">
          {activeTabData !== null ? (
            <Eksterior
              setActiveTab={setActiveTab}
              labelName={Category[activeTabData]?.name || ""}
              Category={Category}
              activeTabData={activeTabData}
              setCategory={setCategory}
            />
          ) : (
            <img src={FloorData?.image} alt="floor" className="w-full h-full" />
          )}
        </div>
      </div>

      {!activeTabData && (
        <div className="flex justify-end w-full gap-5 items-center fixed bottom-0 bg-white z-50 border-t border-gray2 p-4 left-0">
          <div className="flex items-center gap-5">
            <div
              onClick={() => {
                setActiveTab(2);
              }}
            >
              <Button
                text="Tilbake"
                className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
              />
            </div>
            <Button
              text="Neste"
              className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-10 py-2 flex items-center gap-2"
              onClick={() => {
                setActiveTabData(0);
              }}
            />
          </div>
        </div>
      )}
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
              Category={Category}
            />
          </div>
        </Modal>
      )}
      {loading && <Spinner />}

      {isImageModalOpen && (
        <Modal onClose={() => setIsImageModalOpen(false)} isOpen={true}>
          <div className="relative bg-white rounded-[12px] p-4 w-full sm:w-[90vw] max-w-[800px]">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-3 right-3"
            >
              <X className="text-primary" />
            </button>

            <img
              src={FloorData?.image}
              alt="Full view"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </Modal>
      )}
    </>
  );
};
