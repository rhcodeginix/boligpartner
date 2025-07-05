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
import { Spinner } from "../../../../components/Spinner";

const formSchema = z.object({
  Ventilasjon: z.boolean().optional(),
  FargeønskeUtvendigKombirist: z.string().optional(),
  FargeønskeInnvendigVentiler: z.string().optional(),
  KommentarVentilasjon: z.string().optional(),
  Sentralstøvsuger: z.string().optional(),

  AntallKontakter: z.string().optional(),
  Sugebrett: z.string().optional(),
  Kommentar: z.string().optional(),
});

export const VentilasjonSentralstøvsuger = forwardRef(
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
          VentilasjonSentralstøvsuger: filteredData,
          id: id,
          updatedAt: formatDate(new Date()),
        };
        setRoomsData(mergedData);

        await updateDoc(husmodellDocRef, mergedData);
        toast.success("Lagret", {
          position: "top-right",
        });
        handleNext();
        localStorage.setItem("currVerticalIndex", String(12));
      } catch (error) {
        console.error("error:", error);
        toast.error("Something went wrong!", {
          position: "top-right",
        });
      } finally {
        setIsSubmitLoading(false);
      }
    };
    const FargeønskeUtvendigKombirist = ["Hvit", "Svart"];
    const Sugebrett = ["Ja", "Nei"];
    const AntallKontakter = ["2", "3", "4", "Alt"];
    const Sentralstøvsuger = ["Ikke relevant", "Sentralstøvsuger"];

    useEffect(() => {
      if (roomsData && roomsData?.VentilasjonSentralstøvsuger) {
        Object.entries(roomsData?.VentilasjonSentralstøvsuger).forEach(
          ([key, value]) => {
            if (value !== undefined && value !== null) {
              form.setValue(key as any, value);
            }
          }
        );
      }
    }, [roomsData]);
    return (
      <>
        {" "}
        {isSubmitLoading && <Spinner />}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <div className="border border-[#B9C0D4] rounded-lg">
              <div className="text-darkBlack font-semibold text-lg p-5 border-b border-[#B9C0D4] uppercase">
                Ventilasjon og Sentralstøvsuger
              </div>
              <div className="p-4 md:p-5">
                <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5 items-center">
                  <div className="col-span-3">
                    <p className={`$text-black font-medium mb-4`}>
                      Ventilasjon
                    </p>
                    <FormField
                      control={form.control}
                      name="Ventilasjon"
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
                              id="Ventilasjon"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Ikke relevant
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name={`FargeønskeUtvendigKombirist`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p className={`mb-4 text-black font-medium`}>
                            Fargeønske utvendig kombirist
                          </p>
                          <FormControl>
                            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                              {FargeønskeUtvendigKombirist.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    form.setValue(
                                      "FargeønskeUtvendigKombirist",
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
                                        `FargeønskeUtvendigKombirist`,
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
                      name={`FargeønskeInnvendigVentiler`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p className={`mb-4 text-black font-medium`}>
                            Fargeønske innvendig ventiler
                          </p>
                          <FormControl>
                            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                              {FargeønskeUtvendigKombirist.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    form.setValue(
                                      "FargeønskeInnvendigVentiler",
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
                                        `FargeønskeInnvendigVentiler`,
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
                      name="KommentarVentilasjon"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Kommentar til ventilasjon
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv her"
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
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name={`Sentralstøvsuger`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p className={`$text-black font-medium mb-4`}>
                            Sentralstøvsuger
                          </p>
                          <FormControl>
                            <div className="flex flex-col gap-3 lg:gap-4">
                              {Sentralstøvsuger.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    form.setValue("Sentralstøvsuger", option);
                                  }}
                                >
                                  <input
                                    className={`bg-white rounded-[8px] border text-black
        ${
          fieldState?.error ? "border-red" : "border-gray1"
        } h-4 w-4 accent-[#444CE7]`}
                                    type="radio"
                                    value={option}
                                    checked={field.value === option}
                                    onChange={(e) => {
                                      form.setValue(
                                        "Sentralstøvsuger",
                                        e.target.value
                                      );
                                    }}
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
                  {form.watch("Sentralstøvsuger") !== "Ikke relevant" && (
                    <>
                      <div>
                        <FormField
                          control={form.control}
                          name={`AntallKontakter`}
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <p
                                className={`mb-2 ${
                                  fieldState.error ? "text-red" : "text-black"
                                } text-sm`}
                              >
                                Antall sugekontakter
                              </p>
                              <FormControl>
                                <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                                  {AntallKontakter.map((option) => (
                                    <div
                                      key={option}
                                      className="relative flex items-center gap-2 cursor-pointer"
                                      onClick={() => {
                                        form.setValue(
                                          "AntallKontakter",
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
                                            `AntallKontakter`,
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
                          name="Sugebrett"
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <p
                                className={`${
                                  fieldState.error ? "text-red" : "text-black"
                                } mb-[6px] text-sm`}
                              >
                                Sugebrett
                              </p>
                              <FormControl>
                                <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                                  {Sugebrett.map((option) => (
                                    <div
                                      key={option}
                                      className="relative flex items-center gap-2 cursor-pointer"
                                      onClick={() => {
                                        form.setValue("Sugebrett", option);
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
                                            `Sugebrett`,
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
                    </>
                  )}
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="Kommentar"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Kommentar til sentralstøvsuger
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv her"
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
                    localStorage.setItem("currVerticalIndex", String(10));
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
