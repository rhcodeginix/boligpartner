import { useEffect, useState } from "react";

export const Rooms: React.FC<{ rooms: any }> = ({ rooms }) => {
  const [activeTab, setActiveTab] = useState("");
  useEffect(() => {
    if (rooms && rooms.length > 0) {
      setActiveTab(rooms[0]?.title);
    }
  }, [rooms]);
  const room = rooms && rooms.find((room: any) => room.title === activeTab);

  //   const totalPris = room?.rooms?.reduce((roomAcc: number, innerRoom: any) => {
  //     const sum = innerRoom?.Kategorinavn?.filter(
  //       (kat: any) => kat.productOptions !== "Text"
  //     )?.reduce((katAcc: number, kat: any) => {
  //       const selectedSum = kat?.produkter
  //         ?.filter((prod: any) => prod?.isSelected)
  //         ?.reduce((prodAcc: number, prod: any) => {
  //           return prodAcc + (parseFloat(prod?.pris) || 0);
  //         }, 0);
  //       return katAcc + selectedSum;
  //     }, 0);
  //     return roomAcc + sum;
  //   }, 0);

  const parseNorwegianNumber = (value: string) => {
    if (!value) return 0;
    return parseFloat(value.replace(/\s/g, "").replace(",", ".")) || 0;
  };

  const formatToNorwegianCurrency = (value: number) => {
    return new Intl.NumberFormat("nb-NO", {
      style: "decimal",
      useGrouping: true,
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalPris = room?.rooms?.reduce((roomAcc: number, innerRoom: any) => {
    const sum = innerRoom?.Kategorinavn?.filter(
      (kat: any) => kat.productOptions !== "Text"
    )?.reduce((katAcc: number, kat: any) => {
      const selectedSum = kat?.produkter
        ?.filter((prod: any) => prod?.isSelected)
        ?.reduce((prodAcc: number, prod: any) => {
          return prodAcc + parseNorwegianNumber(prod?.pris);
        }, 0);
      return katAcc + selectedSum;
    }, 0);
    return roomAcc + sum;
  }, 0);
  const formattedTotal = formatToNorwegianCurrency(totalPris);

  return (
    <>
      <div className="px-6 py-8">
        <div className="bg-gray3 border border-[#EFF1F5] rounded-lg p-2 flex items-center gap-2 mb-3.5">
          {rooms &&
            rooms.map((room: any, index: number) => {
              return (
                <div
                  key={index}
                  className={`cursor-pointer w-max py-2 px-3 rounded-lg ${
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
          <h4 className="text-darkBlack font-semibold text-xl p-5 border-b border-[#DCDFEA]">
            Her følger oppsummering av {activeTab}
          </h4>
          <div className="p-5">
            {room && (
              <div className="flex gap-8">
                <div className="w-[70%] flex flex-col gap-4">
                  {room.rooms && room.rooms.length > 0
                    ? room.rooms.map((innerRoom: any, index: number) => {
                        return (
                          <div
                            key={index}
                            className="flex flex-col gap-4 bg-gray3 p-4 rounded-lg"
                          >
                            <div className="text-black font-semibold text-lg">
                              {innerRoom?.name_no || innerRoom?.name}
                            </div>
                            {innerRoom?.Kategorinavn &&
                            innerRoom.Kategorinavn.length > 0 ? (
                              innerRoom.Kategorinavn.filter(
                                (kat: any) => kat.productOptions !== "Text"
                              ).map(
                                (
                                  kat: any,
                                  katIndex: number,
                                  filteredArray: any[]
                                ) => {
                                  const isLast =
                                    katIndex === filteredArray.length - 1;
                                  return (
                                    <div
                                      key={katIndex}
                                      className="flex flex-col gap-4"
                                    >
                                      {kat?.produkter &&
                                        kat?.produkter.length > 0 &&
                                        kat?.produkter
                                          ?.filter(
                                            (prod: any) =>
                                              prod?.isSelected === true
                                          )
                                          .map(
                                            (
                                              prod: any,
                                              prodIndex: number,
                                              filteredArray: any[]
                                            ) => {
                                              const isLast =
                                                prodIndex ===
                                                filteredArray.length - 1;
                                              return (
                                                <div
                                                  key={prodIndex}
                                                  className="flex flex-col gap-4"
                                                >
                                                  <div>
                                                    <div className="flex items-center gap-2 justify-between">
                                                      <div className="flex items-center gap-4">
                                                        {prod?.Hovedbilde &&
                                                        prod?.Hovedbilde
                                                          ?.length > 0 ? (
                                                          <div className="w-[50px] h-[50px]">
                                                            <img
                                                              src={
                                                                prod
                                                                  ?.Hovedbilde[0]
                                                              }
                                                              alt="w-full h-full rounded-lg"
                                                            />
                                                          </div>
                                                        ) : (
                                                          <div className="w-[50px] h-[50px] bg-gray2 rounded-lg"></div>
                                                        )}
                                                        <div>
                                                          <h4 className="text-sm font-medium">
                                                            {kat?.navn}
                                                          </h4>
                                                          <h3 className="text-secondary">
                                                            {prod?.Produktnavn}
                                                          </h3>
                                                        </div>
                                                      </div>
                                                      {prod?.IncludingOffer ? (
                                                        <div className="text-black font-semibold">
                                                          Standard
                                                        </div>
                                                      ) : (
                                                        <div className="text-black font-semibold">
                                                          {prod?.pris
                                                            ? `kr ${prod?.pris}`
                                                            : "-"}
                                                        </div>
                                                      )}
                                                    </div>
                                                    <div className="mt-3 flex items-center gap-3">
                                                      <div className="text-secondary text-sm">
                                                        Leveres av:{" "}
                                                        <span className="text-black">
                                                          Boligpartner
                                                        </span>
                                                      </div>
                                                      {prod?.delieverBy && (
                                                        <div className="flex items-center gap-3">
                                                          <div className="border-l h-[14px] border-[#DCDFEA]"></div>
                                                          <div className="text-secondary text-sm">
                                                            Assembled by:{" "}
                                                            <span className="text-black">
                                                              {prod?.delieverBy}
                                                            </span>
                                                          </div>
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                  {!isLast && (
                                                    <div className="border-b border-[#DCDFEA]"></div>
                                                  )}
                                                </div>
                                              );
                                            }
                                          )}
                                      {!isLast && (
                                        <div className="border-b border-[#DCDFEA]"></div>
                                      )}
                                    </div>
                                  );
                                }
                              )
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
                {room.rooms && room.rooms.length > 0 && (
                  <div className="w-[30%] p-4 bg-[#F5F3FF] h-max rounded-lg flex flex-col gap-3">
                    {room.rooms.map((innerRoom: any, index: number) => {
                      return (
                        <div key={index} className="flex flex-col gap-3">
                          {innerRoom?.Kategorinavn &&
                          innerRoom.Kategorinavn.length > 0 ? (
                            innerRoom.Kategorinavn.filter(
                              (kat: any) => kat.productOptions !== "Text"
                            ).map((kat: any, katIndex: number) => {
                              return (
                                <div
                                  key={katIndex}
                                  className="flex flex-col gap-3"
                                >
                                  {kat?.produkter &&
                                    kat?.produkter.length > 0 &&
                                    kat?.produkter
                                      ?.filter(
                                        (prod: any) => prod?.isSelected === true
                                      )
                                      .map((prod: any, prodIndex: number) => {
                                        return (
                                          <div key={prodIndex}>
                                            <div className="flex items-center gap-1 justify-between">
                                              <h3 className="text-secondary">
                                                {prod?.Produktnavn}
                                              </h3>
                                              {prod?.IncludingOffer ? (
                                                <div className="text-black font-semibold whitespace-nowrap">
                                                  Standard
                                                </div>
                                              ) : (
                                                <div className="text-black font-semibold whitespace-nowrap">
                                                  {prod?.pris
                                                    ? `kr ${prod?.pris}`
                                                    : "-"}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-sm text-gray">
                              Ingen romoversikt funnet.
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div className="border-t border-[#DCDFEA]"></div>
                    <div className="flex items-center gap-2 justify-between">
                      <p className="text-secondary text-sm">
                        Total of Customisation
                      </p>
                      <span className="text-base font-medium text-black">
                        {`kr ${formattedTotal}`}
                      </span>
                    </div>
                    <div className="border-t border-[#DCDFEA]"></div>
                    <div className="flex items-center gap-2 justify-between">
                      <p className="text-red text-sm">
                        House Model Price
                      </p>
                      <span className="text-base font-medium text-red">
                        {/* {`kr ${formattedTotal}`} */}
                        5.210.000 NOK
                      </span>
                    </div>
                    <div className="flex items-center gap-2 justify-between">
                      <p className="text-red text-sm">
                      Total
                      </p>
                      <span className="text-base font-medium text-red">
                        {/* {`kr ${formattedTotal}`} */}
                        5 211 111 kr
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
