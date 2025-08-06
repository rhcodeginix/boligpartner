import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchAdminDataByEmail, fetchRoomData } from "../../../lib/utils";
import Button from "../../../components/common/button";
import { ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import AnimatedStars from "../../../components/ui/star-animation";

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
  const kundeId = pathSegments.length > 4 ? pathSegments[4] : null;

  const [loading, setLoading] = useState(true);
  const [FloorData, setFloorData] = useState<any>(null);
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

  useEffect(() => {
    if (!id || !pdfId || !kundeId) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const getData = async () => {
      const data: any = await fetchRoomData(kundeId);

      if (data) {
        const finalData = data?.Plantegninger?.find(
          (item: any) => String(item?.pdf_id) === String(pdfId)
        );

        setFloorData(finalData);
        if (finalData?.rooms && finalData.rooms.length > 0) {
          setLoading(false);
          return;
        }
      }
      try {
        const husmodellDocRef = doc(db, "projects", String(kundeId));
        const docSnap = await getDoc(husmodellDocRef);

        const allKundeInfo = docSnap.exists() ? docSnap.data() || {} : {};

        const existingPlantegninger = allKundeInfo.Plantegninger || [];

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

        const updatedPlantegninger = existingPlantegninger.map((item: any) => {
          if (String(item?.pdf_id) === String(pdfId)) {
            return { ...item, ...PDFdata };
          }
          return item;
        });

        const updatedKundeInfo = {
          ...allKundeInfo,
          Plantegninger: updatedPlantegninger,
        };

        const formatDate = (date: Date) => {
          return date
            .toLocaleString("sv-SE", { timeZone: "UTC" })
            .replace(",", "");
        };

        await updateDoc(husmodellDocRef, {
          ...updatedKundeInfo,
          updatedAt: formatDate(new Date()),
        });

        const finalData = updatedPlantegninger.find(
          (item: any) => String(item?.pdf_id) === String(pdfId)
        );

        setFloorData(finalData);
        toast.success(PDFdata.message, { position: "top-right" });
        setActiveTab(3);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("File upload error!", {
          position: "top-right",
        });
      } finally {
        setLoading(false);
      }
      setLoading(false);
    };

    getData();
  }, [id, pdfId, setActiveTab, kundeId]);

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
      </div>
      <div className="flex gap-4 md:gap-6 px-4 md:px-6 pt-6 pb-[136px]">
        <div className="w-full border border-[#B9C0D4] rounded-lg overflow-hidden">
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
