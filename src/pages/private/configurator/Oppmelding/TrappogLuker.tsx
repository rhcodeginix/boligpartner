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
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { removeUndefinedOrNull } from "./Yttervegger";
import { Spinner } from "../../../../components/Spinner";

const formSchema = z.object({
  Trapp: z
    .object({
      type: z.string(),
      colorCode: z.string().optional(),
    })
    .optional(),
  TypeTrinn: z.string().optional(),
  Opptrinn: z.string().optional(),
  Sidevanger: z.string().optional(),
  Rekkverk: z.string().optional(),
  Håndlist: z.string().optional(),
  Spiler: z.string().optional(),
  BodløsningTrapperom: z.string().optional(),
  Montering: z.string().optional(),
  Måltaking: z.string().optional(),
  KommentarTrapp: z.string().optional(),
  IsolerteInspeksjonsluker: z.string().optional(),
  Himling: z.boolean().optional(),
  HimlingText: z.number().optional(),
  Vegg: z.boolean().optional(),
  VeggText: z.number().optional(),
  KommentarInspeksjonsluker: z.string().optional(),
});

export const TrappogLuker = forwardRef(
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
    const id = pathSegments.length > 2 ? pathSegments[2] : null;
    const kundeId = pathSegments.length > 3 ? pathSegments[3] : null;

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
        const husmodellDocRef = doc(db, "housemodell_configure_broker", String(id));

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

        const filteredData = removeUndefinedOrNull(data);

        let updatedKundeInfo = (existingData.KundeInfo || []).map(
          (kunde: any) => {
            if (kunde.uniqueId === kundeId) {
              return {
                ...kunde,
                TrappogLuker: filteredData,
                updatedAt: formatDate(new Date()),
              };
            }
            return kunde;
          }
        );

        const updatePayload: any = {
          ...existingData,
          KundeInfo: updatedKundeInfo,
        };

        setRoomsData(updatePayload);
        await setDoc(husmodellDocRef, updatePayload);
        toast.success("Lagret", {
          position: "top-right",
        });
        handleNext();
        localStorage.setItem("currVerticalIndex", String(10));
        setValidInitialSteps((prev: number[]) => {
          if (!prev.includes(9)) {
            return [...prev, 9];
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

    const Montering = useMemo(() => ["Trappeleverandør", "Lokal"], []);
    const Måltaking = useMemo(() => ["Trappeleverandør", "Lokal"], []);

    const TrappOptions = [
      "Ikke relevant",
      "I henhold til standardleveransebeskrivelse",
      "Annen trapp:",
    ];
    const IsolerteInspeksjonsluker = [
      "Standard hvitgrunnet 55x55 ihht. leveransebeskrivelse",
      "Furu (ikke Tek 07)",
    ];

    useEffect(() => {
      if (roomsData && roomsData?.TrappogLuker) {
        Object.entries(roomsData?.TrappogLuker).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            form.setValue(key as any, value);
          }
        });
      }
    }, [roomsData, form]);
    return (
      <>
        {isSubmitLoading && <Spinner />}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <div className="border border-[#B9C0D4] rounded-lg">
              <div className="text-darkBlack font-semibold text-base md:text-lg p-3 md:p-5 border-b border-[#B9C0D4]">
                Trapp og Luker
              </div>
              <div className="p-3 md:p-5">
                <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5 md:items-center">
                  <div className="col-span-3 text-darkBlack font-medium text-sm md:text-base">
                    Trapp
                  </div>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="Trapp"
                      render={() => {
                        const selected = form.watch("Trapp");

                        return (
                          <FormItem>
                            <p className="mb-2 font-medium text-darkBlack text-sm">
                              Velg ett alternativ:
                            </p>
                            <div className="flex flex-col gap-4">
                              {TrappOptions.map((option) => {
                                const isSelected = selected?.type === option;

                                return (
                                  <div
                                    key={option}
                                    className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5"
                                  >
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="Trapp"
                                        value={option}
                                        checked={isSelected}
                                        onChange={() =>
                                          form.setValue("Trapp", {
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
                                    {option !== "Ikke relevant" &&
                                      option !==
                                        "I henhold til standardleveransebeskrivelse" && (
                                        <div className="col-span-2">
                                          <Input
                                            placeholder="Beskriv trappemodell"
                                            value={
                                              isSelected
                                                ? selected?.colorCode || ""
                                                : ""
                                            }
                                            onChange={(e: any) => {
                                              if (isSelected) {
                                                form.setValue("Trapp", {
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
                      name="TypeTrinn"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Type trinn
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Beskriv overflate og farge"
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
                      name="Opptrinn"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Opptrinn
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Beskriv overflate og farge"
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
                      name="Sidevanger"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Sidevanger
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Beskriv overflate og farge"
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
                      name="Rekkverk"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Rekkverk
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Beskriv overflate og farge"
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
                      name="Håndlist"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Håndlist
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Beskriv overflate og farge"
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
                      name="Spiler"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Spiler
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Beskriv overflate og farge"
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
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="BodløsningTrapperom"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Bodløsning i trapperom
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
                  <div>
                    <FormField
                      control={form.control}
                      name={`Montering`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`mb-2 ${
                              fieldState.error ? "text-red" : "text-black"
                            } text-sm`}
                          >
                            Montering
                          </p>
                          <FormControl>
                            <div className="flex items-center flex-wrap gap-3 lg:gap-5">
                              {Montering.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    form.setValue("Montering", option);
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
                                        `Montering`,
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
                      name={`Måltaking`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`mb-2 ${
                              fieldState.error ? "text-red" : "text-black"
                            } text-sm`}
                          >
                            Måltaking
                          </p>
                          <FormControl>
                            <div className="flex items-center flex-wrap gap-3 lg:gap-5">
                              {Måltaking.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    form.setValue("Måltaking", option);
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
                                        `Måltaking`,
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
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="KommentarTrapp"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Kommentar til trapp
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
                  <div className="col-span-3 text-darkBlack font-medium text-sm md:text-base">
                    Isolerte inspeksjonsluker:
                  </div>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name={`IsolerteInspeksjonsluker`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Velg ett alternativ:
                          </p>
                          <FormControl>
                            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                              {IsolerteInspeksjonsluker.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    form.setValue(
                                      "IsolerteInspeksjonsluker",
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
                                        `IsolerteInspeksjonsluker`,
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
                  <div className="flex gap-2 items-center">
                    <FormField
                      control={form.control}
                      name="Himling"
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
                              id="Himling"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Himling
                          </p>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="HimlingText"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Antall"
                                {...field}
                                className={`w-full bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                                type="number"
                                onChange={(e: any) =>
                                  field.onChange(Number(e.target.value) || "")
                                }
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <FormField
                      control={form.control}
                      name="Vegg"
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
                              id="Vegg"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Vegg
                          </p>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="VeggText"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Antall"
                                {...field}
                                className={`w-full bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                                type="number"
                                onChange={(e: any) =>
                                  field.onChange(Number(e.target.value) || "")
                                }
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
                      name="KommentarInspeksjonsluker"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Kommentar til inspeksjonsluker
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
                    localStorage.setItem("currVerticalIndex", String(8));
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
