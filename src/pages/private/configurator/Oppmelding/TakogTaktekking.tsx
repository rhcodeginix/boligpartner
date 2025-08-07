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
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { removeUndefinedOrNull } from "./Yttervegger";
import { Spinner } from "../../../../components/Spinner";

const formSchema = z.object({
  Undertak: z.string().optional(),
  KommentarUndertak: z.string().optional(),
  Taktekking: z
    .object({
      type: z.string(),
      colorCode: z.string().optional(),
    })
    .optional(),
  TaksteinType: z.string().optional(),
  TaksteinKode: z.string().optional(),
  TaksteinFarge: z.string().optional(),
  TaksteinStruktur: z.string().optional(),
  HeisesPåTak: z.boolean().optional(),
  Snøfangere: z.string().optional(),
  SnøfangereFarge: z.string().optional(),
  SnøfangerkrokerIGrad: z.string().optional(),
  GradrennerBeslagFarge: z.string().optional(),
  Feieplatå: z.string().optional(),
  Avløpslufter: z.string({ required_error: "Avløpslufter er påkrevd." }),
});

export const TakogTaktekking = forwardRef(
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
          TakogTaktekking: filteredData,
          updatedAt: formatDate(new Date()),
        };

        const updatePayload: any = {
          ...existingData,
          ...updatedKundeInfo,
        };

        await setDoc(husmodellDocRef, updatePayload);

        setRoomsData((prev: any) => ({
          ...prev,
          TakogTaktekking: filteredData,
          updatedAt: formatDate(new Date()),
        }));
        toast.success("Lagret", {
          position: "top-right",
        });
        handleNext();
        localStorage.setItem("currVerticalIndex", String(6));
        setValidInitialSteps((prev: number[]) => {
          if (!prev.includes(5)) {
            return [...prev, 5];
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
    const Undertak = [
      "Standard undertak",
      "Undertak med D-papp (eventuelt beskrevet i arbeidstegning om dette er nødvendig)",
      "Papp og tekke arbeid leveres lokalt",
    ];

    const TaktekkingOptions = [
      "Standard i henhold til seriens leveransebeskrivelse",
      "Takpapp",
      "Shingel",
      "Stålplatetak",
      "Protan",
      "Takstein",
    ];

    const TaksteinStruktur = ["Struktur", "Glatt 5.2"];
    const SnøfangerkrokerIGrad = ["Ja", "Nei"];

    const Takstein = form.watch("Taktekking");

    useEffect(() => {
      if (roomsData && roomsData?.TakogTaktekking) {
        Object.entries(roomsData?.TakogTaktekking).forEach(([key, value]) => {
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
                Tak og taktekking
              </div>
              <div className="p-3 md:p-5">
                <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5 md:items-center">
                  <h4 className="uppercase text-darkBlack font-semibold col-span-3 text-sm md:text-base">
                    UNDERTAK
                  </h4>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name={`Undertak`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`mb-4 font-medium ${
                              fieldState.error ? "text-red" : "text-darkBlack"
                            } text-sm`}
                          >
                            Velg ett alternativ:
                          </p>
                          <FormControl>
                            <div className="flex flex-col gap-4">
                              {Undertak.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    form.setValue("Undertak", option);
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
                                      form.setValue(`Undertak`, e.target.value);
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
                      name="KommentarUndertak"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Kommentar til undertak:
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
                    TAKTEKKING
                  </h4>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="Taktekking"
                      render={() => {
                        const selected = form.watch("Taktekking");

                        return (
                          <FormItem>
                            <p className="mb-2 font-medium text-darkBlack text-sm">
                              Velg ett alternativ:
                            </p>
                            <div className="flex flex-col gap-4">
                              {TaktekkingOptions.map((option) => {
                                const isSelected = selected?.type === option;

                                return (
                                  <div
                                    key={option}
                                    className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5"
                                  >
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="Taktekking"
                                        value={option}
                                        checked={isSelected}
                                        onChange={() => {
                                          form.setValue("Taktekking", {
                                            type: option,
                                            colorCode: "",
                                          });
                                          if (option === "Takstein") {
                                            form.resetField("TaksteinFarge");
                                            form.resetField("TaksteinKode");
                                            form.resetField("TaksteinType");
                                            form.resetField("TaksteinStruktur");
                                            form.resetField("HeisesPåTak");
                                          }
                                        }}
                                        className="h-4 w-4 accent-[#444CE7]"
                                      />
                                      <span className="text-black text-sm">
                                        {option}
                                      </span>
                                    </label>
                                    {option !==
                                      "Standard i henhold til seriens leveransebeskrivelse" &&
                                      option !== "Takstein" && (
                                        <div className="col-span-2">
                                          <Input
                                            placeholder={`${
                                              option === "Protan"
                                                ? "Kommentar"
                                                : "Beskriv type og farge"
                                            }`}
                                            value={
                                              isSelected
                                                ? selected?.colorCode || ""
                                                : ""
                                            }
                                            onChange={(e: any) => {
                                              if (isSelected) {
                                                form.setValue("Taktekking", {
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
                  {Takstein && Takstein.type === "Takstein" && (
                    <>
                      <div>
                        <FormField
                          control={form.control}
                          name="TaksteinType"
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <p
                                className={`${
                                  fieldState.error ? "text-red" : "text-black"
                                } mb-[6px] text-sm`}
                              >
                                Takstein type
                              </p>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    placeholder="Skriv type takstein"
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
                      <div>
                        <FormField
                          control={form.control}
                          name="TaksteinKode"
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <p
                                className={`${
                                  fieldState.error ? "text-red" : "text-black"
                                } mb-[6px] text-sm`}
                              >
                                Takstein kode
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
                      <div>
                        <FormField
                          control={form.control}
                          name="TaksteinFarge"
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <p
                                className={`${
                                  fieldState.error ? "text-red" : "text-black"
                                } mb-[6px] text-sm`}
                              >
                                Takstein farge
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
                      <div>
                        <FormField
                          control={form.control}
                          name={`TaksteinStruktur`}
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <p
                                className={`mb-2 ${
                                  fieldState.error ? "text-red" : "text-black"
                                } text-sm`}
                              >
                                Takstein struktur
                              </p>
                              <FormControl>
                                <div className="flex items-center flex-wrap gap-3 lg:gap-5">
                                  {TaksteinStruktur.map((option) => (
                                    <div
                                      key={option}
                                      className="relative flex items-center gap-2 cursor-pointer"
                                      onClick={() => {
                                        form.setValue(
                                          "TaksteinStruktur",
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
                                        checked={field.value === option}
                                        onChange={(e) => {
                                          form.setValue(
                                            `TaksteinStruktur`,
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
                      <div>
                        <FormField
                          control={form.control}
                          name="HeisesPåTak"
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
                                  id="HeisesPåTak"
                                  checked={field.value || false}
                                  onChange={(e) =>
                                    field.onChange(e.target.checked)
                                  }
                                />
                                Heises på tak
                              </p>
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}
                  <div className="border-t border-[#B9C0D4] col-span-3 my-1"></div>
                  <h4 className="uppercase text-darkBlack font-semibold col-span-3 text-sm md:text-base">
                    TAK ANNET
                  </h4>
                  <div>
                    <FormField
                      control={form.control}
                      name="Snøfangere"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Snøfangere
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Kommentar"
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
                  <div>
                    <FormField
                      control={form.control}
                      name="SnøfangereFarge"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Snøfangere farge
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv fargekode"
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
                  <div>
                    <FormField
                      control={form.control}
                      name="SnøfangerkrokerIGrad"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Snøfangerkroker i grad
                          </p>
                          <FormControl>
                            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                              {SnøfangerkrokerIGrad.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    form.setValue(
                                      "SnøfangerkrokerIGrad",
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
                                        `SnøfangerkrokerIGrad`,
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
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="GradrennerBeslagFarge"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Gradrenner/beslag farge
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
                  <div>
                    <FormField
                      control={form.control}
                      name="Feieplatå"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Feieplatå
                          </p>
                          <FormControl>
                            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                              {SnøfangerkrokerIGrad.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    form.setValue("Feieplatå", option);
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
                                        `Feieplatå`,
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
                  <p className="col-span-3 text-darkBlack italic text-sm">
                    Ved innvendige nedløp må dette leveres av lokal rørlegger
                  </p>
                  <div>
                    <FormField
                      control={form.control}
                      name="Avløpslufter"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`font-medium ${
                              fieldState.error ? "text-red" : "text-darkBlack"
                            } mb-[6px] text-sm`}
                          >
                            Avløpslufter:*
                          </p>
                          <FormControl>
                            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                              {SnøfangerkrokerIGrad.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    form.setValue("Avløpslufter", option);
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
                                        `Avløpslufter`,
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
                </div>
              </div>
              <div className="flex justify-end w-full gap-5 items-center sticky bottom-0 bg-white z-50 border-t border-[#B9C0D4] rounded-b-lg p-4">
                <div
                  onClick={() => {
                    form.reset();
                    handlePrevious();
                    localStorage.setItem("currVerticalIndex", String(4));
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
