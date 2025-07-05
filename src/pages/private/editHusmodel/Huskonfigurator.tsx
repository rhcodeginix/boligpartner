import React, { useEffect, useState } from "react";
import Ic_upload_blue_img from "../../../assets/images/Ic_upload_blue_img.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchHusmodellData } from "../../../lib/utils";
import Button from "../../../components/common/button";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../config/firebaseConfig";
import { toast } from "react-hot-toast";
import * as pdfjsLib from "pdfjs-dist-es5";
import { CircleCheckBig, Pencil, Trash2, X } from "lucide-react";
import Modal from "../../../components/common/modal";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const uploadBase64Image = async (base64: string) => {
  if (!base64) return;

  const base64Size =
    base64.length * (3 / 4) -
    (base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0);
  if (base64Size > 2 * 1024 * 1024) {
    toast.error("Image size must be less than 2MB.", {
      position: "top-right",
    });
    return;
  }

  const fileType = "images";
  const timestamp = Date.now();
  const fileName = `${timestamp}_image.png`;
  const storageRef = ref(storage, `${fileType}/${fileName}`);

  try {
    const snapshot = await uploadString(storageRef, base64, "data_url");
    const url = await getDownloadURL(snapshot.ref);

    return url;
  } catch (error) {
    console.error(`Error uploading base64`, error);
  }
};

