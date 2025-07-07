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
import { z } from "zod";
import { Input } from "../../../../components/ui/input";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { removeUndefinedOrNull } from "./Yttervegger";
import DatePickerComponent from "../../../../components/ui/datepicker";
import { Spinner } from "../../../../components/Spinner";

const formSchema = z.object({
  Vinduer: z
    .object({
      type: z.string(),
      colorCode: z.string().optional(),
    })
    .optional(),
  AlubeslåttUtvendig: z.boolean().optional(),
  AlubeslåttUtvendigText: z.string().optional(),
  ØnskerSoldempingGlass: z.boolean().optional(),
  ØnskerSoldempingGlassText: z.string().optional(),
  ØnskerScreens: z.boolean().optional(),
  ØnskerScreensText: z.string().optional(),
  UtforingFarge: z.string().optional(),
  VinduerNedTilGulv: z.boolean().optional(),
  HeltreUutforingPpristillegg: z.boolean().optional(),
  ForingerSeparatOrdre: z.string().optional(),
  KommentarVindu: z.string().optional(),
  TakvinduVelux: z
    .object({
      type: z.string(),
      colorCode: z.string().optional(),
    })
    .optional(),
  TakvinduVeluxUtforingFarge: z.string().optional(),
  TakvinduVeluxKommentar: z.string().optional(),
});

