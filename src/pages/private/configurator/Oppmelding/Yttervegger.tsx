import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../../components/ui/form";
import Button from "../../../../components/common/button";
import { Input } from "../../../../components/ui/input";
import { z } from "zod";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { Spinner } from "../../../../components/Spinner";

const formSchema = z.object({
  kledningstype: z.string().optional(),
  kledningstypeText: z.string().optional(),
  Overflater: z
    .object({
      type: z.string(),
      colorCode: z.string().optional(),
    })
    .optional(),
  OverflaterDeliveryDetail: z.string().optional(),
  Garasje: z.string().optional(),
});

export function removeUndefinedOrNull(obj: any): any {
  if (Array.isArray(obj)) {
    return obj
      .map(removeUndefinedOrNull)
      .filter((item) => item !== undefined && item !== null);
  } else if (typeof obj === "object" && obj !== null) {
    const cleanedObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = removeUndefinedOrNull(value);
      if (
        cleanedValue !== undefined &&
        cleanedValue !== null &&
        !(
          typeof cleanedValue === "object" &&
          Object.keys(cleanedValue).length === 0
        )
      ) {
        cleanedObj[key] = cleanedValue;
      }
    }
    return cleanedObj;
  } else {
    return obj;
  }
}

export const Yttervegger = forwardRef(
  (
    {
      handleNext,
      handlePrevious,
      roomsData,
      setRoomsData,
      setValidInitialSteps,
    }: {
      handleNext: () => void;
      handlePrevious: () => void;
      roomsData: any;
      setRoomsData: any;
      setValidInitialSteps: any;
    },
    ref
  ) => {
    const location = useLocation();
    const pathSegments = location.pathname.split("/");
    const kundeId = pathSegments.length > 3 ? pathSegments[3] : null;

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
    });
    useImperativeHandle(ref, () => ({
      validateForm: async () => {
        const valid = await form.trigger();
        return valid;
      },
      handleSubmit: async () => {
        await form.handleSubmit(onSubmit)();
      },
    }));

    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
      setIsSubmitLoading(true);

      try {
        const husmodellDocRef = doc(db, "projects", String(kundeId));

        const formatDate = (date: Date) => {
          return date
            .toLocaleString("sv-SE", { timeZone: "UTC" })
            .replace(",", "");
        };
        const husmodellSnap = await getDoc(husmodellDocRef);

        if (!husmodellSnap.exists()) {
          throw new Error("Document does not exist!");
        }
        let existingData = husmodellSnap.exists() ? husmodellSnap.data() : {};

        const filteredData = removeUndefinedOrNull({
          ...data,
          updatedAt: formatDate(new Date()),
        });
        let updatedKundeInfo = {
          Yttervegger: filteredData,
          updatedAt: formatDate(new Date()),
        };

        const updatePayload: any = {
          ...existingData,
          ...updatedKundeInfo,
        };

        await setDoc(husmodellDocRef, updatePayload);

        setRoomsData((prev: any) => ({
          ...prev,
          Yttervegger: filteredData,
          updatedAt: formatDate(new Date()),
        }));

        toast.success("Lagret", {
          position: "top-right",
        });
        handleNext();
        localStorage.setItem("currVerticalIndex", String(5));
        setValidInitialSteps((prev: number[]) => {
          if (!prev.includes(4)) {
            return [...prev, 4];
          }
          return prev;
        });
      } catch (error) {
        console.error("error:", error);
        toast.error("Something went wrong!", {
          position: "top-right",
        });
      } finally {
        setIsSubmitLoading(false);
      }
    };

    const kledningstype = [
      "Standard leveranse i henhold til signatur",
      "Annen variant",
    ];
    const OverflaterOptions = [
      "Standard kledning (maskingrunnet hvit)",
      "Grunnet + mellomstrøk maskinbeiset fra fabrikk",
      "Ultimalt (sopp/råte + grunning)",
      "Ultimalt PROFF 10",
    ];

    useEffect(() => {
      if (roomsData && roomsData?.Yttervegger) {
        Object.entries(roomsData?.Yttervegger).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            form.setValue(key as any, value);
          }
        });
      }
    }, [roomsData]);
    return (
      <>
        {isSubmitLoading && <Spinner />}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <div className="border border-[#B9C0D4] rounded-lg">
              <div className="text-darkBlack font-semibold text-base md:text-lg p-3 md:p-5 border-b border-[#B9C0D4]">
                Yttervegger
              </div>
              <div className="p-3 md:p-5">
                <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5 md:items-center">
                  <p className="text-black text-sm italic col-span-3">
                    Oppbygging på yttervegg leveres med standard 198+48mm
                  </p>
                  <div className="border-t border-[#B9C0D4] col-span-3 my-1"></div>
                  <h4 className="uppercase text-darkBlack font-semibold col-span-3 text-sm md:text-base">
                    KLEDNINGSTYPE
                  </h4>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name={`kledningstype`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                              {kledningstype.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    form.setValue("kledningstype", option);
                                  }}
                                >
                                  <input
                                    className={`bg-white rounded-[8px] border text-black
        ${
          fieldState?.error ? "border-red" : "border-gray1"
        } h-4 w-4 accent-primary`}
                                    type="radio"
                                    value={option}
                                    onChange={(e) => {
                                      form.setValue(
                                        `kledningstype`,
                                        e.target.value
                                      );
                                    }}
                                    checked={field.value === option}
                                  />
                                  <p className={`text-black text-sm`}>
                                    {option}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="kledningstypeText"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv type:"
                                {...field}
                                className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                                type="text"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="border-t border-[#B9C0D4] col-span-3 my-1"></div>
                  <h4 className="uppercase text-darkBlack font-semibold col-span-3 text-sm md:text-base">
                    OVERFLATER
                  </h4>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="Overflater"
                      render={() => {
                        const selected = form.watch("Overflater");

                        return (
                          <FormItem>
                            <p className="mb-2 font-medium text-darkBlack text-sm">
                              Velg ett alternativ:
                            </p>
                            <div className="flex flex-col gap-4">
                              {OverflaterOptions.map((option) => {
                                const isSelected = selected?.type === option;

                                return (
                                  <div
                                    key={option}
                                    className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5"
                                  >
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="overflater"
                                        value={option}
                                        checked={isSelected}
                                        onChange={() =>
                                          form.setValue("Overflater", {
                                            type: option,
                                            colorCode: "",
                                          })
                                        }
                                        className="h-4 w-4 accent-primary"
                                      />
                                      <span className="text-black text-sm">
                                        {option}
                                      </span>
                                    </label>
                                    {option !==
                                      "Standard kledning (maskingrunnet hvit)" && (
                                      <div className="col-span-2">
                                        <Input
                                          placeholder="Skriv fargekode"
                                          value={
                                            isSelected
                                              ? selected?.colorCode || ""
                                              : ""
                                          }
                                          onChange={(e: any) => {
                                            if (isSelected) {
                                              form.setValue("Overflater", {
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
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="OverflaterDeliveryDetail"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Beskriv eventuelle leveransedetaljer til overflater:
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn Kommentar"
                                {...field}
                                className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                                type="text"
                              />
                            </div>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="border-t border-[#B9C0D4] col-span-3 my-1"></div>
                  <h4 className="uppercase text-darkBlack font-semibold col-span-3 text-sm md:text-base">
                    GARASJE
                  </h4>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="Garasje"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Beskriv eventuelle leveransedetaljer på
                            kledningstype og farge som avviker fra
                            husleveransen:
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn Kommentar"
                                {...field}
                                className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                                type="text"
                              />
                            </div>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end w-full gap-5 items-center sticky bottom-0 bg-white z-50 border-t border-[#B9C0D4] rounded-b-lg p-4">
                <div
                  onClick={() => {
                    form.reset();
                    handlePrevious();
                    localStorage.setItem("currVerticalIndex", String(3));
                  }}
                >
                  <Button
                    text="Tilbake"
                    className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                  />
                </div>
                <Button
                  text="Neste"
                  className="border border-primary bg-primary text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
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
