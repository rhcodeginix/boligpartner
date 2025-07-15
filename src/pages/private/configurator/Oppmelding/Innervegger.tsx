import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem } from "../../../../components/ui/form";
import Button from "../../../../components/common/button";
import { z } from "zod";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Input } from "../../../../components/ui/input";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { removeUndefinedOrNull } from "./Yttervegger";
import { Spinner } from "../../../../components/Spinner";

const formSchema = z.object({
  Innervegger: z
    .object({
      type: z.string(),
      colorCode: z.string().optional(),
    })
    .optional(),
});

export const Innervegger = forwardRef(
  (
    {
      handleNext,
      handlePrevious,
      roomsData,
      setRoomsData,
    }: {
      handleNext: () => void;
      handlePrevious: () => void;
      roomsData: any;
      setRoomsData: any;
    },
    ref
  ) => {
    const location = useLocation();
    const pathSegments = location.pathname.split("/");
    const id = pathSegments.length > 2 ? pathSegments[2] : null;

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        Innervegger: {
          type: "",
          colorCode: "",
        },
      },
    });
    useImperativeHandle(ref, () => ({
      validateForm: async () => {
        const valid = await form.trigger();
        return valid;
      },
    }));
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
      setIsSubmitLoading(true);

      try {
        const husmodellDocRef = doc(db, "room_configurator", String(id));

        const formatDate = (date: Date) => {
          return date
            .toLocaleString("sv-SE", { timeZone: "UTC" })
            .replace(",", "");
        };
        const husmodellSnap = await getDoc(husmodellDocRef);

        if (!husmodellSnap.exists()) {
          throw new Error("Document does not exist!");
        }
        const existingData = husmodellSnap.data();

        const filteredData = removeUndefinedOrNull(data);
        const mergedData = {
          ...existingData,
          Innervegger: filteredData,
          id: id,
          updatedAt: formatDate(new Date()),
        };
        setRoomsData(mergedData);

        await updateDoc(husmodellDocRef, mergedData);
        toast.success("Lagret", {
          position: "top-right",
        });
        handleNext();
        localStorage.setItem("currVerticalIndex", String(7));
      } catch (error) {
        console.error("error:", error);
        toast.error("Something went wrong!", {
          position: "top-right",
        });
      } finally {
        setIsSubmitLoading(false);
      }
    };
    const InnerveggerOptions = [
      "Standard 70 mm isolasjon",
      "100 mm mineralull 36",
    ];

    useEffect(() => {
      if (roomsData && roomsData?.Innervegger) {
        Object.entries(roomsData?.Innervegger).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            form.setValue(key as any, value);
          }
        });
      }
    }, [roomsData]);

    const [activeTab, setActiveTab] = useState("");
    useEffect(() => {
      if (roomsData?.Plantegninger && roomsData?.Plantegninger.length > 0) {
        setActiveTab(roomsData?.Plantegninger[0]?.title);
      }
    }, [roomsData?.Plantegninger]);
    const room =
      roomsData?.Plantegninger &&
      roomsData?.Plantegninger.find((room: any) => room.title === activeTab);

    return (
      <>
        {isSubmitLoading && <Spinner />}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <div className="border border-[#B9C0D4] rounded-lg">
            <div className="text-darkBlack font-semibold text-base md:text-lg p-3 md:p-5 border-b border-[#B9C0D4]">
                Oppbygging innervegg
              </div>
              <div className="p-3 md:p-5">
                <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5 md:items-center">
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="Innervegger"
                      render={() => {
                        const selected = form.watch("Innervegger");

                        return (
                          <FormItem>
                            <p className="mb-2 font-medium text-darkBlack text-sm">
                              Velg ett alternativ:
                            </p>
                            <div className="flex flex-col gap-4">
                              {InnerveggerOptions.map((option) => {
                                const isSelected = selected?.type === option;

                                return (
                                  <div
                                    key={option}
                                    className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5"
                                  >
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="Innervegger"
                                        value={option}
                                        checked={isSelected}
                                        onChange={() =>
                                          form.setValue("Innervegger", {
                                            type: option,
                                            colorCode: "",
                                          })
                                        }
                                        className="h-4 w-4 accent-[#444CE7]"
                                      />
                                      <span className="text-black text-sm">
                                        {option}
                                      </span>
                                    </label>
                                    {option !== "Standard 70 mm isolasjon" && (
                                      <div className="col-span-2">
                                        <Input
                                          placeholder="Beskriv hvilke vegger dette gjelder"
                                          value={
                                            isSelected
                                              ? selected?.colorCode || ""
                                              : ""
                                          }
                                          onChange={(e: any) => {
                                            if (isSelected) {
                                              form.setValue("Innervegger", {
                                                type: option,
                                                colorCode: e.target.value,
                                              });
                                            }
                                          }}
                                          className={`bg-white rounded-[8px] border text-black border-gray1`}
                                          disable={!isSelected}
                                        />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                  <div className="border-t border-[#B9C0D4] col-span-3 my-1"></div>
                  <h4 className="uppercase text-darkBlack font-semibold col-span-3 text-sm md:text-base">
                    ROMSKJEMA:
                  </h4>

                  <div className="col-span-3">
                    <div className="bg-gray3 border border-[#EFF1F5] rounded-lg p-2 flex items-center gap-2 mb-3.5">
                      {roomsData?.Plantegninger &&
                        roomsData?.Plantegninger.map(
                          (room: any, index: number) => {
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
                          }
                        )}
                    </div>
                    <div className="border border-[#DCDFEA] rounded-lg">
                      <h4 className="text-darkBlack font-semibold text-base md:text-lg lg:text-xl p-3 md:p-5 border-b border-[#DCDFEA]">
                        Her følger oppsummering av {activeTab}
                      </h4>
                      <div className="p-3 md:p-5">
                        {room && (
                          <div className="flex flex-col gap-3 md:gap-4">
                            {room.rooms && room.rooms.length > 0
                              ? room.rooms.map(
                                  (innerRoom: any, index: number) => {
                                    return (
                                      <div
                                        key={index}
                                        className="flex flex-col gap-3 md:gap-4 bg-gray3 p-3 md:p-4 rounded-lg"
                                      >
                                        <div className="text-black font-semibold text-base md:text-lg">
                                          {innerRoom?.name_no ||
                                            innerRoom?.name}
                                        </div>
                                        {innerRoom?.Kategorinavn &&
                                        innerRoom.Kategorinavn.length > 0 ? (
                                          (() => {
                                            const allSelectedProducts: any[] =
                                              [];
                                            innerRoom.Kategorinavn.filter(
                                              (kat: any) =>
                                                kat.productOptions !== "Text"
                                            ).forEach((kat: any) => {
                                              kat?.produkter
                                                ?.filter(
                                                  (prod: any) =>
                                                    prod?.isSelected === true
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
                                                  (
                                                    prod: any,
                                                    prodIndex: number
                                                  ) => {
                                                    return (
                                                      <div
                                                        key={prodIndex}
                                                        className="flex flex-col"
                                                      >
                                                        <div>
                                                          <h4 className="text-sm font-medium text-black mb-1">
                                                            {prod.categoryName}
                                                          </h4>
                                                          <h3 className="text-secondary">
                                                            {prod?.Produktnavn}{" "}
                                                            {prod?.customText && (
                                                              <span className="text-darkBlack">
                                                                (
                                                                {
                                                                  prod?.customText
                                                                }
                                                                )
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
                                  }
                                )
                              : "Ingen rom funnet."}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end w-full gap-5 items-center sticky bottom-0 bg-white z-50 border-t border-[#B9C0D4] rounded-b-lg p-4">
                <div
                  onClick={() => {
                    form.reset();
                    handlePrevious();
                    localStorage.setItem("currVerticalIndex", String(5));
                  }}
                >
                  <Button
                    text="Tilbake"
                    className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                  />
                </div>
                <Button
                  text="Neste"
                  className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                  type="submit"
                />
              </div>
            </div>
          </form>
        </Form>
      </>
    );
  }
);
