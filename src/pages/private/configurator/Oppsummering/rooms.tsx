import { useEffect, useState } from "react";
import Button from "../../../../components/common/button";
import Drawer from "../../../../components/ui/drawer";
import { X } from "lucide-react";
import { AddFinalSubmission } from "./AddFinalSubmission";
import Modal from "../../../../components/common/modal";
import { Preview } from "./preview";

export const Rooms: React.FC<{
  rooms: any;
  Prev: any;
  roomsData: any;
  loading: any;
}> = ({ rooms, Prev, roomsData, loading }) => {
  const [activeTab, setActiveTab] = useState("");
  useEffect(() => {
    if (rooms && rooms.length > 0) {
      setActiveTab(rooms[0]?.title);
    }
  }, [rooms]);
  const room = rooms && rooms.find((room: any) => room.title === activeTab);

  const [FinalSubmission, setFinalSubmission] = useState(false);

  const handleFinalSubmissionPopup = () => {
    if (FinalSubmission) {
      setFinalSubmission(false);
    } else {
      setFinalSubmission(true);
    }
  };
  const [ModalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => {
    if (ModalOpen) {
      setModalOpen(false);
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <div className="px-6 py-8 mb-[120px]">
        <div className="bg-gray3 border border-[#EFF1F5] rounded-lg p-2 flex items-center gap-2 mb-3.5">
          {loading ? (
            <>
              {Array.from({ length: 3 }, (_, i) => i + 1).map((item, index) => {
                return (
                  <div key={index} className={`w-max py-2 px-3 rounded-lg`}>
                    <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {rooms &&
                rooms.map((room: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className={`cursor-pointer w-max py-2 px-3 rounded-lg ${
                        activeTab === room?.title
                          ? "bg-white text-primary font-semibold"
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
            </>
          )}
        </div>
        <div className="border border-[#DCDFEA] rounded-lg">
          <h4 className="text-darkBlack font-semibold text-xl p-5 border-b border-[#DCDFEA]">
            Her følger oppsummering av {activeTab}
          </h4>
          <div className="p-5">
            {loading ? (
              <>
                {Array.from({ length: 2 }, (_, i) => i + 1).map(
                  (_item, index) => {
                    return (
                      <div
                        key={index}
                        className="flex flex-col gap-4 bg-gray3 p-4 rounded-lg"
                      >
                        <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 desktop:grid-cols-3 gap-4">
                          {Array.from({ length: 4 }, (_, i) => i + 1).map(
                            (_: any, prodIndex: number) => {
                              return (
                                <div key={prodIndex} className="flex flex-col">
                                  <div>
                                    <div className="w-[100px] h-[20px] rounded-lg custom-shimmer mb-1"></div>

                                    <div className="w-[200px] h-[20px] rounded-lg custom-shimmer mb-3"></div>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>

                                    <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </>
            ) : (
              <>
                {room && (
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
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div
        className="flex justify-end w-full gap-5 items-center fixed bottom-0 bg-white border-t border-gray2 p-4 left-0"
        id="export_div"
      >
        <Button
          text="Tilbake"
          className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
          onClick={() => Prev()}
        />
        <Button
          text="Forhåndsvis"
          className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
          onClick={() => setModalOpen(true)}
        />
        <Button
          text="Neste"
          className="border border-primary bg-primary text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
          onClick={() => setFinalSubmission(true)}
        />
      </div>

      <Drawer isOpen={FinalSubmission} onClose={handleFinalSubmissionPopup}>
        <h4 className="text-darkBlack font-medium text-lg md:text-xl lg:text-2xl bg-[#F9F9FB] flex items-center gap-2 justify-between p-4 md:p-6">
          Fullfør innsending av tilak
          <X
            onClick={() => setFinalSubmission(false)}
            className="text-primary cursor-pointer"
          />
        </h4>
        <AddFinalSubmission
          onClose={() => setFinalSubmission(false)}
          rooms={rooms}
          roomsData={roomsData}
        />
      </Drawer>

      {ModalOpen && (
        <Modal onClose={handleModalOpen} isOpen={true}>
          <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg relative h-auto max-h-[90vh] overflow-y-auto w-[100vw] lg:w-[70vw]">
            <X
              className="text-primary absolute top-2.5 right-2.5 w-5 h-5 cursor-pointer"
              onClick={() => setModalOpen(false)}
            />

            <Preview rooms={rooms} />
          </div>
        </Modal>
      )}
    </>
  );
};
