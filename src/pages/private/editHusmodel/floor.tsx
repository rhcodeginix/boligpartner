import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "../../../components/Spinner";
import { fetchHusmodellData } from "../../../lib/utils";
import Button from "../../../components/common/button";
import { ChevronRight } from "lucide-react";
// import Ic_multiple_stars from "../../../assets/images/Ic_multiple_stars.svg";
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
  const [loading, setLoading] = useState(true);
  const [FloorData, setFloorData] = useState<any>(null);

  useEffect(() => {
    if (!id || !pdfId) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const getData = async () => {
      const data: any = await fetchHusmodellData(id);
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
          const husmodellDocRef = doc(
            db,
            "housemodell_configure_broker",
            String(id)
          );

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
          setActiveTab(3);
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
      <div className="py-4 px-6 bg-lightPurple">
        <div className="flex items-center gap-1.5 mb-6">
          <Link to={"/Husmodell"} className="text-primary text-sm font-medium">
            Husmodeller
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
            Legg til nytt hus
          </div>
          <ChevronRight className="text-[#5D6B98] w-4 h-4" />
          <span className="text-gray text-sm">Detaljer om gulvet</span>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-darkBlack font-semibold text-[32px]">
            {FloorData?.title}
          </h1>
          <p className="text-secondary text-lg">
            Our AI will auto detect your floor plan and how you customisation
            options
          </p>
        </div>
      </div>
      <div className="flex gap-6 px-6 pt-6 pb-[156px]">
        <div className="w-[25%] border border-[#EFF1F5] rounded-lg shadow-shadow2">
          <div className="p-4 border-b border-[#EFF1F5] text-darkBlack text-lg font-medium">
            {FloorData?.title} Information
          </div>
          <div className="p-4 flex items-center justify-center h-[490px] flex-col gap-6">
            {/* <img src={Ic_multiple_stars} alt="star" /> */}
            <AnimatedStars />
            <p className="text-lg text-secondary text-center">
              AI fetching the details <br /> about all rooms in this floor
            </p>
          </div>
        </div>
        <div className="w-[75%] border border-[#B9C0D4] rounded-lg overflow-hidden h-[551px]">
          <img
            src={FloorData?.image}
            alt="floor"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="flex justify-end w-full gap-5 items-center fixed bottom-0 bg-white z-50 border-t border-gray2 p-4 left-0">
        <Button
          text="Avbryt"
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
          text="Lagre"
          className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
          onClick={() => {
            setActiveTab(3);
          }}
        />
      </div>
      {loading && <Spinner />}
    </>
  );
};