export const Huskonfigurator: React.FC<{ setActiveTab: any }> = ({
  setActiveTab,
}) => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const id = pathSegments.length > 2 ? pathSegments[2] : null;
  const kundeId = pathSegments.length > 4 ? pathSegments[4] : null;
  const [loading, setLoading] = useState(true);
  const [roomsData, setRoomsData] = useState<any>([]);
  const navigate = useNavigate();
  const [FileUploadLoading, setFileUploadLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const getData = async () => {
      const data = await fetchHusmodellData(id);

      if (data && data.KundeInfo) {
        const finalData = data.KundeInfo.find(
          (item: any) => item.uniqueId === kundeId
        );
        setRoomsData(finalData?.Plantegninger);
      }
      setLoading(false);
    };

    getData();
  }, [id]);
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }, []);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const convertPdfToImages = async (pdfData: string) => {
    try {
      const loadingTask = pdfjsLib.getDocument({
        data: atob(pdfData.split(",")[1]),
      });
      const pdfDocument = await loadingTask.promise;

      const totalPages = pdfDocument.numPages;

      const images: string[] = [];

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) continue;

        const viewport = page.getViewport({ scale: 1.0 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        const imgDataUrl = canvas.toDataURL("image/png");
        images.push(imgDataUrl);
      }

      return images;
    } catch (err) {
      console.error("Error loading PDF document:", err);
      return [];
    }
  };

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;

    const formData = new FormData();
    formData.append("file", files[0]);
    setFileUploadLoading(true);
    try {
      const response = await fetch(
        "https://iplotnor-hf-api-version-2.hf.space/upload",
        {
          method: "POST",
          headers: {
            accept: "application/json",
          },
          body: formData,
          mode: "cors",
        }
      );

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const data = await response.json();
      if (data && data?.pdf_id) {
        const file = files[0];

        if (file.type === "application/pdf") {
          const base64PDF = await fileToBase64(file);
          const imageBase64Array = await convertPdfToImages(base64PDF);

          if (imageBase64Array.length) {
            const husmodellDocRef = doc(
              db,
              "housemodell_configure_broker",
              String(id)
            );
            const docSnap = await getDoc(husmodellDocRef);
            if (!docSnap.exists()) {
              toast.error("Husmodell not found", { position: "top-right" });
              return;
            }

            const docvData = docSnap.data();
            const existingKundeInfo = docvData.KundeInfo || [];

            const updatedKundeInfo = existingKundeInfo.map((kunde: any) => {
              if (kunde.uniqueId === kundeId) {
                const existingFloors = kunde.Plantegninger || [];
                let newFloors = [...existingFloors];

                imageBase64Array.forEach((imgDataUrl) => {
                  const floorIndex = newFloors.length + 1;
                  const updatedFloor = {
                    ...data,
                    image: imgDataUrl,
                    title: `Romskjema ${floorIndex}`,
                  };

                  newFloors.push(updatedFloor);

                  setRoomsData((prev: any) => [
                    ...(Array.isArray(prev) ? prev : []),
                    updatedFloor,
                  ]);
                });

                return {
                  ...kunde,
                  Plantegninger: newFloors,
                };
              }
              return kunde;
            });

            await updateDoc(husmodellDocRef, {
              KundeInfo: updatedKundeInfo,
              updatedAt: new Date().toISOString(),
            });

            toast.success("PDF uploaded and floors added!", {
              position: "top-right",
            });
          }
        } else if (file.type.startsWith("image/")) {
          const imageBase64 = await fileToBase64(file);
          const finalImageUrl = await uploadBase64Image(imageBase64);

          if (finalImageUrl) {
            const husmodellDocRef = doc(
              db,
              "housemodell_configure_broker",
              String(id)
            );
            const docSnap = await getDoc(husmodellDocRef);
            if (!docSnap.exists()) {
              toast.error("Husmodell not found", { position: "top-right" });
              return;
            }

            const docvData = docSnap.data();
            const existingKundeInfo = docvData.KundeInfo || [];

            const updatedKundeInfo = existingKundeInfo.map((kunde: any) => {
              if (kunde.uniqueId === kundeId) {
                const existingFloors = kunde.Plantegninger || [];
                const newIndex = existingFloors.length + 1;

                const updatedFloor = {
                  ...data,
                  image: finalImageUrl,
                  title: `Romskjema ${newIndex}`,
                };

                setRoomsData((prev: any) => [
                  ...(Array.isArray(prev) ? prev : []),
                  updatedFloor,
                ]);

                return {
                  ...kunde,
                  Plantegninger: [...existingFloors, updatedFloor],
                };
              }
              return kunde;
            });

            await updateDoc(husmodellDocRef, {
              KundeInfo: updatedKundeInfo,
              updatedAt: new Date().toISOString(),
            });

            toast.success(data.message, { position: "top-right" });
          }
        } else {
          console.error("Unsupported file type");
          toast.error("Unsupported file type", { position: "top-right" });
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("File upload error!", { position: "top-right" });
    } finally {
      setFileUploadLoading(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      await handleFileUpload(event.target.files);
    }
  };

  const handleClick = async () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files;

    if (file) {
      handleFileUpload(file);
    }
  };
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedFloorName, setEditedFloorName] = useState<string>("");
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(
    null
  );
  const [updatingIndex, setUpdatingIndex] = useState<number | null>(null);

  const handleDeleteFloor = async (indexToDelete: number) => {
    const husmodellDocRef = doc(db, "housemodell_configure_broker", String(id));

    try {
      const docSnap = await getDoc(husmodellDocRef);
      const docData: any = docSnap.data();
      const existingKundeInfo = docData.KundeInfo || [];

      const updatedKundeInfo = existingKundeInfo.map((kunde: any) => {
        if (kunde.uniqueId === kundeId) {
          const newFloors = (kunde.Plantegninger || []).filter(
            (_: any, i: number) => i !== indexToDelete
          );
          return {
            ...kunde,
            Plantegninger: newFloors,
          };
        }
        return kunde;
      });

      await updateDoc(husmodellDocRef, {
        KundeInfo: updatedKundeInfo,
        updatedAt: new Date().toISOString(),
      });

      const updatedRooms = roomsData.filter(
        (_: any, i: number) => i !== indexToDelete
      );
      setRoomsData(updatedRooms);
      setConfirmDeleteIndex(null);

      toast.success("Floor deleted successfully!", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error deleting floor:", error);
      toast.error("Failed to delete floor", { position: "top-right" });
    }
  };
  const handleConfirmPopup = () => {
    if (confirmDeleteIndex) {
      setConfirmDeleteIndex(null);
    } else {
      setConfirmDeleteIndex(confirmDeleteIndex);
    }
  };

  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>(
    {}
  );

  const handleImageLoad = (index: number) => {
    setImageLoaded((prev) => ({ ...prev, [index]: true }));
  };

  // -----
  const [showConfiguratorModal, setShowConfiguratorModal] = useState(false);
  const [newConfiguratorName, setNewConfiguratorName] = useState("");
  const [pendingPayload, setPendingPayload] = useState<any>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!id) {
        setShowConfiguratorModal(true);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [id]);

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  useEffect(() => {
    if (showConfiguratorModal) {
      setNewConfiguratorName(
        `${pendingPayload?.Anleggsadresse} - ${pendingPayload?.Kundenavn}`
      );
    } else {
      setNewConfiguratorName("");
    }
  }, [showConfiguratorModal, pendingPayload]);

  const isDisable =
    roomsData &&
    roomsData.length > 0 &&
    roomsData.some((room: any) => !room.configurator)
      ? true
      : false;

  return (
    <>
      <div className="px-4 md:px-6 py-5 md:py-6 desktop:p-8">
        <h3 className="text-darkBlack text-2xl font-semibold mb-2">
          Last opp plantegningen din
        </h3>
        <p className="text-secondary text-sm md:text-base desktop:text-lg">
          Velg plan for konfigurering
        </p>
      </div>
      <div className="px-4 md:px-6 py-5 md:py-6 desktop:p-8 mb-[100px]">
        <div
          className="relative p-2 rounded-lg md:w-max"
          style={{
            boxShadow: "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
          }}
        >
          <div
            className="border border-gray2 border-dashed rounded-lg px-2 md:px-3 flex-col items-center justify-center laptop:px-[42px] py-2 md:py-4 flex gap-3 md:gap-6 cursor-pointer w-full"
            onClick={handleClick}
            onDrop={handleDrop}
            onDragStart={handleDragOver}
            onDragOver={(e) => e.preventDefault()}
          >
            <img src={Ic_upload_blue_img} alt="upload" />
            <div className="flex items-center justify-center flex-col gap-3">
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-primary font-medium whitespace-nowrap flex items-center justify-center border-2 border-purple rounded-[40px] h-[32px] md:h-[36px] py-2 px-2 md:px-4 text-sm md:text-base">
                  Bla gjennom
                </span>
                <p className="text-gray text-xs md:text-sm text-center truncate w-full">
                  Slipp filen her for å laste den opp
                </p>
              </div>
              <p className="text-gray text-xs md:text-sm truncate w-full text-center">
                Filformater: Kun JPEG, JPG, PNG, PDF maks 2 MB
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 w-full mt-6 md:mt-8">
          {loading ? (
            <>
              {Array.from({ length: 3 }, (_, i) => i + 1).map((item, index) => {
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
              {roomsData && roomsData.length > 0
                ? roomsData.map((item: any, index: number) => {
                    const isEditing = editIndex === index;
                    const loaded = imageLoaded[index];

                    return (
                      <div
                        key={index}
                        className="relative shadow-shadow2 p-3 md:p-4 rounded-lg flex flex-col gap-3 md:gap-4"
                      >
                        <div className="flex gap-1.5 md:gap-2 items-center justify-between">
                          <div className="flex items-center gap-2">
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
                              <span className="text-darkBlack font-medium truncate">
                                {item?.title || `Floor ${index + 1}`}
                              </span>
                            )}
                            {item.configurator === true && (
                              <CircleCheckBig className="text-darkGreen" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 md:gap-3">
                            {isEditing ? (
                              <button
                                className="bg-purple text-white px-2 md:px-4 py-2 rounded text-sm self-end"
                                disabled={updatingIndex === index}
                                onClick={async (e) => {
                                  setUpdatingIndex(index);
                                  e.preventDefault();
                                  e.stopPropagation();

                                  const updatedRooms = [...roomsData];
                                  updatedRooms[index] = {
                                    ...updatedRooms[index],
                                    title: editedFloorName,
                                  };

                                  setRoomsData(updatedRooms);

                                  const husmodellDocRef = doc(
                                    db,
                                    "housemodell_configure_broker",
                                    String(id)
                                  );
                                  const docSnap = await getDoc(husmodellDocRef);

                                  if (docSnap.exists()) {
                                    const docData = docSnap.data();
                                    const existingKundeInfo =
                                      docData.KundeInfo || [];

                                    const updatedKundeInfo =
                                      existingKundeInfo.map((kunde: any) => {
                                        if (kunde.uniqueId === kundeId) {
                                          return {
                                            ...kunde,
                                            Plantegninger: updatedRooms,
                                          };
                                        }
                                        return kunde;
                                      });

                                    await updateDoc(husmodellDocRef, {
                                      KundeInfo: updatedKundeInfo,
                                      updatedAt: new Date().toISOString(),
                                    });

                                    toast.success("Navn oppdatert!", {
                                      position: "top-right",
                                    });
                                  }
                                  setUpdatingIndex(null);
                                  setEditIndex(null);
                                }}
                              >
                                {updatingIndex === index ? (
                                  <svg
                                    className="animate-spin h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    ></path>
                                  </svg>
                                ) : (
                                  "Oppdater"
                                )}
                              </button>
                            ) : (
                              <Pencil
                                className="w-5 h-5 text-purple cursor-pointer"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setEditIndex(index);
                                  setEditedFloorName(
                                    item?.title || `Floor ${index + 1}`
                                  );
                                }}
                              />
                            )}

                            <Trash2
                              className="w-5 h-5 text-red cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setConfirmDeleteIndex(index);
                              }}
                            />
                          </div>
                        </div>
                        <div className="w-full h-[200px] relative">
                          {!loaded && (
                            <div className="w-full h-full rounded-lg custom-shimmer"></div>
                          )}
                          {item?.image && (
                            <img
                              src={item?.image}
                              alt="floor"
                              className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
                                loaded ? "opacity-100" : "opacity-0"
                              }`}
                              onLoad={() => handleImageLoad(index)}
                              onError={() => handleImageLoad(index)}
                              loading="lazy"
                            />
                          )}
                        </div>
                        <Button
                          text="Konfigurer bolig"
                          className={`border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-10 py-2`}
                          type="button"
                          onClick={() => {
                            if (item?.rooms) {
                              setActiveTab(3);
                            } else {
                              setActiveTab(2);
                            }

                            navigate(`?pdf_id=${item?.pdf_id}`);
                          }}
                        />
                      </div>
                    );
                  })
                : "No Data Found!"}
            </>
          )}
        </div>
      </div>

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
                <div onClick={() => handleDeleteFloor(confirmDeleteIndex)}>
                  <Button
                    text="Bekreft"
                    className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      <div
        className="flex justify-end w-full gap-5 items-center fixed bottom-0 bg-white border-t border-gray2 p-4 left-0"
        style={{
          zIndex: 99999,
        }}
      >
        <Button
          text="Legg inn bestilling"
          className={`border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-10 py-2 ${
            isDisable ? "cursor-not-allowed opacity-50" : ""
          }`}
          type="button"
          onClick={async () => {
            if (isDisable === true) return;
            if (!id || !kundeId) return;
            setIsPlacingOrder(true);
            const formatDate = (date: Date) =>
              date
                .toLocaleString("sv-SE", { timeZone: "UTC" })
                .replace(",", "");

            try {
              const houseData: any = await fetchHusmodellData(id);
              const kundeList = houseData?.KundeInfo || [];

              const targetKundeIndex = kundeList.findIndex(
                (k: any) => String(k.uniqueId) === String(kundeId)
              );
              if (targetKundeIndex === -1) return;

              const refetched = await fetchHusmodellData(id);
              const targetKunde = refetched?.KundeInfo?.find(
                (kunde: any) => String(kunde.uniqueId) === String(kundeId)
              );

              const newId = uuidv4();

              const docRef = doc(db, "room_configurator", newId);
              const docSnap = await getDoc(docRef);

              if (docSnap.exists()) {
                const existingData = docSnap.data();

                if (!existingData?.name) {
                  setPendingPayload(existingData);
                  setShowConfiguratorModal(true);
                  return;
                }

                await updateDoc(docRef, existingData);
              } else {
                if (!newConfiguratorName.trim()) {
                  setPendingPayload({
                    ...targetKunde,
                    createdAt: formatDate(new Date()),
                  });
                  setShowConfiguratorModal(true);
                  return;
                }

                await setDoc(docRef, {
                  ...targetKunde,
                  createdAt: formatDate(new Date()),
                  name: newConfiguratorName.trim(),
                });
              }

              toast.success("Bestillingen er lagt inn!", {
                position: "top-right",
              });
              navigate(`/Room-Configurator/${newId}`);
            } catch (err) {
              console.error("Error saving data:", err);
              toast.error("Noe gikk galt", { position: "top-right" });
            } finally {
              setIsPlacingOrder(false);
            }
          }}
        />
      </div>

      {showConfiguratorModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowConfiguratorModal(false)}
          outSideClick={true}
        >
          <div className="p-6 bg-white rounded-lg shadow-lg relative w-full sm:w-[546px]">
            <X
              className="text-primary absolute top-2.5 right-2.5 w-5 h-5 cursor-pointer"
              onClick={() => {
                setShowConfiguratorModal(false);
              }}
            />
            <h2 className="text-lg font-bold mb-4">
              Sett navn på konfigurasjonen
            </h2>
            <input
              type="text"
              value={newConfiguratorName}
              onChange={(e) => setNewConfiguratorName(e.target.value)}
              placeholder="Skriv inn navn på konfigurator"
              className="bg-white rounded-[8px] border text-black border-gray1 flex h-11 w-full border-input px-[14px] py-[10px] text-base file:border-0 file:bg-transparent file:text-sm file:font-medium  focus-visible:outline-none focus:bg-lightYellow2 disabled:cursor-not-allowed disabled:bg-[#F5F5F5] disabled:hover:border-gray7 focus:shadow-none focus-visible:shadow-none placeholder:text-[#667085] placeholder:text-opacity-55 placeholder:text-base disabled:text-[#767676] focus:shadow-shadow1 mb-4"
            />
            <div className="flex justify-end gap-4">
              <Button
                text="Avbryt"
                className="border border-gray2 text-black"
                onClick={() => {
                  setNewConfiguratorName("");
                  setShowConfiguratorModal(false);
                }}
              />
              <Button
                text="Opprett"
                className="bg-purple text-white"
                onClick={async () => {
                  if (!pendingPayload) return;
                  const newId = uuidv4();
                  const docRef = doc(db, "room_configurator", String(newId));
                  const docSnap = await getDoc(docRef);
                  const formatDate = (date: Date) =>
                    date
                      .toLocaleString("sv-SE", { timeZone: "UTC" })
                      .replace(",", "");
                  if (docSnap.exists()) {
                    await updateDoc(docRef, {
                      ...pendingPayload,
                      name: newConfiguratorName.trim(),
                    });
                  } else {
                    await setDoc(docRef, {
                      ...pendingPayload,
                      name: newConfiguratorName.trim(),
                      createdAt: formatDate(new Date()),
                    });
                  }

                  const houseDocRef = doc(
                    db,
                    "housemodell_configure_broker",
                    String(id)
                  );

                  const houseDocSnap = await getDoc(houseDocRef);

                  if (houseDocSnap.exists()) {
                    const houseData = houseDocSnap.data();
                    const existingKundeInfo = houseData.KundeInfo || [];

                    const updatedKundeInfo = existingKundeInfo.map(
                      (kunde: any) => {
                        // if (kunde.uniqueId === kundeId) {
                        //   return {
                        //     ...kunde,
                        //     Plantegninger: [],
                        //   };
                        // }
                        return kunde;
                      }
                    );

                    await updateDoc(houseDocRef, {
                      KundeInfo: updatedKundeInfo,
                      updatedAt: formatDate(new Date()),
                      placeOrder: true,
                    });
                  }

                  toast.success("Bestillingen er lagt inn!", {
                    position: "top-right",
                  });

                  setShowConfiguratorModal(false);
                  setNewConfiguratorName("");
                  navigate(`/Room-Configurator/${newId}`);
                  setIsPlacingOrder(false);
                }}
              />
            </div>
          </div>
        </Modal>
      )}
      {isPlacingOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center"
          style={{ zIndex: 99999 }}
        >
          <div className="flex flex-col items-center gap-4 bg-white p-3 rounded-lg">
            <span className="text-purple text-base font-medium">
              Overfører til Aktive tiltak...
            </span>
            <div className="w-48 h-1 overflow-hidden rounded-lg">
              <div className="w-full h-full bg-purple animate-[progress_1.5s_linear_infinite] rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {FileUploadLoading && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center"
          style={{ zIndex: 99999 }}
        >
          <div className="flex flex-col items-center gap-4 bg-white p-3 rounded-lg">
            <span className="text-purple text-base font-medium">
              Opplasting...
            </span>
            <div className="w-48 h-1 overflow-hidden rounded-lg">
              <div className="w-full h-full bg-purple animate-[progress_1.5s_linear_infinite] rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
