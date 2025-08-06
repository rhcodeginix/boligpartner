import React, { useEffect, useState } from "react";
import { Eksterior } from "./Eksterior";
import Modal from "../../../components/common/modal";
import { AddNewCat } from "./AddNewCat";
import Ic_trash from "../../../assets/images/Ic_trash.svg";
import Button from "../../../components/common/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchAdminDataByEmail, fetchProjectsData } from "../../../lib/utils";
import { ChevronRight, Pencil, Plus, X } from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";

export const AllFloor: React.FC<{ setActiveTab: any }> = ({ setActiveTab }) => {
  const navigate = useNavigate();
  const [activeTabData, setActiveTabData] = useState<number | null>(null);
  const [EditTabData, setEditTabData] = useState<number | null>(null);
  const [AddCategory, setAddCategory] = useState(false);
  const [Category, setCategory] = useState<any>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editCategory, setEditCategory] = useState<null | {
    index: number;
    data: any;
  }>(null);

  const [createData, setCreateData] = useState<any>(null);
  useEffect(() => {
    const getData = async () => {
      const data = await fetchAdminDataByEmail();

      if (data) {
        setCreateData(data);
      }
    };

    getData();
  }, []);

  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const id = pathSegments.length > 2 ? pathSegments[2] : null;
  const kundeId = pathSegments.length > 4 ? pathSegments[4] : null;

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
    if (!id || !pdfId || !kundeId) return;

    const getData = async () => {
      const data: any = await fetchProjectsData(kundeId);

      const requiredCategoriesWithProducts = {
        Himlling: [
          {
            Produktnavn: "Mdf panel",
            isSelected: false,
            InfoText: "Beskriv type og farge",
          },
          {
            Produktnavn: "Takplater",
            isSelected: false,
            InfoText: "Beskriv evt avvik fra standard",
          },
          {
            Produktnavn: "Gips",
            isSelected: true,
            InfoText: "Beskriv evt avvik fra standard gips",
          },
          {
            Produktnavn: "Panel",
            isSelected: false,
            InfoText: "Beskriv type og farge",
          },
        ],
        Vegger: [
          // {
          //   Produktnavn: "I henhold til leveransebeskrivelse",
          //   isSelected: true,
          // },
          // { Produktnavn: "5 bords kostmald mdf plate", isSelected: false },
          {
            Produktnavn: "Ubehandlet sponplate",
            isSelected: false,
            InfoText: "Beskriv evt avvik fra standard",
          },
          // { Produktnavn: "Eget valg", isSelected: false },
          {
            Produktnavn: "Gips",
            isSelected: true,
            InfoText: "Beskriv evt avvik fra standard gips",
          },
          {
            Produktnavn: "Mdf panelplater",
            isSelected: false,
            InfoText: "Beskriv type og farge",
          },
          {
            Produktnavn: "Panel",
            isSelected: false,
            InfoText: "Beskriv type og farge",
          },
          {
            Produktnavn: "Annet",
            isSelected: false,
            InfoText: "Beskriv type og farge",
          },
        ],
        Gulv: [
          // { Produktnavn: "Lokalleveranse", isSelected: true },
          // { Produktnavn: "Eikeparkett 3 stavs", isSelected: false },
          // { Produktnavn: "Eikeparkett 1 stavs", isSelected: false },
          // { Produktnavn: "Laminat 1 stavs", isSelected: false },
          // { Produktnavn: "Eget valg", isSelected: false },
          {
            Produktnavn: "Parkett (leveres av forhandler)",
            isSelected: true,
            InfoText: "Beskriv type og farge",
          },
          {
            Produktnavn: "Laminat",
            isSelected: false,
            InfoText: "Beskriv type og farge",
          },
          {
            Produktnavn: "Annet",
            isSelected: false,
            InfoText: "Beskriv type og farge",
          },
        ],
        Talklist: [
          {
            Produktnavn: "I henhold til serie",
            isSelected: true,
          },
          {
            Produktnavn: "Annen type list",
            isSelected: false,
            Type: "HelpText",
          },
          {
            Produktnavn: "Listefritt",
            isSelected: false,
          },
        ],
        Gerikt: [
          {
            Produktnavn: "I henhold til serie",
            isSelected: true,
          },
          {
            Produktnavn: "Annen type list",
            isSelected: false,
            Type: "HelpText",
          },
          {
            Produktnavn: "Listefritt",
            isSelected: false,
          },
        ],
        Gulvlist: [
          {
            Produktnavn: "I henhold til serie",
            isSelected: true,
          },
          {
            Produktnavn: "Annen type list",
            isSelected: false,
            Type: "HelpText",
          },
        ],
      };

      const updatedPlantegninger = (data?.Plantegninger || []).map(
        (floor: any) => {
          if (!Array.isArray(floor.rooms)) return floor;

          // const updatedRooms = floor.rooms.map((room: any) => {
          //   const existingMap = new Map(
          //     (room.Kategorinavn || []).map((k: any) => [k.navn, k])
          //   );

          //   const finalKategorinavn = Object.entries(
          //     requiredCategoriesWithProducts
          //   ).map(([name, produkter]) => {
          //     if (existingMap.has(name)) {
          //       return existingMap.get(name);
          //     }
          //     return {
          //       navn: name,
          //       productOptions: name === "Kommentar" ? "Text" : "Single Select",
          //       produkter,
          //     };
          //   });

          //   return {
          //     ...room,
          //     Kategorinavn: finalKategorinavn,
          //   };
          // });
          const updatedRooms = floor.rooms.map((room: any) => {
            const isWetRoom = /Bad|Vaskerom/i.test(
              room?.name_no || room?.name || ""
            );

            const existingMap: any = new Map(
              (room.Kategorinavn || []).map((k: any) => [k.navn, k])
            );

            const finalKategorinavn = Object.entries(
              requiredCategoriesWithProducts
            )
              .filter(([name]) => !(isWetRoom && name === "Gulvlist"))
              .map(([name, produkter]) => {
                if (isWetRoom && (name === "Vegg" || name === "Vegger")) {
                  const existingProducts =
                    existingMap.get("Vegg")?.produkter || [];

                  return {
                    navn: "Vegg",
                    productOptions: "Single Select",
                    produkter: [
                      {
                        Produktnavn: "Flis",
                        isSelected:
                          existingProducts.find(
                            (p: any) => p.Produktnavn === "Flis"
                          )?.isSelected ?? false,
                        InfoText: "Ev beskriv type og farge",
                      },
                      {
                        Produktnavn: "Baderomsplate",
                        isSelected:
                          existingProducts.find(
                            (p: any) => p.Produktnavn === "Baderomsplate"
                          )?.isSelected ?? false,
                        InfoText: "Beskriv type og farge",
                      },
                      {
                        Produktnavn: "Annet",
                        isSelected:
                          existingProducts.find(
                            (p: any) => p.Produktnavn === "Annet"
                          )?.isSelected ?? false,
                        InfoText: "Beskriv type og farge",
                      },
                    ],
                    comment: existingMap.get("Vegg")?.comment ?? "",
                  };
                }
                if (isWetRoom && name === "Gulv") {
                  const existingProducts =
                    existingMap.get("Gulv")?.produkter || [];

                  return {
                    navn: "Gulv",
                    productOptions: "Single Select",
                    produkter: [
                      {
                        Produktnavn: "Flis",
                        isSelected:
                          existingProducts.find(
                            (p: any) => p.Produktnavn === "Flis"
                          )?.isSelected ?? false,
                        InfoText: "Ev beskriv type og farge",
                      },
                      {
                        Produktnavn: "Belegg",
                        isSelected:
                          existingProducts.find(
                            (p: any) => p.Produktnavn === "Belegg"
                          )?.isSelected ?? false,
                        InfoText: "Beskriv type og farge",
                      },
                      {
                        Produktnavn: "Annet",
                        isSelected:
                          existingProducts.find(
                            (p: any) => p.Produktnavn === "Annet"
                          )?.isSelected ?? false,
                        InfoText: "Beskriv type og farge",
                      },
                    ],
                    comment: existingMap.get("Gulv")?.comment ?? "",
                  };
                }

                if (existingMap.has(name)) {
                  return existingMap.get(name);
                }
                const existingComment = existingMap.get(name)?.comment ?? "";

                return {
                  navn: name,
                  productOptions:
                    name === "Kommentar" ? "Text" : "Single Select",
                  produkter,
                  comment: existingComment,
                };
              });

            return {
              ...room,
              // Kategorinavn: finalKategorinavn,
              Kategorinavn:
                room.Kategorinavn && room.Kategorinavn.length > 0
                  ? room.Kategorinavn
                  : finalKategorinavn,
            };
          });

          return {
            ...floor,
            rooms: updatedRooms,
          };
        }
      );

      const finalData = updatedPlantegninger?.find(
        (item: any) => String(item?.pdf_id) === String(pdfId)
      );

      if (finalData) {
        const filteredRooms = (finalData.rooms || []).filter((room: any) => {
          const roomName = room?.name_no || room?.name || "";
          return !/Terrace|Terrasse/i.test(roomName);
        });

        setFloorData(finalData);
        setCategory(filteredRooms);

        const husmodellDocRef = doc(db, "projects", kundeId);
        await updateDoc(husmodellDocRef, {
          Plantegninger: data.Plantegninger.map((plan: any) => {
            if (String(plan?.pdf_id) === String(pdfId)) {
              return {
                ...plan,
                rooms: filteredRooms,
              };
            }
            return plan;
          }),
        });
      }
    };

    getData();
  }, [id, pdfId, kundeId]);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const activeTabFromParam = params.get("activeTab");
    const activeSubTabFromParam = params.get("activeSubTab");

    if (activeTabFromParam !== null && Category && FloorData) {
      setActiveTabData(Number(activeSubTabFromParam));
      params.delete("activeTab");
      params.delete("activeSubTab");

      const newRelativePathQuery =
        window.location.pathname +
        (params.toString() ? `?${params.toString()}` : "");

      window.history.replaceState(null, "", newRelativePathQuery);
    }
  }, [FloorData, Category]);

  return (
    <>
      <div className="py-4 px-4 md:px-6 bg-lightPurple">
        <div className="flex items-center gap-1.5 mb-4 md:mb-6 flex-wrap">
          <Link to={"/Husmodell"} className="text-primary text-sm font-medium">
            Boligkonfigurator
          </Link>
          <ChevronRight className="text-[#5D6B98] w-4 h-4" />
          <div
            onClick={() => {
              setActiveTab(1);

              const params = new URLSearchParams(location.search);
              params.delete("pdf_id");

              navigate(`${location.pathname}?${params.toString()}`, {
                replace: true,
              });
            }}
            className="text-primary text-sm font-medium cursor-pointer"
          >
            Romskjema
          </div>
          <ChevronRight className="text-[#5D6B98] w-4 h-4" />
          <span className="text-gray text-sm">{FloorData?.title}</span>
        </div>
        <div className="flex items-center justify-between gap-2 md:gap-3">
          <div className="flex flex-col gap-2">
            <h1 className="text-darkBlack font-semibold text-2xl md:text-[28px] desktop:text-[32px]">
              {FloorData?.title}
            </h1>
            <p className="text-secondary text-sm md:text-base desktop:text-lg">
              AI har analysert plantegningen og identifisert rommene du kan
              konfigurere. Du kan fritt legge til nye rom eller fjerne
              eksisterende. Har legger du inn valg for gulv, vegg, himling og
              listverk for de ulike rommene på planet.
            </p>
          </div>
          {activeTabData !== null && (
            <img
              src={FloorData?.image}
              alt="floor"
              className="w-[120px] h-[120px] rounded-lg cursor-pointer"
              onClick={() => setIsImageModalOpen(true)}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 desktop:gap-6 px-4 md:px-6 pt-6 pb-[136px]">
        <div className="w-full lg:w-[30%] desktop:w-[25%] border border-[#EFF1F5] rounded-lg shadow-shadow2 lg:h-[690px]">
          <div className="p-3 md:p-4 border-b border-[#EFF1F5] text-darkBlack text-lg font-medium flex items-center justify-between gap-2">
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
          <div className="flex lg:flex-col p-3 md:p-4 pb-0 rounded-lg gap-3 h-full lg:max-h-[calc(100%-90px)] overflow-y-auto overFlowAutoY sticky top-[80px]">
            {Category.length > 0
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
                    <div className="text-sm text-darkBlack py-3 flex items-center gap-2 font-semibold truncate">
                      <span className="w-5 h-5 rounded-full bg-lightPurple flex items-center justify-center text-darkBlack font-semibold text-xs">
                        {index + 1}
                      </span>
                      <span className="truncate">
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

                          setEditTabData(index);
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
                          const deleteRoomFromFirestore = async () => {
                            if (!id || !kundeId || !pdfId) return;

                            const husmodellDocRef = doc(
                              db,
                              "projects",
                              kundeId
                            );

                            try {
                              const docSnap = await getDoc(husmodellDocRef);
                              if (docSnap.exists()) {
                                const houseData = docSnap.data();
                                const existingPlantegninger =
                                  houseData.Plantegninger || [];

                                const updatedPlantegninger =
                                  existingPlantegninger.map((item: any) => {
                                    if (
                                      String(item?.pdf_id) === String(pdfId)
                                    ) {
                                      return {
                                        ...item,
                                        rooms: item.rooms?.filter(
                                          (_: any, i: number) => i !== index
                                        ),
                                      };
                                    }
                                    return item;
                                  });

                                await updateDoc(husmodellDocRef, {
                                  Plantegninger: updatedPlantegninger,
                                  updatedAt: new Date().toISOString(),
                                  updated_by: createData?.id,
                                });
                              }
                            } catch (error) {
                              console.error(
                                "Error deleting room from Firestore:",
                                error
                              );
                            }
                          };

                          deleteRoomFromFirestore();
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

        <div className="w-full lg:w-[70%] desktop:w-[75%] border border-[#EFF1F5] rounded-lg overflow-hidden h-max p-3">
          {activeTabData !== null ? (
            <Eksterior
              setActiveTab={setActiveTab}
              labelName={
                Category[activeTabData]?.name_no === "" ||
                !Category[activeTabData]?.name_no
                  ? Category[activeTabData]?.name
                  : Category[activeTabData]?.name_no
              }
              Category={Category}
              activeTabData={activeTabData}
              setCategory={setCategory}
              FloorData={FloorData}
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
                setActiveTab(1);
                const params = new URLSearchParams(location.search);
                params.delete("pdf_id");

                navigate(`${location.pathname}?${params.toString()}`, {
                  replace: true,
                });
              }}
            >
              <Button
                text="Avbryt"
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
              EditTabData={EditTabData}
            />
          </div>
        </Modal>
      )}

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
