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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Input } from "../../../../components/ui/input";
import { forwardRef, useEffect, useImperativeHandle, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { removeUndefinedOrNull } from "./Yttervegger";

const formSchema = z.object({
  Inngangsdør: z
    .object({
      type: z.string(),
      colorCode: z.string().optional(),
      dør: z.string().optional(),
      Dørfarge: z.string().optional(),
    })
    .optional(),
  UtforingFarge: z.string().optional(),
  SlagretningTofløyetDør: z.string().optional(),
  SikkerhetslåsType: z.string().optional(),
  TilleggslåsType: z.string().optional(),
  KommentarInngangsdør: z.string().optional(),
  Boddør: z
    .object({
      type: z.string(),
      colorCode: z.string().optional(),
    })
    .optional(),
  LikelåsMedHoveddør: z.string().optional(),
  KommentarBoddør: z.string().optional(),
  BalkongTerrassedør: z.object({
    BalkongTerrassedør: z
      .object({
        type: z.string(),
        colorCode: z.string().optional(),
      })
      .optional(),
    UtforingFarge: z.string().optional(),
    SlagretningTofløyetDør: z.string().optional(),
    MedTerskelforing: z.string().optional(),
    LikelåsMedHoveddør: z.string().optional(),
    UtvendigInnvendigSylinder: z.string().optional(),
    KommentarBalkongdør: z.string().optional(),
  }),
  InnvendigeDører: z.object({
    InnvendigeDører: z
      .object({
        type: z.string(),
        colorCode: z.string().optional(),
        dør: z.string().optional(),
        Dørfarge: z.string().optional(),
      })
      .optional(),
    KommentarTilInnvendigeDører: z.string().optional(),
    Glassdør: z.string().optional(),
    SkyvedørMedGlass: z.string().optional(),
    SkyvedørskarmSeparatOrdre: z.string().optional(),
    UtforingFarge: z.string().optional(),
    SlagretningTofløyetDør: z.string().optional(),
    Dempelister: z.string().optional(),
    Terskeltype: z.array(z.string()).optional(),
    Hengsler: z.string().optional(),
    SporBelegg: z.string().optional(),
  }),
  Dørvridere: z
    .object({
      type: z.string(),
      colorCode: z.string().optional(),
      dør: z.string().optional(),
      Dørfarge: z.string().optional(),
    })
    .optional(),
  DørerKjellerrom: z
    .object({
      type: z.string(),
      colorCode: z.string().optional(),
      dør: z.string().optional(),
      Dørfarge: z.string().optional(),
    })
    .optional(),
  Garasjeport: z.object({
    Garasjeport: z
      .object({
        type: z.string(),
        colorCode: z.string().optional(),
        dør: z.string().optional(),
        Dørfarge: z.string().optional(),
      })
      .optional(),
    BreddeXhøyde: z.string().optional(),
    Portåpner: z.boolean().optional(),
    MicroSenderAntall: z.string().optional(),
    AlternativRAL: z.string().optional(),
  }),
});

export const Dører = forwardRef(
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
          Dører: filteredData,
          id: id,
          updatedAt: formatDate(new Date()),
        };
        setRoomsData(mergedData);

        await updateDoc(husmodellDocRef, mergedData);
        toast.success("Lagret", {
          position: "top-right",
        });
        handleNext();
        localStorage.setItem("currVerticalIndex", String(8));
      } catch (error) {
        console.error("error:", error);
        toast.error("Something went wrong!", {
          position: "top-right",
        });
      }
    };

    const InngangsdørOptions = useMemo(
      () => [
        "Standard hvitmalt ihht. signaturbeskrivelse",
        "Standard dør annen farge",
        "Annen dørmodell",
      ],
      []
    );
    const UtforingFarge = useMemo(() => ["Hvit", "Som dørfarge"], []);
    const SlagretningTofløyetDør = useMemo(() => ["Høyre", "Venstre"], []);
    const BoddørOptions = useMemo(
      () => [
        "Ikke relevant",
        "Hvitmalt type ihht. signatur",
        "Malt dør og karm annen farge",
      ],
      []
    );
    const BalkongTerrassedørOptions = useMemo(
      () => [
        "Standard hvitmalt utvendig/innvendig",
        "Annen farge",
        "Alubeslått utvendig",
      ],
      []
    );
    const InnvendigeDørerOptions = useMemo(
      () => [
        "Standard hvitmalt ihht. signaturbeskrivelse",
        "Standard dør annen farge",
        "Annen dørmodell",
      ],
      []
    );
    const DørvridereOptions = useMemo(
      () => ["Standard hht. signaturbeskrivelse", "Annen vrider"],
      []
    );
    const DørerKjellerromOptions = useMemo(
      () => ["Ikke relevant", "Samme som 1. etg.", "Annen type"],
      []
    );
    const GarasjeportOptions = useMemo(
      () => [
        "Ikke relevant",
        "Standard ihenhold til leveransebeskrivelse",
        "Annen type",
      ],
      []
    );
    const LikelåsMedHoveddør = useMemo(() => ["Ja", "Nei"], []);
    const Terskeltype = useMemo(
      () => ["Standard", "Påforingsterskel", "våtrom"],
      []
    );
    const array = useMemo(() => ["Abc", "Xyz"], []);

    useEffect(() => {
      if (roomsData && roomsData?.Dører) {
        Object.entries(roomsData?.Dører).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            form.setValue(key as any, value);
          }
        });
      }
    }, [roomsData, form]);
    return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <div className="border border-[#B9C0D4] rounded-lg">
              <div className="text-darkBlack font-semibold text-lg p-5 border-b border-[#B9C0D4]">
                Dører
              </div>
              <div className="p-4 md:p-5">
                <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5">
                  <h4 className="uppercase text-darkBlack font-semibold col-span-3">
                    INNGANGSDØR
                  </h4>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="Inngangsdør"
                      render={() => {
                        const selected = form.watch("Inngangsdør");

                        return (
                          <FormItem>
                            <p className="mb-2 font-medium text-darkBlack text-sm">
                              Velg ett alternativ:
                            </p>
                            <div className="flex flex-col gap-4">
                              {InngangsdørOptions.map((option) => {
                                const isSelected = selected?.type === option;

                                return (
                                  <div
                                    key={option}
                                    className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5"
                                  >
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="Inngangsdør"
                                        value={option}
                                        checked={isSelected}
                                        onChange={() =>
                                          form.setValue("Inngangsdør", {
                                            type: option,
                                            colorCode: "",
                                            dør: "",
                                            Dørfarge: "",
                                          })
                                        }
                                        className="h-4 w-4 accent-[#444CE7]"
                                      />
                                      <span className="text-black text-sm">
                                        {option}
                                      </span>
                                    </label>
                                    {option !==
                                      "Standard hvitmalt ihht. signaturbeskrivelse" &&
                                      option !== "Annen dørmodell" && (
                                        <div className="col-span-2">
                                          <Input
                                            placeholder="Skriv kode"
                                            value={
                                              isSelected
                                                ? selected?.colorCode || ""
                                                : ""
                                            }
                                            onChange={(e: any) => {
                                              if (isSelected) {
                                                form.setValue("Inngangsdør", {
                                                  type: option,
                                                  colorCode: e.target.value,
                                                  Dørfarge: "",
                                                  dør: "",
                                                });
                                              }
                                            }}
                                            className={`bg-white rounded-[8px] border text-black border-gray1`}
                                            disable={!isSelected}
                                          />
                                        </div>
                                      )}
                                    {option !==
                                      "Standard hvitmalt ihht. signaturbeskrivelse" &&
                                      option !== "Standard dør annen farge" && (
                                        <>
                                          <div>
                                            <Input
                                              placeholder="Type dør"
                                              value={
                                                isSelected
                                                  ? selected?.dør || ""
                                                  : ""
                                              }
                                              onChange={(e: any) => {
                                                if (isSelected) {
                                                  form.setValue("Inngangsdør", {
                                                    type: option,
                                                    dør: e.target.value,
                                                    Dørfarge: form.watch(
                                                      "Inngangsdør.Dørfarge"
                                                    ),
                                                    colorCode: "",
                                                  });
                                                }
                                              }}
                                              className={`bg-white rounded-[8px] border text-black border-gray1`}
                                              disable={!isSelected}
                                            />
                                          </div>
                                          <div>
                                            <Input
                                              placeholder="Dørfarge"
                                              value={
                                                isSelected
                                                  ? selected?.Dørfarge || ""
                                                  : ""
                                              }
                                              onChange={(e: any) => {
                                                if (isSelected) {
                                                  form.setValue("Inngangsdør", {
                                                    type: option,
                                                    Dørfarge: e.target.value,
                                                    dør: form.watch(
                                                      "Inngangsdør.dør"
                                                    ),
                                                    colorCode: "",
                                                  });
                                                }
                                              }}
                                              className={`bg-white rounded-[8px] border text-black border-gray1`}
                                              disable={!isSelected}
                                            />
                                          </div>
                                        </>
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
                  <div className="col-span-3 text-darkBlack font-medium text-base">
                    Andre valg
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
                      name={`SlagretningTofløyetDør`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Slagretning tofløyet dør
                          </p>
                          <FormControl>
                            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                              {SlagretningTofløyetDør.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    form.setValue(
                                      "SlagretningTofløyetDør",
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
                                        `SlagretningTofløyetDør`,
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
                  <div></div>
                  <div>
                    <FormField
                      control={form.control}
                      name="SikkerhetslåsType"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Sikkerhetslås type
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv type"
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
                      name="TilleggslåsType"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Tilleggslås type
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv type"
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
                  <div></div>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="KommentarInngangsdør"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Kommentar til inngangsdør:
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn kommentar"
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
                  <div className="col-span-3 text-darkBlack font-medium text-base uppercase">
                    BODDØR
                  </div>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="Boddør"
                      render={() => {
                        const selected = form.watch("Boddør");

                        return (
                          <FormItem>
                            <div className="flex flex-col gap-4">
                              {BoddørOptions.map((option) => {
                                const isSelected = selected?.type === option;

                                return (
                                  <div
                                    key={option}
                                    className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5"
                                  >
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="Boddør"
                                        value={option}
                                        checked={isSelected}
                                        onChange={() =>
                                          form.setValue("Boddør", {
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
                                        "Hvitmalt type ihht. signatur" && (
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
                                                form.setValue("Boddør", {
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
                      name={`LikelåsMedHoveddør`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Likelås med hoveddør
                          </p>
                          <FormControl>
                            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                              {LikelåsMedHoveddør.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    form.setValue("LikelåsMedHoveddør", option);
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
                                        `LikelåsMedHoveddør`,
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
                      name="KommentarBoddør"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Kommentar til boddør:
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
                  <div className="col-span-3 text-darkBlack font-medium text-base">
                    Balkong/Terrassedør
                  </div>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="BalkongTerrassedør.BalkongTerrassedør"
                      render={() => {
                        const selected = form.watch(
                          "BalkongTerrassedør.BalkongTerrassedør"
                        );

                        return (
                          <FormItem>
                            <div className="flex flex-col gap-4">
                              {BalkongTerrassedørOptions.map((option) => {
                                const isSelected = selected?.type === option;

                                return (
                                  <div
                                    key={option}
                                    className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5"
                                  >
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="BalkongTerrassedør.BalkongTerrassedør"
                                        value={option}
                                        checked={isSelected}
                                        onChange={() =>
                                          form.setValue(
                                            "BalkongTerrassedør.BalkongTerrassedør",
                                            {
                                              type: option,
                                              colorCode: "",
                                            }
                                          )
                                        }
                                        className="h-4 w-4 accent-[#444CE7]"
                                      />
                                      <span className="text-black text-sm">
                                        {option}
                                      </span>
                                    </label>
                                    {option !==
                                      "Standard hvitmalt utvendig/innvendig" && (
                                      <div className="col-span-2">
                                        <Input
                                          placeholder="Dørfarge"
                                          value={
                                            isSelected
                                              ? selected?.colorCode || ""
                                              : ""
                                          }
                                          onChange={(e: any) => {
                                            if (isSelected) {
                                              form.setValue(
                                                "BalkongTerrassedør.BalkongTerrassedør",
                                                {
                                                  type: option,
                                                  colorCode: e.target.value,
                                                }
                                              );
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
                      name={`BalkongTerrassedør.UtforingFarge`}
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
                                      "BalkongTerrassedør.UtforingFarge",
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
                                        `BalkongTerrassedør.UtforingFarge`,
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
                      name={`BalkongTerrassedør.SlagretningTofløyetDør`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Slagretning tofløyet dør/skyveretning
                          </p>
                          <FormControl>
                            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                              {SlagretningTofløyetDør.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    form.setValue(
                                      "BalkongTerrassedør.SlagretningTofløyetDør",
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
                                        `BalkongTerrassedør.SlagretningTofløyetDør`,
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
                      name={`BalkongTerrassedør.MedTerskelforing`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Med terskelforing
                          </p>
                          <FormControl>
                            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                              {LikelåsMedHoveddør.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    form.setValue(
                                      "BalkongTerrassedør.MedTerskelforing",
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
                                        `BalkongTerrassedør.MedTerskelforing`,
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
                      name={`BalkongTerrassedør.LikelåsMedHoveddør`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Likelås med hoveddør
                          </p>
                          <FormControl>
                            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                              {LikelåsMedHoveddør.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    form.setValue(
                                      "BalkongTerrassedør.LikelåsMedHoveddør",
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
                                        `BalkongTerrassedør.LikelåsMedHoveddør`,
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
                      name={`BalkongTerrassedør.UtvendigInnvendigSylinder`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Utvendig/innvendig sylinder
                          </p>
                          <FormControl>
                            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                              {LikelåsMedHoveddør.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    form.setValue(
                                      "BalkongTerrassedør.UtvendigInnvendigSylinder",
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
                                        `BalkongTerrassedør.UtvendigInnvendigSylinder`,
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
                      name="BalkongTerrassedør.KommentarBalkongdør"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Kommentar til balkongdør:
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn kommentar"
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
                    INNVENDIGE DØRER
                  </div>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="InnvendigeDører.InnvendigeDører"
                      render={() => {
                        const selected = form.watch(
                          "InnvendigeDører.InnvendigeDører"
                        );

                        return (
                          <FormItem>
                            <p className="mb-2 font-medium text-darkBlack text-sm">
                              Velg ett alternativ:
                            </p>
                            <div className="flex flex-col gap-4">
                              {InnvendigeDørerOptions.map((option) => {
                                const isSelected = selected?.type === option;

                                return (
                                  <div
                                    key={option}
                                    className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5"
                                  >
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="InnvendigeDører.InnvendigeDører"
                                        value={option}
                                        checked={isSelected}
                                        onChange={() =>
                                          form.setValue(
                                            "InnvendigeDører.InnvendigeDører",
                                            {
                                              type: option,
                                              colorCode: "",
                                              dør: "",
                                              Dørfarge: "",
                                            }
                                          )
                                        }
                                        className="h-4 w-4 accent-[#444CE7]"
                                      />
                                      <span className="text-black text-sm">
                                        {option}
                                      </span>
                                    </label>
                                    {option !==
                                      "Standard hvitmalt ihht. signaturbeskrivelse" &&
                                      option !== "Annen dørmodell" && (
                                        <div className="col-span-2">
                                          <Input
                                            placeholder="Skriv kode"
                                            value={
                                              isSelected
                                                ? selected?.colorCode || ""
                                                : ""
                                            }
                                            onChange={(e: any) => {
                                              if (isSelected) {
                                                form.setValue(
                                                  "InnvendigeDører.InnvendigeDører",
                                                  {
                                                    type: option,
                                                    colorCode: e.target.value,
                                                    Dørfarge: "",
                                                    dør: "",
                                                  }
                                                );
                                              }
                                            }}
                                            className={`bg-white rounded-[8px] border text-black border-gray1`}
                                            disable={!isSelected}
                                          />
                                        </div>
                                      )}
                                    {option !==
                                      "Standard hvitmalt ihht. signaturbeskrivelse" &&
                                      option !== "Standard dør annen farge" && (
                                        <>
                                          <div>
                                            <Input
                                              placeholder="Type dør"
                                              value={
                                                isSelected
                                                  ? selected?.dør || ""
                                                  : ""
                                              }
                                              onChange={(e: any) => {
                                                if (isSelected) {
                                                  form.setValue(
                                                    "InnvendigeDører.InnvendigeDører",
                                                    {
                                                      type: option,
                                                      dør: e.target.value,
                                                      Dørfarge: form.watch(
                                                        "InnvendigeDører.InnvendigeDører.Dørfarge"
                                                      ),
                                                      colorCode: "",
                                                    }
                                                  );
                                                }
                                              }}
                                              className={`bg-white rounded-[8px] border text-black border-gray1`}
                                              disable={!isSelected}
                                            />
                                          </div>
                                          <div>
                                            <Input
                                              placeholder="Dørfarge"
                                              value={
                                                isSelected
                                                  ? selected?.Dørfarge || ""
                                                  : ""
                                              }
                                              onChange={(e: any) => {
                                                if (isSelected) {
                                                  form.setValue(
                                                    "InnvendigeDører.InnvendigeDører",
                                                    {
                                                      type: option,
                                                      Dørfarge: e.target.value,
                                                      dør: form.watch(
                                                        "InnvendigeDører.InnvendigeDører.dør"
                                                      ),
                                                      colorCode: "",
                                                    }
                                                  );
                                                }
                                              }}
                                              className={`bg-white rounded-[8px] border text-black border-gray1`}
                                              disable={!isSelected}
                                            />
                                          </div>
                                        </>
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
                      name="InnvendigeDører.KommentarTilInnvendigeDører"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Kommentar til innvendige dører:
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
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="InnvendigeDører.Glassdør"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Glassdør
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Beskriv hvor og type dør"
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
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="InnvendigeDører.SkyvedørMedGlass"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Skyvedør med glass
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Beskriv hvor og type"
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
                      name="InnvendigeDører.SkyvedørskarmSeparatOrdre"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Skyvedørskarm separat ordre
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Velg dato"
                                {...field}
                                className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                                type="date"
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
                      name={`InnvendigeDører.UtforingFarge`}
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
                                      "InnvendigeDører.UtforingFarge",
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
                                        `InnvendigeDører.UtforingFarge`,
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
                      name={`InnvendigeDører.SlagretningTofløyetDør`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Slagretning tofløyet dør
                          </p>
                          <FormControl>
                            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                              {SlagretningTofløyetDør.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    form.setValue(
                                      "InnvendigeDører.SlagretningTofløyetDør",
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
                                        `InnvendigeDører.SlagretningTofløyetDør`,
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
                      name={`InnvendigeDører.Dempelister`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Dempelister
                          </p>
                          <FormControl>
                            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                              {LikelåsMedHoveddør.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    form.setValue(
                                      "InnvendigeDører.Dempelister",
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
                                        `InnvendigeDører.Dempelister`,
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
                      name={`InnvendigeDører.Terskeltype`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`mb-2 ${
                              fieldState.error ? "text-red" : "text-black"
                            } text-sm`}
                          >
                            Terskeltype
                          </p>
                          <FormControl>
                            <div className="flex items-center flex-wrap gap-3 lg:gap-5">
                              {Terskeltype.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    const currentValues = field.value || [];
                                    const isChecked =
                                      currentValues.includes(option);

                                    const newValues = isChecked
                                      ? currentValues.filter(
                                          (val) => val !== option
                                        )
                                      : [...currentValues, option];

                                    form.setValue(
                                      "InnvendigeDører.Terskeltype",
                                      newValues
                                    );
                                  }}
                                >
                                  <input
                                    className={`bg-white rounded-[8px] border text-black
        ${
          fieldState?.error ? "border-red" : "border-gray1"
        } h-4 w-4 accent-[#444CE7]`}
                                    type="checkbox"
                                    value={option}
                                    checked={field.value?.includes(option)}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      const currentValues = field.value || [];

                                      if (checked) {
                                        form.setValue(
                                          "InnvendigeDører.Terskeltype",
                                          [...currentValues, option]
                                        );
                                      } else {
                                        form.setValue(
                                          "InnvendigeDører.Terskeltype",
                                          currentValues.filter(
                                            (val) => val !== option
                                          )
                                        );
                                      }
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
                      name="InnvendigeDører.Hengsler"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Hengsler
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Beskriv utover standard"
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
                      name={`InnvendigeDører.SporBelegg`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Spor for belegg
                          </p>
                          <FormControl>
                            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                              {LikelåsMedHoveddør.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    form.setValue(
                                      "InnvendigeDører.SporBelegg",
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
                                        `InnvendigeDører.SporBelegg`,
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
                  <div className="border-t border-[#B9C0D4] col-span-3 my-1"></div>
                  <div className="col-span-3 text-darkBlack font-medium text-base">
                    DØRVRIDERE
                  </div>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="Dørvridere"
                      render={() => {
                        const selected = form.watch("Dørvridere");

                        return (
                          <FormItem>
                            <p className="mb-2 font-medium text-darkBlack text-sm">
                              Velg ett alternativ:
                            </p>
                            <div className="flex flex-col gap-4">
                              {DørvridereOptions.map((option) => {
                                const isSelected = selected?.type === option;

                                return (
                                  <div
                                    key={option}
                                    className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5"
                                  >
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="Dørvridere"
                                        value={option}
                                        checked={isSelected}
                                        onChange={() =>
                                          form.setValue("Dørvridere", {
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
                                      "Standard hht. signaturbeskrivelse" && (
                                      <div className="col-span-2">
                                        <Input
                                          placeholder="Type vrider"
                                          value={
                                            isSelected
                                              ? selected?.colorCode || ""
                                              : ""
                                          }
                                          onChange={(e: any) => {
                                            if (isSelected) {
                                              form.setValue("Dørvridere", {
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
                  <div className="col-span-3 text-darkBlack font-medium text-base">
                    Dører i kjellerrom
                  </div>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="DørerKjellerrom"
                      render={() => {
                        const selected = form.watch("DørerKjellerrom");

                        return (
                          <FormItem>
                            <div className="flex flex-col gap-4">
                              {DørerKjellerromOptions.map((option) => {
                                const isSelected = selected?.type === option;

                                return (
                                  <div
                                    key={option}
                                    className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5"
                                  >
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="DørerKjellerrom"
                                        value={option}
                                        checked={isSelected}
                                        onChange={() =>
                                          form.setValue("DørerKjellerrom", {
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
                                      option !== "Samme som 1. etg." && (
                                        <div className="col-span-2">
                                          <Input
                                            placeholder="Beskriv her"
                                            value={
                                              isSelected
                                                ? selected?.colorCode || ""
                                                : ""
                                            }
                                            onChange={(e: any) => {
                                              if (isSelected) {
                                                form.setValue(
                                                  "DørerKjellerrom",
                                                  {
                                                    type: option,
                                                    colorCode: e.target.value,
                                                  }
                                                );
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
                  <div className="col-span-3 text-darkBlack font-medium text-base">
                    Garasjeport
                  </div>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="Garasjeport.Garasjeport"
                      render={() => {
                        const selected = form.watch("Garasjeport.Garasjeport");

                        return (
                          <FormItem>
                            <div className="flex flex-col gap-4">
                              {GarasjeportOptions.map((option) => {
                                const isSelected = selected?.type === option;

                                return (
                                  <div
                                    key={option}
                                    className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5"
                                  >
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="Garasjeport.Garasjeport"
                                        value={option}
                                        checked={isSelected}
                                        onChange={() =>
                                          form.setValue(
                                            "Garasjeport.Garasjeport",
                                            {
                                              type: option,
                                              colorCode: "",
                                            }
                                          )
                                        }
                                        className="h-4 w-4 accent-[#444CE7]"
                                      />
                                      <span className="text-black text-sm">
                                        {option}
                                      </span>
                                    </label>
                                    {option !== "Ikke relevant" &&
                                      option !==
                                        "Standard ihenhold til leveransebeskrivelse" && (
                                        <div className="col-span-2">
                                          <Input
                                            placeholder="Beskriv her"
                                            value={
                                              isSelected
                                                ? selected?.colorCode || ""
                                                : ""
                                            }
                                            onChange={(e: any) => {
                                              if (isSelected) {
                                                form.setValue(
                                                  "Garasjeport.Garasjeport",
                                                  {
                                                    type: option,
                                                    colorCode: e.target.value,
                                                  }
                                                );
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
                      name="Garasjeport.BreddeXhøyde"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Bredde x høyde
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                }}
                                value={field.value}
                              >
                                <SelectTrigger
                                  className={`bg-white rounded-[8px] border text-black
                              ${
                                fieldState?.error
                                  ? "border-red"
                                  : "border-gray1"
                              } `}
                                >
                                  <SelectValue placeholder="Velg" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectGroup>
                                    {array?.map((item, index) => {
                                      return (
                                        <SelectItem key={index} value={item}>
                                          {item}
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
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
                      name="Garasjeport.Portåpner"
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
                              id="Garasjeport.Portåpner"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Portåpner
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="Garasjeport.MicroSenderAntall"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Micro-sender antall
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv antall"
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
                      name="Garasjeport.AlternativRAL"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Alternativ RAL
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
                    localStorage.setItem("currVerticalIndex", String(6));
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
