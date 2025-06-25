import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { Spinner } from "../../../../components/Spinner";
import { fetchRoomData } from "../../../../lib/utils";
import Button from "../../../../components/common/button";
// import Ic_multiple_stars from "../../../../assets/images/Ic_multiple_stars.svg";
import { toast } from "react-hot-toast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import AnimatedStars from "../../../../components/ui/star-animation";

export const Floor: React.FC<{ setActiveTab: any }> = ({ setActiveTab }) => {
  const [pdfId, setPdfId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPdfId(params.get("pdf_id"));
  }, []);

  const pathSegments = location.pathname.split("/");
  const id = pathSegments.length > 2 ? pathSegments[2] : null;
  const [loading, setLoading] = useState(true);
  const [FloorData, setFloorData] = useState<any>(null);

  useEffect(() => {
    if (!id || !pdfId) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const getData = async () => {
      const data: any = await fetchRoomData(id);
      if (data) {
        const finalData = data?.Plantegninger.find(
          (item: any) => String(item?.pdf_id) === String(pdfId)
        );
        setFloorData(finalData);
        if (finalData?.rooms && finalData.rooms.length > 0) {
          setLoading(false);
          return;
        }
      }
      try {
        if (pdfId) {
          const husmodellDocRef = doc(db, "room_configurator", String(id));

          const docSnap = await getDoc(husmodellDocRef);
          const existingData = docSnap.exists()
            ? docSnap.data().Plantegninger || []
            : [];

          // Call analyze API for this specific pdfId
          const PDFresponse = await fetch(
            `https://iplotnor-hf-api-version-2.hf.space/analyze/${pdfId}`,
            {
              method: "POST",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                description: "string",
              }),
              mode: "cors",
            }
          );

          if (!PDFresponse.ok) {
            throw new Error(`HTTP error! status: ${PDFresponse.status}`);
          }

          const PDFdata = await PDFresponse.json();

          // Replace only the matching pdf_id entry in existingData
          const updatedPlantegninger = existingData.map((item: any) => {
            if (String(item?.pdf_id) === String(pdfId)) {
              return {
                ...item, // keep original
                ...PDFdata, // override with new fields
              };
            }
            return item; // untouched others
          });

          const formatDate = (date: Date) => {
            return date
              .toLocaleString("sv-SE", { timeZone: "UTC" })
              .replace(",", "");
          };

          await updateDoc(husmodellDocRef, {
            Plantegninger: updatedPlantegninger,
            id: id,
            updatedAt: formatDate(new Date()),
          });

          // update UI
          const finalData = updatedPlantegninger.find(
            (item: any) => String(item?.pdf_id) === String(pdfId)
          );
          setFloorData(finalData);
          toast.success(PDFdata.message, {
            position: "top-right",
          });
          setActiveTab(2);
        }
      } catch (error) {
        console.error("Upload error:", error);
        setLoading(false);
        toast.error("File upload error!", {
          position: "top-right",
        });
      }
      setLoading(false);
    };

    getData();
  }, [id, pdfId, setActiveTab]);

  return (
    <>
      <div className="py-4 px-6">
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
      </div>
      <div className="flex gap-6 px-6 pt-6 pb-[156px]">
        {/* <div className="w-[25%] border border-[#EFF1F5] rounded-lg shadow-shadow2">
          <div className="p-4 border-b border-[#EFF1F5] text-darkBlack text-lg font-medium">
            Romoversikt
          </div>
          <div className="p-4 flex items-center justify-center h-[490px] flex-col gap-6">
            <p className="text-lg text-secondary text-center">
              MinTomt AI analyserer nå <br /> plantegninger og trekker ut
              rommene
            </p>
          </div>
        </div> */}
        <div className="border w-full border-[#B9C0D4] rounded-lg overflow-hidden">
          <img src={FloorData?.image} alt="floor" className="w-full h-full" />
        </div>
      </div>
      <div className="flex justify-end w-full gap-5 items-center fixed bottom-0 bg-white z-50 border-t border-gray2 p-4 left-0">
        <Button
          text="Tilbake"
          className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
          onClick={() => {
            setActiveTab(1);

            const params = new URLSearchParams(location.search);
            params.delete("pdf_id");

            navigate(`${location.pathname}?${params.toString()}`, {
              replace: true,
            });
          }}
        />
        <Button
          text="Neste"
          className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
          onClick={() => {
            setActiveTab(3);
          }}
        />
      </div>
      {loading && (
        <div
          className="justify-center items-center h-full w-full fixed block top-0 left-0 bg-white opacity-75"
          style={{ zIndex: 999 }}
        >
          <span
            className="text-green-500 opacity-100 top-1/2 my-0 mx-auto block relative w-[280px] sm:w-[350px] h-0"
            style={{ top: "50%", zIndex: 9999 }}
          >
            <div className="p-4 flex items-center justify-center flex-col gap-6 w-full">
              <AnimatedStars />
              <p className="text-base md:text-lg text-secondary text-center">
                MinTomt AI analyserer nå <br /> plantegninger og trekker ut
                rommene
              </p>
            </div>
          </span>
        </div>
      )}
    </>
  );
};
