import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import Button from "../../../../components/common/button";
import { toast } from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import Modal from "../../../../components/common/modal";
import Ic_mintomt from "../../../../assets/images/Ic_mintomt.svg";
import { RoomTable } from "./RoomTable";
import { Spinner } from "../../../../components/Spinner";
import { fetchAdminDataByEmail } from "../../../../lib/utils";

export const AllRoomkonfigurator: React.FC = () => {
  const navigate = useNavigate();
  const [RoomConfigurator, setRoomConfigurator] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGridView, setIsGridView] = useState(false);

  const [IsAdmin, setIsAdmin] = useState<any>(null);
  const [office, setOfice] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchAdminDataByEmail();
      if (data) {
        if (data?.office) {
          setOfice(data?.office);
        }
        setIsAdmin(data?.is_admin ?? false);
      }
    };

    getData();
  }, []);

  const fetchRoomConfiguratorData = async () => {
    setIsLoading(true);
    try {
      let q;
      if (IsAdmin) {
        q = query(
          collection(db, "projects"),
          where("placeOrder", "==", true),
          where("is_deleted", "==", false)
        );
      } else {
        q = query(
          collection(db, "projects"),
          where("placeOrder", "==", true),
          where("office_id", "==", office),
          where("is_deleted", "==", false)
        );
      }
      const querySnapshot = await getDocs(q);

      const data: any = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a: any, b: any) => {
          const dateA = a.createdAt?.toDate
            ? a.createdAt.toDate()
            : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate
            ? b.createdAt.toDate()
            : new Date(b.createdAt);
          return dateB - dateA;
        });

      const allKunder = data.flatMap((item: any) => {
        return {
          ...item,
          photo: item.photo || null,
          name: item.name || "-",
          self_id: item?.self_id,
          parentId: item.category_id,
        };
      });

      setRoomConfigurator(allKunder);
    } catch (error) {
      console.error("Error fetching husmodell data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (IsAdmin !== null || office !== null) {
      fetchRoomConfiguratorData();
    }
  }, [isGridView, office, IsAdmin]);

  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>(
    {}
  );

  const handleImageLoad = (index: number) => {
    setImageLoaded((prev) => ({ ...prev, [index]: true }));
  };
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedFloorName, setEditedFloorName] = useState<string>("");
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(
    null
  );
  const [id, setId] = useState(null);
  const [selectedId, setSelectedId] = useState<any>(null);

  const handleDelete = async (entryId: string) => {
    setIsSubmitLoading(true);

    try {
      const formatDate = (date: Date) =>
        date.toLocaleString("sv-SE", { timeZone: "UTC" }).replace(",", "");
      const now = new Date();

      const ref = doc(db, "projects", entryId);
      await updateDoc(ref, {
        is_deleted: true,
        deleted_at: formatDate(now),
      });
      fetchRoomConfiguratorData();
      setId(null);
      setSelectedId(null);
    } catch (error) {
      console.error("Error deleting entry from KundeInfo:", error);
      toast.error("Noe gikk galt ved sletting.");
    } finally {
      setIsSubmitLoading(false);
    }
  };
  const handleConfirmPopup = () => {
    if (confirmDeleteIndex) {
      setConfirmDeleteIndex(null);
    } else {
      setConfirmDeleteIndex(confirmDeleteIndex);
    }
  };

  return (
    <>
      {isSubmitLoading && <Spinner />}

      <div className="py-4 px-4 md:px-6 lg:px-8 flex flex-col sm:flex-row justify-end gap-3 md:gap-4">
        <Button
          text={isGridView ? "Bytt til listevisning" : "Bytt til gridvisning"}
          className="border border-gray2 text-black text-base rounded-[40px] h-[44px] md:h-[48px] font-medium relative px-5 py-3 flex items-center gap-2"
          onClick={() => setIsGridView(!isGridView)}
        />
        {/* <Button
          text="Legg til ny romkonfigurator"
          className="border border-primary bg-primary text-white text-base rounded-[40px] h-[44px] md:h-[48px] font-medium relative px-5 py-3 flex items-center gap-2"
          onClick={() => navigate("/Room-Configurator")}
        /> */}
      </div>
      {isGridView ? (
        <div className="p-4 md:p-6 lg:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 desktop:grid-cols-4 gap-x-6 gap-y-[40px]">
          {isLoading ? (
            <>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((_, index) => {
                return (
                  <div
                    key={index}
                    className="relative shadow-shadow2 p-3 md:p-4 rounded-lg flex flex-col gap-3 md:gap-4"
                  >
                    <div className="flex gap-1.5 md:gap-2 items-center justify-between">
                      <div
                        className="w-[80px] h-[20px] rounded-lg custom-shimmer"
                        style={{ borderRadius: "8px" }}
                      ></div>
                      <div className="flex items-center gap-2 md:gap-3">
                        <div
                          className="w-[80px] h-[20px] rounded-lg custom-shimmer"
                          style={{ borderRadius: "8px" }}
                        ></div>

                        <div
                          className="w-[80px] h-[20px] rounded-lg custom-shimmer"
                          style={{ borderRadius: "8px" }}
                        ></div>
                      </div>
                    </div>

                    <div className="w-full h-[200px] relative">
                      <div
                        className="w-ull h-full rounded-lg custom-shimmer"
                        style={{ borderRadius: "8px" }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {RoomConfigurator && RoomConfigurator.length > 0
                ? RoomConfigurator?.map((item: any, index: number) => {
                    const loaded = imageLoaded[index];
                    const isEditing = editIndex === index;

                    return (
                      <div
                        key={index}
                        className="relative shadow-shadow2 cursor-pointer p-4 rounded-lg flex flex-col justify-between gap-4"
                        onClick={() => {
                          navigate(
                            `/Room-Configurator/${item?.parentId}/${item?.self_id}`
                          );
                          const currIndex = 0;
                          const currVerticalIndex = 1;
                          localStorage.setItem(
                            "currIndexBolig",
                            currIndex.toString()
                          );
                          localStorage.setItem(
                            "currVerticalIndex",
                            currVerticalIndex.toString()
                          );
                        }}
                      >
                        <div className="flex gap-2 items-center justify-between">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedFloorName}
                              onChange={(e) =>
                                setEditedFloorName(e.target.value)
                              }
                              className="border border-gray1 rounded px-2 py-1 w-full"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span className="text-darkBlack font-medium">
                              {item?.name}
                            </span>
                          )}
                          <div className="flex items-center gap-3">
                            {isEditing ? (
                              <button
                                className="bg-primary text-white px-3 py-2 rounded text-sm self-end"
                                onClick={async (e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const updatedRooms = [...RoomConfigurator];

                                  updatedRooms[index] = {
                                    ...updatedRooms[index],
                                    name: editedFloorName,
                                  };

                                  setRoomConfigurator(updatedRooms);
                                  setEditIndex(null);

                                  const husmodellDocRef = doc(
                                    db,
                                    "projects",
                                    String(id)
                                  );

                                  await updateDoc(husmodellDocRef, {
                                    name: editedFloorName,
                                    createdAt: new Date().toISOString(),
                                  });

                                  toast.success("Navn oppdatert!", {
                                    position: "top-right",
                                  });
                                }}
                              >
                                Oppdater
                              </button>
                            ) : (
                              <Pencil
                                className="w-5 h-5 text-primary cursor-pointer"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setEditIndex(index);
                                  setEditedFloorName(item?.name);
                                  setId(item?.self_id);
                                }}
                              />
                            )}

                            <Trash2
                              className="w-5 h-5 text-red cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setConfirmDeleteIndex(index);
                                setId(item?.self_id);
                                setSelectedId(item?.self_id);
                              }}
                            />
                          </div>
                        </div>
                        <div className="w-full h-[200px] relative">
                          {item?.Plantegninger?.[0]?.image ? (
                            <>
                              {!loaded && (
                                <div className="w-full h-full rounded-lg custom-shimmer absolute top-0 left-0"></div>
                              )}
                              <img
                                src={item.Plantegninger[0].image}
                                alt="floor"
                                className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
                                  loaded ? "opacity-100" : "opacity-0"
                                }`}
                                onLoad={() => handleImageLoad(index)}
                                onError={() => handleImageLoad(index)}
                                loading="lazy"
                              />
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center rounded-lg border border-gray2">
                              <img src={Ic_mintomt} alt="logo" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                : "No Data found."}
            </>
          )}
        </div>
      ) : (
        <div className="p-4 md:p-6 lg:p-8">
          <RoomTable />
        </div>
      )}

      {confirmDeleteIndex !== null && (
        <Modal onClose={handleConfirmPopup} isOpen={true}>
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg font-bold">
                Er du sikker på at du vil slette?
              </p>
              <div className="flex justify-center mt-5 w-full gap-5 items-center">
                <div onClick={() => setConfirmDeleteIndex(null)}>
                  <Button
                    text="Avbryt"
                    className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                  />
                </div>
                <div onClick={() => handleDelete(selectedId)}>
                  <Button
                    text="Bekreft"
                    className="border border-primary bg-primary text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
