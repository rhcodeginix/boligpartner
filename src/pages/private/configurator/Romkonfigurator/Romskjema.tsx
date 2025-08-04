import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../../components/common/button";
import { fetchHusmodellData } from "../../../../lib/utils";
import { Spinner } from "../../../../components/Spinner";

export const Romskjema: React.FC<{ Next: any }> = ({ Next }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const id = pathSegments.length > 2 ? pathSegments[2] : null;
  const kundeId = pathSegments.length > 3 ? pathSegments[3] : null;

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [roomsData, setRoomsData] = useState<any>([]);

  useEffect(() => {
    if (!id || !kundeId) {
      setLoading(false);
      return;
    }
    const getData = async () => {
      const data = await fetchHusmodellData(id);

      if (data && data.KundeInfo) {
        const finalData = data.KundeInfo.find(
          (item: any) => item.uniqueId === kundeId
        );
        setRoomsData(finalData);
      }
      setLoading(false);
    };

    getData();
  }, [id, kundeId]);

  const [activeTab, setActiveTab] = useState("");
  const room =
    roomsData?.Plantegninger &&
    roomsData?.Plantegninger.find((room: any) => room.title === activeTab);

  useEffect(() => {
    if (roomsData?.Plantegninger && roomsData?.Plantegninger.length > 0) {
      setActiveTab(roomsData?.Plantegninger[0]?.title);
    }
  }, [roomsData?.Plantegninger]);

  return (
    <>
      {loading && <Spinner />}
      <div className="bg-lightPurple px-4 md:px-6 lg:px-8 py-3">
        <h3 className="text-darkBlack font-medium text-xl md:text-[24px] lg:text-[28px] desktop:text-[2rem] desktop:leading-[44.8px] mb-2">
          Oppmelding
        </h3>
        <p className="text-secondary text-sm md:text-base desktop:text-lg">
          I denne digitale løypen velger du de ulike leveransedetaljene som
          danner grunnlaget for leveransen fra BoligPartner til forhandler. Når
          du er ferdig med å fylle ut i Boligkonfiguratoren, vil det bli
          generert en Pdf fil. Dette dokumentet laster du opp i dokumentrommet i
          CRM under mappen «til logistikk/oppmelding. Husk å sende inn oppdraget
          «oppmelding» i CRM. Under CRM fanen «Oppmelding» finner du en oversikt
          over hvilke andre dokumenter som må lastes opp, før logistikk kan
          igangsette oppmeldingen»”
        </p>
      </div>
      {/* <div className="px-4 md:px-6 lg:px-8 py-6">
        <h3 className="text-darkBlack text-lg md:text-xl lg:text-2xl font-semibold mb-2">
          Prosjektets plantegning
        </h3>
        <p className="text-secondary text-sm md:text-base desktop:text-lg">
          Her laster du opp plantegninger for hver etasje, og ved å trykke på
          “Neste” vil AI trekke ut alle rommene fra de opplastede
          plantegningene.
        </p>
      </div> */}

      <div className="px-4 md:px-6 lg:px-8 py-6 mb-28">
        <h4 className="uppercase text-darkBlack font-semibold col-span-3 text-sm md:text-base mb-4">
          ROMSKJEMA:
        </h4>

        <div className="col-span-3">
          <div className="bg-gray3 border border-[#EFF1F5] rounded-lg p-2 flex items-center gap-2 mb-3.5">
            {roomsData?.Plantegninger &&
              roomsData?.Plantegninger.map((room: any, index: number) => {
                return (
                  <div
                    key={index}
                    className={`cursor-pointer w-max text-sm md:text-base py-2 px-3 rounded-lg ${
                      activeTab === room?.title
                        ? "bg-white text-purple font-semibold"
                        : "text-black"
                    }`}
                    onClick={() => setActiveTab(room?.title)}
                    style={{
                      boxShadow:
                        activeTab === room?.title
                          ? "0px 1px 2px 0px #1018280D"
                          : "",
                    }}
                  >
                    {room?.title}
                  </div>
                );
              })}
          </div>
          <div className="border border-[#DCDFEA] rounded-lg">
            <h4 className="text-darkBlack font-semibold text-base md:text-lg lg:text-xl p-3 md:p-5 border-b border-[#DCDFEA]">
              Her følger oppsummering av {activeTab}
            </h4>
            <div className="p-3 md:p-5">
              {room && (
                <div className="flex flex-col gap-3 md:gap-4">
                  {room.rooms && room.rooms.length > 0
                    ? room.rooms.map((innerRoom: any, index: number) => {
                        return (
                          <div
                            key={index}
                            className="flex flex-col gap-3 md:gap-4 bg-gray3 p-3 md:p-4 rounded-lg"
                          >
                            <div className="text-black font-semibold text-base md:text-lg">
                              {innerRoom?.name_no || innerRoom?.name}
                            </div>
                            {innerRoom?.Kategorinavn &&
                            innerRoom.Kategorinavn.length > 0 ? (
                              (() => {
                                const allSelectedProducts: any[] = [];
                                innerRoom.Kategorinavn.filter(
                                  (kat: any) => kat.productOptions !== "Text"
                                ).forEach((kat: any) => {
                                  kat?.produkter
                                    ?.filter(
                                      (prod: any) => prod?.isSelected === true
                                    )
                                    .forEach((prod: any) => {
                                      allSelectedProducts.push({
                                        ...prod,
                                        categoryName: kat?.navn,
                                        comment: kat?.comment ?? "",
                                      });
                                    });
                                });

                                return (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 desktop:grid-cols-3 gap-4">
                                    {allSelectedProducts.map(
                                      (prod: any, prodIndex: number) => {
                                        return (
                                          <div
                                            key={prodIndex}
                                            className="flex flex-col cursor-pointer"
                                            onClick={() =>
                                              navigate(
                                                `/se-series/${id}/edit-husmodell/${kundeId}?pdf_id=${room?.pdf_id}&activeTab=3&activeSubTab=${index}`
                                              )
                                            }
                                          >
                                            <div>
                                              <h4 className="text-sm font-medium text-secondary mb-1">
                                                {prod.categoryName}
                                              </h4>
                                              <h3 className="text-darkBlack">
                                                {prod?.Produktnavn}{" "}
                                                {prod?.customText && (
                                                  <span className="text-darkBlack">
                                                    ({prod?.customText})
                                                  </span>
                                                )}
                                              </h3>
                                              <div className="text-darkBlack mt-0.5 text-sm">
                                                {prod.comment}
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                );
                              })()
                            ) : (
                              <div className="text-sm text-gray">
                                Ingen romoversikt funnet.
                              </div>
                            )}
                          </div>
                        );
                      })
                    : "Ingen rom funnet."}
                </div>
              )}
            </div>
          </div>
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
          text="Start oppmelding"
          className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
          onClick={() => {
            Next();
          }}
        />
      </div>
    </>
  );
};
