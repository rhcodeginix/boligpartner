import React, { useEffect, useState } from "react";
import Ic_upload_blue_img from "../../../../assets/images/Ic_upload_blue_img.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchRoomData } from "../../../../lib/utils";
import Button from "../../../../components/common/button";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../../config/firebaseConfig";
import { toast } from "react-hot-toast";
import * as pdfjsLib from "pdfjs-dist-es5";
import { Pencil, Trash2, X } from "lucide-react";
import Modal from "../../../../components/common/modal";
import { v4 as uuidv4 } from "uuid";
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

export const Huskonfigurator: React.FC<{ setActiveTab: any; Next: any }> = ({
  setActiveTab,
  Next,
}) => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const id = pathSegments.length > 2 ? pathSegments[2] : null;

  const [loading, setLoading] = useState(true);
  const [roomsData, setRoomsData] = useState<any>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const getData = async () => {
      const data = await fetchRoomData(id);

      if (data && data?.Plantegninger) {
        setRoomsData(data?.Plantegninger);
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
      let currentId: string | null = id;

      setLoading(true);

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
      setLoading(true);

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      setLoading(true);

      const data = await response.json();
      if (data && data?.pdf_id && currentId) {
        const file = files[0];
        setLoading(true);

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
            "room_configurator",
            String(currentId)
          );

          const docSnap = await getDoc(husmodellDocRef);
          const existingData = docSnap.exists()
            ? docSnap.data().Plantegninger || []
            : [];
          const newIndex = existingData.length + 1;

          const updatedPdfData = {
            ...data,
            image: finalImageUrl,
            title: `Romskjema ${newIndex}`,
          };
          setRoomsData((prev: any) => [...prev, updatedPdfData]);

          const finalData = [];
          finalData.push(updatedPdfData);

          const updatedPlantegninger = [...existingData, ...finalData];

          const formatDate = (date: Date) => {
            return date
              .toLocaleString("sv-SE", { timeZone: "UTC" })
              .replace(",", "");
          };
          await updateDoc(husmodellDocRef, {
            Plantegninger: updatedPlantegninger,
            id: currentId,
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

  const [updatingIndex, setUpdatingIndex] = useState<number | null>(null);

  const handleDeleteFloor = async (indexToDelete: number) => {
    const husmodellDocRef = doc(db, "room_configurator", String(id));

    try {
      const docSnap = await getDoc(husmodellDocRef);
      const existingData = docSnap.exists()
        ? docSnap.data().Plantegninger || []
        : [];

      const updatedData = existingData.filter(
        (_: any, i: any) => i !== indexToDelete
      );

      await updateDoc(husmodellDocRef, {
        Plantegninger: updatedData,
        updatedAt: new Date().toISOString(),
      });

      setRoomsData(updatedData);
      setConfirmDeleteIndex(null);

      toast.success("Floor deleted successfully!", { position: "top-right" });
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

  const [showConfiguratorModal, setShowConfiguratorModal] = useState(false);
  const [newConfiguratorName, setNewConfiguratorName] = useState("");
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!id) {
        setShowConfiguratorModal(true);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [id]);

  const handleCreateNewConfigurator = async () => {
    const newId = uuidv4();
    const formatDate = (date: Date) => {
      return date.toLocaleString("sv-SE", { timeZone: "UTC" }).replace(",", "");
    };
    const newDocRef = doc(db, "room_configurator", newId);
    await setDoc(newDocRef, {
      createdAt: formatDate(new Date()),
      updatedAt: formatDate(new Date()),
      id: newId,
      name: newConfiguratorName.trim(),
    });

    navigate(`/Room-Configurator/${newId}`);
    setLoading(true);
    setShowConfiguratorModal(false);
  };

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
      <div className="px-8 py-6">
        <h3 className="text-darkBlack text-2xl font-semibold mb-2">
          Opplasting av plantegninger
        </h3>
        <p className="text-secondary text-lg">
          Her laster du opp plantegninger for hver etasje, og ved å trykke på
          “Neste” vil AI trekke ut alle rommene fra de opplastede
          plantegningene.
        </p>
      </div>
      <div className="px-8 pb-[100px]">
        <div
          className="relative p-2 rounded-lg w-max"
          style={{
            boxShadow: "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
          }}
        >
          <div
            className="border border-gray2 border-dashed rounded-lg px-3 flex-col items-center justify-center laptop:px-[42px] py-4 flex gap-6 cursor-pointer w-full"
            onClick={handleClick}
            onDrop={handleDrop}
            onDragStart={handleDragOver}
            onDragOver={(e) => e.preventDefault()}
          >
            <img src={Ic_upload_blue_img} alt="upload" />
            <div className="flex items-center justify-center flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-primary font-medium whitespace-nowrap flex items-center justify-center border-2 border-purple rounded-[40px] h-[36px] py-2 px-4">
                  Bla gjennom
                </span>
                <p className="text-gray text-sm text-center truncate w-full">
                  Slipp filen her for å laste den opp
                </p>
              </div>
              <p className="text-gray text-sm truncate w-full text-center">
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

        <div className="grid grid-cols-3 gap-6 w-full mt-8">
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
                        className="relative shadow-shadow2 p-4 rounded-lg flex flex-col gap-4 justify-between"
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
                              {item?.title || `Floor ${index + 1}`}
                            </span>
                          )}
                          <div className="flex items-center gap-3">
                            {isEditing ? (
                              <button
                                className="bg-purple text-white px-3 py-2 rounded text-sm self-end"
                                disabled={updatingIndex === index}
                                onClick={async (e) => {
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
                                    "room_configurator",
                                    String(id)
                                  );

                                  await updateDoc(husmodellDocRef, {
                                    Plantegninger: updatedRooms,
                                    updatedAt: new Date().toISOString(),
                                  });

                                  toast.success("Navn oppdatert!", {
                                    position: "top-right",
                                  });
                                  setEditIndex(null);
                                  setUpdatingIndex(null);
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
                                className="w-6 h-6 text-purple cursor-pointer"
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
                              className="w-6 h-6 text-red cursor-pointer"
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

      <div className="flex justify-end w-full gap-5 items-center fixed bottom-0 bg-white z-50 border-t border-gray2 p-4 left-0">
        <Button
          text="Avbryt"
          className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
          onClick={() => {
            navigate("/Bolig-configurator");
          }}
        />
        <Button
          text="Neste"
          className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
          onClick={() => {
            Next();
          }}
        />
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

      {showConfiguratorModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowConfiguratorModal(false)}
          outSideClick={true}
        >
          <div className="p-6 bg-white rounded-lg shadow-lg relative">
            <X
              className="text-primary absolute top-2.5 right-2.5 w-5 h-5 cursor-pointer"
              onClick={() => {
                setShowConfiguratorModal(false);
                navigate("/Bolig-configurator");
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
                onClick={handleCreateNewConfigurator}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
