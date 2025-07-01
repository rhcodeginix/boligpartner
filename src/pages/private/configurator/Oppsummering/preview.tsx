export const Preview: React.FC<{ rooms: any }> = ({ rooms }) => {
  return (
    <>
      <h4 className="mb-[20px] text-darkBlack font-semibold text-xl">
        Her følger oppsummering
      </h4>
      <div className="flex flex-col gap-6">
        {rooms &&
          rooms.length > 0 &&
          rooms.map((room: any, index: number) => (
            <div key={index}>
              <h3 className="mb-4 text-darkBlack text-xl font-semibold">
                {room?.title}
              </h3>
              <div className="flex flex-col gap-4">
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 desktop:grid-cols-3 gap-4">
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
                      );
                    })
                  : "Ingen rom funnet."}
              </div>
              {index < rooms.length - 1 && (
                <div className="border-b border-[#DCDFEA] mt-6"></div>
              )}
            </div>
          ))}
      </div>
    </>
  );
};
