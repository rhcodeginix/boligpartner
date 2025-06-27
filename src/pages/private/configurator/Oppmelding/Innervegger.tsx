import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem } from "../../../../components/ui/form";
import Button from "../../../../components/common/button";
import { z } from "zod";
import { forwardRef, useEffect, useImperativeHandle } from "react";
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
  romskjema: z
    .array(
      z.object({
        romNavn: z.string().optional(),
        himling: z.string().optional(),
        vegger: z.string().optional(),
        lister: z.string().optional(),
        beskrivelse: z.string().optional(),
      })
    )
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

    const defaultRows = Array.from({ length: 4 }).map(() => ({
      romNavn: "",
      himling: "",
      vegger: "",
      lister: "",
      beskrivelse: "",
    }));

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        Innervegger: {
          type: "",
          colorCode: "",
        },
        romskjema: defaultRows,
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

    const { fields } = useFieldArray({
      control: form.control,
      name: "romskjema",
    });

    useEffect(() => {
      if (roomsData && roomsData?.Innervegger) {
        Object.entries(roomsData?.Innervegger).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            form.setValue(key as any, value);
          }
        });
      }
    }, [roomsData]);
    return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <div className="border border-[#B9C0D4] rounded-lg">
              <div className="text-darkBlack font-semibold text-lg p-5 border-b border-[#B9C0D4] uppercase">
                Innervegger
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
                  <h4 className="text-darkBlack font-bold col-span-3">
                    Innvendige overflater - romskjema
                  </h4>
                  <div className="border-t border-[#B9C0D4] col-span-3 my-1"></div>
                  <h4 className="uppercase text-darkBlack font-semibold col-span-3">
                    ROMSKJEMA:
                  </h4>
                  <div className="col-span-3">
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