export const Vinduer = forwardRef(
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
          Vinduer: filteredData,
          id: id,
          updatedAt: formatDate(new Date()),
        };
        setRoomsData(mergedData);

        await updateDoc(husmodellDocRef, mergedData);
        toast.success("Lagret", {
          position: "top-right",
        });
        handleNext();
        localStorage.setItem("currVerticalIndex", String(9));
      } catch (error) {
        console.error("error:", error);
        toast.error("Something went wrong!", {
          position: "top-right",
        });
      } finally {
        setIsSubmitLoading(false);
      }
    };
    const VinduerOptions = [
      "Standard hvitmalt utv. og innv. ihht. leveransebeskrivelse",
      "Annen farge:",
    ];
    const TakvinduVeluxOptions = [
      "Ikke relevant",
      "Standard farge ihht. leveransebeskrivelse",
      "Annen farge:",
    ];
    const UtforingFarge = ["Hvit", "Som vindusfarge"];

    useEffect(() => {
      if (roomsData && roomsData?.Vinduer) {
        Object.entries(roomsData?.Vinduer).forEach(([key, value]) => {
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
              <div className="text-darkBlack font-semibold text-lg p-5 border-b border-[#B9C0D4] uppercase">
                Vinduer
              </div>
              <div className="p-4 md:p-5">
                <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5 items-center">
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="Vinduer"
                      render={() => {
                        const selected = form.watch("Vinduer");

                        return (
                          <FormItem>
                            <p className="mb-2 font-medium text-darkBlack text-sm">
                              Velg ett alternativ:
                            </p>
                            <div className="flex flex-col gap-4">
                              {VinduerOptions.map((option) => {
                                const isSelected = selected?.type === option;

                                return (
                                  <div
                                    key={option}
                                    className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5"
                                  >
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="Vinduer"
                                        value={option}
                                        checked={isSelected}
                                        onChange={() =>
                                          form.setValue("Vinduer", {
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
                                    {option !==
                                      "Standard hvitmalt utv. og innv. ihht. leveransebeskrivelse" &&
                                      option !== "Annen dørmodell" && (
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
                                                form.setValue("Vinduer", {
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
                    <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5">
                      <FormField
                        control={form.control}
                        name="AlubeslåttUtvendig"
                        render={({ field }) => (
                          <FormItem>
                            <p
                              className={`text-sm flex gap-2 items-baseline cursor-pointer ${
                                field.value ? "text-black" : "text-black"
                              }`}
                              onClick={() => field.onChange(!field.value)}
                            >
                              <input
                                type="checkbox"
                                id="AlubeslåttUtvendig"
                                checked={field.value || false}
                                onChange={(e) =>
                                  field.onChange(e.target.checked)
                                }
                              />
                              Alubeslått utvendig
                            </p>
                          </FormItem>
                        )}
                      />
                      {form.watch("AlubeslåttUtvendig") === true && (
                        <div className="col-span-2">
                          <Input
                            placeholder="Skriv fargekode"
                            value={form.watch("AlubeslåttUtvendigText") || ""}
                            onChange={(e: any) => {
                              form.setValue(
                                "AlubeslåttUtvendigText",
                                e.target.value
                              );
                            }}
                            className={`bg-white rounded-[8px] border text-black border-gray1`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-[#B9C0D4] col-span-3 my-1"></div>
                  <div className="col-span-3 text-darkBlack font-medium text-base">
                    Valg om soldemping
                  </div>
                  <div className="col-span-3">
                    <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5">
                      <FormField
                        control={form.control}
                        name="ØnskerSoldempingGlass"
                        render={({ field }) => (
                          <FormItem>
                            <p
                              className={`text-sm flex gap-2 items-baseline cursor-pointer ${
                                field.value ? "text-black" : "text-black"
                              }`}
                              onClick={() => field.onChange(!field.value)}
                            >
                              <input
                                type="checkbox"
                                id="ØnskerSoldempingGlass"
                                checked={field.value || false}
                                onChange={(e) =>
                                  field.onChange(e.target.checked)
                                }
                              />
                              Ønsker soldemping i glass
                            </p>
                          </FormItem>
                        )}
                      />
                      {form.watch("ØnskerSoldempingGlass") === true && (
                        <div className="col-span-2">
                          <Input
                            placeholder="Beskriv hvilke rom og type"
                            value={
                              form.watch("ØnskerSoldempingGlassText") || ""
                            }
                            onChange={(e: any) => {
                              form.setValue(
                                "ØnskerSoldempingGlassText",
                                e.target.value
                              );
                            }}
                            className={`bg-white rounded-[8px] border text-black border-gray1`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-[#B9C0D4] col-span-3 my-1"></div>
                  <div className="col-span-3 text-darkBlack font-medium text-base">
                    Valg om screen
                  </div>
                  <div className="col-span-3">
                    <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5">
                      <FormField
                        control={form.control}
                        name="ØnskerScreens"
                        render={({ field }) => (
                          <FormItem>
                            <p
                              className={`text-sm flex gap-2 items-baseline cursor-pointer ${
                                field.value ? "text-black" : "text-black"
                              }`}
                              onClick={() => field.onChange(!field.value)}
                            >
                              <input
                                type="checkbox"
                                id="ØnskerScreens"
                                checked={field.value || false}
                                onChange={(e) =>
                                  field.onChange(e.target.checked)
                                }
                              />
                              Ønsker screens
                            </p>
                          </FormItem>
                        )}
                      />
                      {form.watch("ØnskerScreens") === true && (
                        <div className="col-span-2">
                          <Input
                            placeholder="Beskriv hvilke rom og type"
                            value={form.watch("ØnskerScreensText") || ""}
                            onChange={(e: any) => {
                              form.setValue(
                                "ØnskerScreensText",
                                e.target.value
                              );
                            }}
                            className={`bg-white rounded-[8px] border text-black border-gray1`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name={`UtforingFarge`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Utforing farge
                          </p>
                          <FormControl>
                            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                              {UtforingFarge.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    form.setValue("UtforingFarge", option);
                                  }}
                                >
                                  <input
                                    className={`bg-white rounded-[8px] border text-black
        ${
          fieldState?.error ? "border-red" : "border-gray1"
        } h-4 w-4 accent-[#444CE7]`}
                                    type="radio"
                                    value={option}
                                    onChange={(e) => {
                                      form.setValue(
                                        `UtforingFarge`,
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
                  <div>
                    <FormField
                      control={form.control}
                      name="VinduerNedTilGulv"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline cursor-pointer ${
                              field.value ? "text-black" : "text-black"
                            }`}
                            onClick={() => field.onChange(!field.value)}
                          >
                            <input
                              type="checkbox"
                              id="VinduerNedTilGulv"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Vinduer ned til gulv
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="HeltreUutforingPpristillegg"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline cursor-pointer ${
                              field.value ? "text-black" : "text-black"
                            }`}
                            onClick={() => field.onChange(!field.value)}
                          >
                            <input
                              type="checkbox"
                              id="HeltreUutforingPpristillegg"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Heltre utforing (pristillegg)
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="ForingerSeparatOrdre"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Foringer separat ordre
                          </p>
                          <FormControl>
                            <div className="relative">
                              <DatePickerComponent
                                selectedDate={
                                  field.value ? new Date(field.value) : null
                                }
                                onDateChange={(date) => {
                                  const formattedDate = date
                                    ? date.toISOString().split("T")[0]
                                    : "";

                                  field.onChange(formattedDate);
                                }}
                                placeholderText="Velg dato"
                                className={`bg-white rounded-[8px] border w-full overflow-hidden ${
                                  fieldState?.error
                                    ? "border-red"
                                    : "border-gray1"
                                }`}
                              />
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
                      name="KommentarVindu"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Kommentar til vindu
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Beskriv her"
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
                  <div className="col-span-3 text-darkBlack font-medium text-base">
                    Takvindu Velux
                  </div>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="TakvinduVelux"
                      render={() => {
                        const selected = form.watch("TakvinduVelux");

                        return (
                          <FormItem>
                            <p className="mb-2 font-medium text-darkBlack text-sm">
                              Velg ett alternativ:
                            </p>
                            <div className="flex flex-col gap-4">
                              {TakvinduVeluxOptions.map((option) => {
                                const isSelected = selected?.type === option;

                                return (
                                  <div
                                    key={option}
                                    className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5"
                                  >
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="TakvinduVelux"
                                        value={option}
                                        checked={isSelected}
                                        onChange={() =>
                                          form.setValue("TakvinduVelux", {
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
                                    {option !==
                                      "Standard farge ihht. leveransebeskrivelse" &&
                                      option !== "Ikke relevant" && (
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
                                                form.setValue("TakvinduVelux", {
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
                  <div>
                    <FormField
                      control={form.control}
                      name={`TakvinduVeluxUtforingFarge`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Utforing farge
                          </p>
                          <FormControl>
                            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                              {UtforingFarge.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    form.setValue(
                                      "TakvinduVeluxUtforingFarge",
                                      option
                                    );
                                  }}
                                >
                                  <input
                                    className={`bg-white rounded-[8px] border text-black
        ${
          fieldState?.error ? "border-red" : "border-gray1"
        } h-4 w-4 accent-[#444CE7]`}
                                    type="radio"
                                    value={option}
                                    onChange={(e) => {
                                      form.setValue(
                                        `TakvinduVeluxUtforingFarge`,
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
                      name="TakvinduVeluxKommentar"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Kommentar til takvindu og eventuelt tilvalg
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Beskriv her"
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
                    localStorage.setItem("currVerticalIndex", String(7));
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
