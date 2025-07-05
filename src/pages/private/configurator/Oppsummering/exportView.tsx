import Ic_logo from "../../../../assets/images/Ic_logo.svg";

function formatPhoneNumber(number: any) {
  let cleaned = number.replace(/[^\d+]/g, "");

  const countryCode = cleaned.slice(0, 3);
  const rest = cleaned.slice(3);

  const grouped = rest.match(/.{1,2}/g).join(" ");

  return `${countryCode} ${grouped}`;
}

export const ExportView: React.FC<{
  rooms: any;
  kundeInfo: any;
  roomsData: any;
}> = ({ rooms, kundeInfo, roomsData }) => {
  return (
    <div className="p-8">
      <div className="flex flex-col gap-6">
        {rooms &&
          rooms.length > 0 &&
          rooms.map((room: any, roomIndex: number) => (
            <div key={roomIndex}>
              <div className="flex flex-col gap-4">
                {room.rooms && room.rooms.length > 0
                  ? room.rooms.map((innerRoom: any, index: number) => {
                      return (
                        <div key={index} className="inner-room-block px-8">
                          {roomIndex === 0 && index === 0 && (
                            <div>
                              <div className="mb-5 flex items-center justify-between">
                                <h4 className="text-darkBlack font-semibold text-xl">
                                  Her følger oppsummering
                                </h4>
                                <img
                                  src={Ic_logo}
                                  alt="logo"
                                  className="w-[200px] lg:w-auto"
                                />
                              </div>
                              <div className="mb-5 flex items-center gap-2 justify-between">
                                <div className="flex flex-col gap-2">
                                  <p className="text-darkBlack">
                                    <span className="font-semibold">
                                      Kundenavn:
                                    </span>{" "}
                                    {kundeInfo?.Kundenavn}
                                  </p>
                                  <p className="text-darkBlack">
                                    <span className="font-semibold">
                                      Kundenummer:
                                    </span>{" "}
                                    {kundeInfo?.Kundenummer}
                                  </p>
                                  <p className="text-darkBlack">
                                    <span className="font-semibold">
                                      Serie:
                                    </span>{" "}
                                    {kundeInfo?.Serie}
                                  </p>
                                  <p className="text-darkBlack">
                                    <span className="font-semibold">
                                      Mobile:
                                    </span>{" "}
                                    {kundeInfo?.mobile &&
                                      formatPhoneNumber(kundeInfo?.mobile)}
                                  </p>
                                </div>
                                <img
                                  src={roomsData?.image}
                                  alt="room"
                                  className="w-[120px] h-[120px]"
                                />
                              </div>
                            </div>
                          )}

                          {index === 0 && (
                            <h3 className="mb-4 text-darkBlack text-xl font-semibold border-t border-gray2">
                              {room?.title}
                            </h3>
                          )}
                          <div className="flex flex-col gap-4 bg-gray3 p-4 rounded-lg">
                            <div className="text-black font-semibold text-lg">
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
                                      });
                                    });
                                });

                                return (
                                  <div className="grid grid-cols-3 gap-4">
                                    {allSelectedProducts.map(
                                      (prod: any, prodIndex: number) => {
                                        return (
                                          <div
                                            key={prodIndex}
                                            className="flex flex-col"
                                          >
                                            <div>
                                              <h4 className="text-sm font-medium text-black mb-1">
                                                {prod.categoryName}
                                              </h4>
                                              <h3 className="text-secondary mb-3">
                                                {prod?.Produktnavn}
                                              </h3>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                              <div className="text-secondary text-sm">
                                                Leveres av:{" "}
                                                <span className="text-black font-medium">
                                                  Boligpartner
                                                </span>
                                              </div>
                                              {prod?.delieverBy && (
                                                <div className="text-secondary text-sm">
                                                  Assembled by:{" "}
                                                  <span className="text-black font-medium">
                                                    {prod?.delieverBy}
                                                  </span>
                                                </div>
                                              )}
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
                        </div>
                      );
                    })
                  : "Ingen rom funnet."}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
