import React, { useEffect, useState } from "react";
import Ic_upload_blue_img from "../../../assets/images/Ic_upload_blue_img.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "../../../components/Spinner";
import { fetchHusmodellData } from "../../../lib/utils";
import Button from "../../../components/common/button";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../config/firebaseConfig";
import { toast } from "react-hot-toast";
import * as pdfjsLib from "pdfjs-dist";
import { Pencil, Trash2 } from "lucide-react";
import Modal from "../../../components/common/modal";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

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
  const convertPdfToImage = async (pdfData: string) => {
    try {
      const loadingTask = pdfjsLib.getDocument({
        data: atob(pdfData.split(",")[1]),
      });
      const pdfDocument = await loadingTask.promise;

      const page = await pdfDocument.getPage(1);

      const canvas = document.createElement("canvas");
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      const viewport = page.getViewport({ scale: 1.0 });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      const imgDataUrl = canvas.toDataURL("image/png");
      return imgDataUrl;
    } catch (err) {
      console.error("Error loading PDF document:", err);
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
    setLoading(true);
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

        let imageBase64: string | undefined;

        if (file.type === "application/pdf") {
          const base64PDF = await fileToBase64(file);
          imageBase64 = await convertPdfToImage(base64PDF);
        } else if (file.type.startsWith("image/")) {
          imageBase64 = await fileToBase64(file);
        } else {
          console.error("Unsupported file type");
          setLoading(false);
          return;
        }

        if (imageBase64) {
          const finalImageUrl = await uploadBase64Image(imageBase64);
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

          const formatDate = (date: Date) => {
            return date
              .toLocaleString("sv-SE", { timeZone: "UTC" })
              .replace(",", "");
          };

          const updatedKundeInfo = existingKundeInfo.map((kunde: any) => {
            if (kunde.uniqueId === kundeId) {
              const existingFloors = kunde.Plantegninger || [];
              const newIndex = existingFloors.length + 1;

              const updatedFloor = {
                ...data,
                image: finalImageUrl,
                title: `Floor ${newIndex}`,
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
            updatedAt: formatDate(new Date()),
          });
          toast.success(data.message, {
            position: "top-right",
          });
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      setLoading(false);
      toast.error("File upload error!", {
        position: "top-right",
      });
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

  return (
    <>
      <div className="px-4 md:px-6 py-5 md:py-6 desktop:p-8">
        <h3 className="text-darkBlack text-2xl font-semibold mb-2">
          Last opp plantegningen din
        </h3>
        <p className="text-secondary text-sm md:text-base desktop:text-lg">
          AI har analysert plantegningen og identifisert rommene du kan
          konfigurere. Du kan fritt legge til nye rom eller fjerne eksisterende.
        </p>
      </div>
      <div className="px-4 md:px-6 py-5 md:py-6 desktop:p-8 pb-[100px]">
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
          {roomsData && roomsData.length > 0
            ? roomsData.map((item: any, index: number) => {
                const isEditing = editIndex === index;
                const loaded = imageLoaded[index];

                return (
                  <div
                    key={index}
                    className="relative shadow-shadow2 cursor-pointer p-3 md:p-4 rounded-lg flex flex-col gap-3 md:gap-4"
                    onClick={() => {
                      setActiveTab(2);
                      navigate(`?pdf_id=${item?.pdf_id}`);
                    }}
                  >
                    <div className="flex gap-1.5 md:gap-2 items-center justify-between">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedFloorName}
                          onChange={(e) => setEditedFloorName(e.target.value)}
                          className="border border-gray1 rounded px-2 py-1 w-full"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className="text-darkBlack font-medium truncate">
                          {item?.title || `Floor ${index + 1}`}
                        </span>
                      )}
                      <div className="flex items-center gap-2 md:gap-3">
                        {isEditing ? (
                          <button
                            className="bg-purple text-white px-2 md:px-4 py-2 rounded text-sm self-end"
                            onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();

                              const updatedRooms = [...roomsData];
                              updatedRooms[index] = {
                                ...updatedRooms[index],
                                title: editedFloorName,
                              };

                              setRoomsData(updatedRooms);
                              setEditIndex(null);

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

                                const updatedKundeInfo = existingKundeInfo.map(
                                  (kunde: any) => {
                                    if (kunde.uniqueId === kundeId) {
                                      return {
                                        ...kunde,
                                        Plantegninger: updatedRooms,
                                      };
                                    }
                                    return kunde;
                                  }
                                );

                                await updateDoc(husmodellDocRef, {
                                  KundeInfo: updatedKundeInfo,
                                  updatedAt: new Date().toISOString(),
                                });

                                toast.success("Navn oppdatert!", {
                                  position: "top-right",
                                });
                              }
                            }}
                          >
                            Oppdater
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
                  </div>
                );
              })
            : "No Data Found!"}
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

      {loading && <Spinner />}
    </>
  );
};
