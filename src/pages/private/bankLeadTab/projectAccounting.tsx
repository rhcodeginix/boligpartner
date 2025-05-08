import React, { useEffect, useState } from "react";
import Ic_info_circle from "../../../assets/images/Ic_info_circle.svg";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import { useLocation } from "react-router-dom";
import { Spinner } from "../../../components/Spinner";
import Button from "../../../components/common/button";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};
export const ProjectAccounting: React.FC<{
  setActiveTab: any;
}> = ({ setActiveTab }) => {
  const [finalData, setFinalData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const husmodellData = finalData?.Prisliste;
  const query = useQuery();
  const houseId = query.get("houseId");

  const [editingPriceIndex, setEditingPriceIndex] = useState<number | null>(
    null
  );
  const [editedPrices, setEditedPrices] = useState<{ [key: number]: string }>(
    {}
  );

  const [editingPriceTomIndex, setEditingPriceTomIndex] = useState<
    number | null
  >(null);
  const [editedPricesTom, setEditedPricesTom] = useState<{
    [key: number]: string;
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const husmodellDocRef = doc(db, "house_model", String(houseId));
        const husmodellDocSnap = await getDoc(husmodellDocRef);

        if (husmodellDocSnap.exists()) {
          setFinalData(husmodellDocSnap.data());
          setLoading(false);
        } else {
          console.error("No document found for husmodell ID.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (houseId) {
      fetchData();
    }
  }, [houseId]);
  const Byggekostnader = husmodellData?.Byggekostnader;

  const totalPrisOfByggekostnader = Byggekostnader
    ? Byggekostnader.reduce((acc: any, prod: any, index: number) => {
        const numericValue = editedPrices[index]
          ? editedPrices[index]
              .replace(/\s/g, "")
              .replace(/\./g, "")
              .replace(",", ".")
          : prod.pris?.replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
        return acc + (numericValue ? parseFloat(numericValue) : 0);
      }, 0)
    : 0;
  const formattedNumberOfByggekostnader =
    totalPrisOfByggekostnader.toLocaleString("nb-NO");

  const Tomtekost = husmodellData?.Tomtekost;

  const totalPrisOfTomtekost = Tomtekost
    ? Tomtekost.reduce((acc: any, prod: any, index: number) => {
        const numericValue = editedPricesTom[index]
          ? editedPricesTom[index]
              .replace(/\s/g, "")
              .replace(/\./g, "")
              .replace(",", ".")
          : prod.pris?.replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
        return acc + (numericValue ? parseFloat(numericValue) : 0);
      }, 0)
    : 0;
  const formattedNumber = totalPrisOfTomtekost.toLocaleString("nb-NO");

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="flex gap-6 px-6 mb-28">
            <div
              className="w-1/2 p-4 border border-gray2 rounded-lg h-max"
              style={{
                boxShadow:
                  "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
              }}
            >
              <div className="text-center p-4 text-black font-medium text-lg bg-[#F9F9FB] mb-5">
                Byggekostnader
              </div>
              {husmodellData?.Byggekostnader?.length > 0 && (
                <div className="flex flex-col gap-5">
                  {husmodellData?.Byggekostnader?.map(
                    (item: any, index: number) => {
                      const isEditing = editingPriceIndex === index;

                      return (
                        <div
                          className="flex items-center gap-2 justify-between"
                          key={index}
                        >
                          <div className="flex items-center gap-2">
                            <img src={Ic_info_circle} alt="icon" />
                            <p className="text-gray text-sm font-medium">
                              {item?.Headline}
                            </p>
                          </div>

                          {isEditing ? (
                            <input
                              inputMode="numeric"
                              type="text"
                              value={editedPrices[index] ?? item.pris ?? ""}
                              onChange={(e) => {
                                setEditedPrices({
                                  ...editedPrices,
                                  [index]: e.target.value.replace(/\D/g, "")
                                    ? new Intl.NumberFormat("no-NO").format(
                                        Number(
                                          e.target.value.replace(/\D/g, "")
                                        )
                                      )
                                    : "",
                                });
                              }}
                              onBlur={() => setEditingPriceIndex(null)}
                              className="focus-within:outline-none placeholder:text-gray rounded-[8px] shadow-shadow1 border border-gray1 py-[6px] px-[10px] w-[140px]"
                            />
                          ) : (
                            <h4
                              className="text-black font-medium text-base cursor-pointer"
                              onClick={() => setEditingPriceIndex(index)}
                            >
                              {editedPrices[index]
                                ? `${editedPrices[index]} NOK`
                                : item?.pris
                                ? `${item.pris} NOK`
                                : "inkl. i tilbud"}
                            </h4>
                          )}
                        </div>
                      );
                    }
                  )}
                  <div className="bg-[#F9F9FB] flex items-center justify-between gap-2 p-2">
                    <div className="flex items-center gap-2">
                      <img src={Ic_info_circle} alt="icon" />
                      <p className="text-gray text-sm font-medium">
                        Antatt prisstigning til den 15.i den måned tømrerne
                        starter
                      </p>
                    </div>
                    <div className="border border-gray2 rounded-lg bg-white py-[10px] px-[14px] flex items-center justify-center text-darkBlack font-medium text-base">
                      221.800 NOK
                    </div>
                  </div>
                  <div className="border-t border-gray2"></div>
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                      <img src={Ic_info_circle} alt="icon" />
                      <p className="text-gray text-lg font-bold">
                        Sum byggkostnader
                      </p>
                    </div>
                    <h4 className="text-black font-bold text-base">
                      {formattedNumberOfByggekostnader} NOK
                    </h4>
                  </div>
                </div>
              )}
            </div>
            <div
              className="w-1/2 p-4 border border-gray2 rounded-lg h-max"
              style={{
                boxShadow:
                  "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
              }}
            >
              <div className="text-center p-4 text-black font-medium text-lg bg-[#F9F9FB] mb-5">
                Tomkostnader
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <img src={Ic_info_circle} alt="icon" />
                    <p className="text-gray text-sm font-medium">Tomtekjøp</p>
                  </div>
                  <input
                    type="text"
                    className="focus-within:outline-none placeholder:text-gray rounded-[8px] shadow-shadow1 border border-gray1 py-[10px] px-[14px] w-[140px]"
                    placeholder="Enter"
                  />
                </div>
                {husmodellData?.Tomtekost.length > 0 &&
                  husmodellData?.Tomtekost?.map((item: any, index: number) => {
                    const isEditing = editingPriceTomIndex === index;

                    return (
                      <div
                        className="flex items-center gap-2 justify-between"
                        key={index}
                      >
                        <div className="flex items-center gap-2">
                          <img src={Ic_info_circle} alt="icon" />
                          <p className="text-gray text-sm font-medium">
                            {item?.Headline}
                          </p>
                        </div>
                        {/* <h4 className="text-black font-medium text-base">
                          {item?.pris ? `${item.pris} NOK` : "inkl. i tilbud"}
                        </h4> */}
                        {isEditing ? (
                          <input
                            inputMode="numeric"
                            type="text"
                            value={editedPricesTom[index] ?? item.pris ?? ""}
                            onChange={(e) => {
                              setEditedPricesTom({
                                ...editedPricesTom,
                                [index]: e.target.value.replace(/\D/g, "")
                                  ? new Intl.NumberFormat("no-NO").format(
                                      Number(e.target.value.replace(/\D/g, ""))
                                    )
                                  : "",
                              });
                            }}
                            onBlur={() => setEditingPriceTomIndex(null)}
                            className="focus-within:outline-none placeholder:text-gray rounded-[8px] shadow-shadow1 border border-gray1 py-[6px] px-[10px] w-[140px]"
                          />
                        ) : (
                          <h4
                            className="text-black font-medium text-base cursor-pointer"
                            onClick={() => setEditingPriceTomIndex(index)}
                          >
                            {editedPricesTom[index]
                              ? `${editedPricesTom[index]} NOK`
                              : item?.pris
                              ? `${item.pris} NOK`
                              : "inkl. i tilbud"}
                          </h4>
                        )}
                      </div>
                    );
                  })}
                <div className="border-t border-gray2"></div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <img src={Ic_info_circle} alt="icon" />
                    <p className="text-gray text-lg font-bold">
                      Sum tomtekostnader
                    </p>
                  </div>
                  <h4 className="text-black font-bold text-base">
                    {formattedNumber} NOK
                  </h4>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end w-full gap-5 items-center fixed bottom-0 bg-white z-50 border-t border-gray2 p-4 left-0">
            <div onClick={() => setActiveTab(1)} className="w-1/2 sm:w-auto">
              <Button
                text="Avbryt"
                className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
              />
            </div>
            <Button
              text="Lagre"
              className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
              type="submit"
              // onClick={() => setActiveTab(3)}
              onClick={() => {
                const updatedHusmodellData = { ...husmodellData };

                if (husmodellData?.Byggekostnader) {
                  updatedHusmodellData.Byggekostnader =
                    husmodellData.Byggekostnader.map(
                      (item: any, index: number) => {
                        return {
                          ...item,
                          pris: editedPrices[index] || item.pris,
                        };
                      }
                    );
                }

                if (husmodellData?.Tomtekost) {
                  updatedHusmodellData.Tomtekost = husmodellData.Tomtekost.map(
                    (item: any, index: number) => {
                      return {
                        ...item,
                        pris: editedPricesTom[index] || item.pris,
                      };
                    }
                  );
                }
                console.log(updatedHusmodellData);

                setActiveTab(3);
              }}
            />
          </div>
        </>
      )}
    </>
  );
};
