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

const formSchema = z.object({
  Innervegger: z
    .object({
      type: z.string(),
      colorCode: z.string().optional(),
    })
    .optional(),
  // romskjema: z
  //   .array(
  //     z.object({
  //       romNavn: z.string().optional(),
  //       himling: z.string().optional(),
  //       vegger: z.string().optional(),
  //       lister: z.string().optional(),
  //       beskrivelse: z.string().optional(),
  //     })
  //   )
  //   .optional(),
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

    // const defaultRows = Array.from({ length: 4 }).map(() => ({
    //   romNavn: "",
    //   himling: "",
    //   vegger: "",
    //   lister: "",
    //   beskrivelse: "",
    // }));

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        Innervegger: {
          type: "",
          colorCode: "",
        },
        // romskjema: defaultRows,
      },
    });
    useImperativeHandle(ref, () => ({
      validateForm: async () => {
        const valid = await form.trigger();
        return valid;
      },
    }));

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
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
      }
    };
    const InnerveggerOptions = [
      "Standard 70 mm isolasjon",
      "100 mm mineralull 36",
    ];

    // const { fields } = useFieldArray({
    //   control: form.control,
    //   name: "romskjema",
    // });

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <div className="border border-[#B9C0D4] rounded-lg">
              <div className="text-darkBlack font-semibold text-lg p-5 border-b border-[#B9C0D4] uppercase">
                {/* Innervegger */}
                Oppbygging innervegg
              </div>
              <div className="p-4 md:p-5">
                <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5">
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
                  <h4 className="uppercase text-darkBlack font-semibold col-span-3">
                    ROMSKJEMA:
                  </h4>
                  {/* <div className="col-span-3">
                    <div className="grid grid-cols-5 gap-2 font-semibold text-sm mb-2">
                      <div>Rom Navn</div>
                      <div>Himling</div>
                      <div>Vegger</div>
                      <div>Lister</div>
                      <div>Beskrivelse</div>
                    </div>

                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="grid grid-cols-5 gap-2 mb-2"
                      >
                        <Input
                          value={form.watch(`romskjema.${index}.romNavn`) || ""}
                          onChange={(e: any) => {
                            form.setValue(
                              `romskjema.${index}.romNavn`,
                              e.target.value
                            );
                          }}
                          className="bg-white rounded-[8px] border text-black border-gray1"
                        />
                        <Input
                          value={form.watch(`romskjema.${index}.himling`) || ""}
                          onChange={(e: any) => {
                            form.setValue(
                              `romskjema.${index}.himling`,
                              e.target.value
                            );
                          }}
                          className="bg-white rounded-[8px] border text-black border-gray1"
                        />
                        <Input
                          value={form.watch(`romskjema.${index}.vegger`) || ""}
                          onChange={(e: any) => {
                            form.setValue(
                              `romskjema.${index}.vegger`,
                              e.target.value
                            );
                          }}
                          className="bg-white rounded-[8px] border text-black border-gray1"
                        />
                        <Input
                          value={form.watch(`romskjema.${index}.lister`) || ""}
                          onChange={(e: any) => {
                            form.setValue(
                              `romskjema.${index}.lister`,
                              e.target.value
                            );
                          }}
                          className="bg-white rounded-[8px] border text-black border-gray1"
                        />
                        <Input
                          value={
                            form.watch(`romskjema.${index}.beskrivelse`) || ""
                          }
                          onChange={(e: any) => {
                            form.setValue(
                              `romskjema.${index}.beskrivelse`,
                              e.target.value
                            );
                          }}
                          className="bg-white rounded-[8px] border text-black border-gray1"
                        />
                      </div>
                    ))}
                  </div> */}
                  <div className="col-span-3">
                    <div className="bg-gray3 border border-[#EFF1F5] rounded-lg p-2 flex items-center gap-2 mb-3.5">
                      {roomsData?.Plantegninger &&
                        roomsData?.Plantegninger.map(
                          (room: any, index: number) => {
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
                          }
                        )}
                    </div>
                    <div className="border border-[#DCDFEA] rounded-lg">
                      <h4 className="text-darkBlack font-semibold text-xl p-5 border-b border-[#DCDFEA]">
                        Her følger oppsummering av {activeTab}
                      </h4>
                      <div className="p-5">
                        {room && (
                          <div className="flex flex-col gap-4">
                            {room.rooms && room.rooms.length > 0
                              ? room.rooms.map(
                                  (innerRoom: any, index: number) => {
                                    return (
                                      <div
                                        key={index}
                                        className="flex flex-col gap-4 bg-gray3 p-4 rounded-lg"
                                      >
                                        <div className="text-black font-semibold text-lg">
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
                                                            {prod?.Produktnavn}
                                                          </h3>
                                                        </div>
                                                        {/* <div className="flex flex-col gap-2 mt-3">
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
                                                                {
                                                                  prod?.delieverBy
                                                                }
                                                              </span>
                                                            </div>
                                                          )}
                                                        </div> */}
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
