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
import { parsePhoneNumber } from "react-phone-number-input";
import { fetchRoomData, phoneNumberValidations } from "../../../../lib/utils";
import { InputMobile } from "../../../../components/ui/inputMobile";
import { House, Store, Warehouse } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import ApiUtils from "../../../../api";
import Ic_search_location from "../../../../assets/images/Ic_search_location.svg";
import { toast } from "react-hot-toast";
import { db } from "../../../../config/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { removeUndefinedOrNull } from "./Yttervegger";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import DatePickerComponent from "../../../../components/ui/datepicker";
import { Spinner } from "../../../../components/Spinner";

const formSchema = z
  .object({
    Kundenr: z.string({ required_error: "BP prosjektnummer er påkrevd." }),
    Tiltakshaver: z.string({ required_error: "Tiltakshaver er påkrevd." }),
    Byggeadresse: z.string({ required_error: "Byggeadresse er påkrevd." }),
    Postnr: z.string({ required_error: "Postnr er påkrevd." }),
    Poststed: z.string({ required_error: "Poststed er påkrevd." }),
    Kommune: z.number({ required_error: "Kommune er påkrevd." }),
    TelefonMobile: z.string().refine(
      (value) => {
        const parsedNumber = parsePhoneNumber(value);
        const countryCode = parsedNumber?.countryCallingCode
          ? `+${parsedNumber.countryCallingCode}`
          : "";
        const phoneNumber = parsedNumber?.nationalNumber || "";
        if (countryCode !== "+47") {
          return false;
        }
        const validator = phoneNumberValidations[countryCode];
        return validator ? validator(phoneNumber) : false;
      },
      {
        message:
          "Vennligst skriv inn et gyldig telefonnummer for det valgte landet.",
      }
    ),
    BestillingsoversiktDatert: z.string({
      required_error: "Bestillingsoversikt datert er påkrevd.",
    }),
    TypeProsjekt: z.string({ required_error: "Type prosjekt er påkrevd." }),
    Finansiering: z.string({ required_error: "Finansiering er påkrevd." }),
    VelgSerie: z.string().optional(),
    DatoBoligPartnerLeveransebeskrivelse: z.string({
      required_error: "Dato BoligPartner leveransebeskrivelse er påkrevd.",
    }),
    TypeKalkyle: z.string({ required_error: "Type kalkyle er påkrevd." }),
    VedleggTilKontraktDatert: z.string({
      required_error: "Vedlegg til kontrakt datert er påkrevd.",
    }),
    KommentarProsjektLeveransedetaljer: z.string().optional(),
    Situasjonsplan: z.string({
      required_error: "Situasjonsplan dat er påkrevd.",
    }),
    TegnNummer: z.number({ required_error: "Tegn.nummer er påkrevd." }),
    GjeldendeDato: z.string({
      required_error: "Gjeldende 1:50 tegning datert er påkrevd.",
    }),
    SignertDato: z.string({
      required_error: "Signert 1:100 tegning datert er påkrevd.",
    }),
    Kalkyledato: z.string({
      required_error: "Referanse / kalkyledato er påkrevd.",
    }),
    ØnsketLeveranseukeForFørsteKtkjøring: z.string({
      required_error: "Ønsket leveranseuke for første utkjøring er påkrevd.",
    }),
    TakstolerLeveresUke: z.string({
      required_error: "Takstoler leveres uke er påkrevd.",
    }),
    VinduerLeveresUke: z.string({
      required_error: "Vinduer leveres uke er påkrevd.",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.TypeProsjekt === "Bolig" || data.TypeProsjekt === "Hytte") {
      if (!data.VelgSerie) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Obligatorisk",
          path: ["VelgSerie"],
        });
      }
    }
  });

export const Prosjektdetaljer = forwardRef(
  (
    {
      handleNext,
      Prev,
      setRoomsData,
    }: {
      handleNext: () => void;
      Prev: () => void;
      setRoomsData: any;
    },
    ref: any
  ) => {
    const location = useLocation();
    const pathSegments = location.pathname.split("/");
    const id = pathSegments.length > 2 ? pathSegments[2] : null;

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
    });
    useImperativeHandle(ref, () => ({
      validateForm: async () => {
        const result = await form.trigger();
        return result;
      },
    }));
    const selectedHouseType = form.watch("TypeProsjekt");
    const VelgSerie = form.watch("VelgSerie");

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
          Prosjektdetaljer: filteredData,
          id: id,
          updatedAt: formatDate(new Date()),
        };
        setRoomsData(mergedData);
        await updateDoc(husmodellDocRef, mergedData);
        toast.success("Lagret", {
          position: "top-right",
        });
        handleNext();
        localStorage.setItem("currVerticalIndex", String(2));
      } catch (error) {
        console.error("error:", error);
        toast.error("Something went wrong!", {
          position: "top-right",
        });
      } finally {
        setIsSubmitLoading(false);
      }
    };
    const Finansiering = useMemo(() => ["Ja", "Nei"], []);
    const TypeKalkyle = useMemo(() => ["Kostnadsoverslag", "Prisgrunnlag"], []);

    const [address, setAddress] = useState("");
    const [addressData, setAddressData] = useState<any>(null);

    const kartInputRef = useRef<HTMLInputElement | null>(null);

    const handleKartInputChange = async (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value = e.target.value;
      setAddress(value);

      if (value) {
        try {
          const response = await ApiUtils.getAddress(value);
          if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
          }

          const json = await response.json();
          setAddressData(json.adresser);
        } catch (error: any) {
          console.error(error?.message);
        }
      }
    };
    const weekArray = useMemo(
      () => Array.from({ length: 53 }, (_, i) => (i + 1).toString()),
      []
    );

    useEffect(() => {
      if (!id) {
        return;
      }

      const getData = async () => {
        const data = await fetchRoomData(id);
        if (data) {
          if (data && data?.Prosjektdetaljer) {
            Object.entries(data?.Prosjektdetaljer).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                form.setValue(key as any, value);
              }
              if (key === "Byggeadresse") {
                setAddress(String(value));
              }
            });
          } else {
            form.setValue("Kundenr", data?.Kundenummer);
            form.setValue("VelgSerie", data?.HouseType ?? "");
            form.setValue("Byggeadresse", data?.Anleggsadresse ?? "");
            form.setValue("Poststed", data?.Poststed ?? "");
            form.setValue("Kommune", data?.Kommune ?? "");
            form.setValue("Postnr", data?.Postnr ?? "");
            form.setValue("TypeProsjekt", data?.TypeProsjekt ?? "Bolig");
            form.setValue("VelgSerie", data?.VelgSerie ?? "");
            form.setValue("TelefonMobile", data?.mobileNummer ?? "");
            form.setValue("Tiltakshaver", data?.Kundenavn ?? "");
            setAddress(String(data?.Anleggsadresse) ?? "");
          }
        } else {
          form.setValue("TypeProsjekt", "Bolig");
        }
      };

      getData();
    }, [form, id]);

    const typeProsjekt = form.watch("TypeProsjekt")?.toLowerCase();

    const seriesOptions: any = {
      bolig: [
        { label: "Funkis", value: "Funkis", Icon: House },
        { label: "Nostalgi", value: "Nostalgi", Icon: Store },
        { label: "Herskaplig", value: "Herskaplig", Icon: Warehouse },
        { label: "Moderne", value: "Moderne", Icon: Warehouse },
      ],
      hytte: [
        { label: "Karakter", value: "Karakter", Icon: House },
        { label: "Tur", value: "Tur", Icon: Store },
        { label: "V-serie", value: "V-serie", Icon: Warehouse },
        { label: "Moderne", value: "Moderne", Icon: Warehouse },
      ],
    };

    const selectedOptions = seriesOptions[typeProsjekt] || [];
    const velgSerie = VelgSerie;

    const selectedOnsketLeveranseukeWeek = form.watch(
      "ØnsketLeveranseukeForFørsteKtkjøring"
    );

    return (
      <>
        {isSubmitLoading && <Spinner />}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <div className="border border-[#B9C0D4] rounded-lg">
              <div className="text-darkBlack font-semibold text-base md:text-lg p-3 md:p-5 border-b border-[#B9C0D4]">
                PROSJEKTDETALJER
              </div>
              <div className="p-3 md:p-5">
                <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5 md:items-center">
                  <div className="col-span-3">
                    <p
                      className={`${
                        form.formState.errors.TypeProsjekt
                          ? "text-red"
                          : "text-black"
                      } mb-[6px] text-sm`}
                    >
                      Type prosjekt*:
                    </p>
                    <div className="flex flex-wrap gap-2 lg:gap-4 items-center">
                      {[
                        {
                          label: "Bolig",
                          icon: (
                            <House
                              className={`${
                                selectedHouseType === "Bolig"
                                  ? "text-[#444CE7]"
                                  : "text-[#5D6B98]"
                              }`}
                            />
                          ),
                          value: "Bolig",
                        },
                        {
                          label: "Hytte",
                          icon: (
                            <Store
                              className={`${
                                selectedHouseType === "Hytte"
                                  ? "text-[#444CE7]"
                                  : "text-[#5D6B98]"
                              }`}
                            />
                          ),
                          value: "Hytte",
                        },
                        {
                          label: "Prosjekt",
                          icon: (
                            <Warehouse
                              className={`${
                                selectedHouseType === "Prosjekt"
                                  ? "text-[#444CE7]"
                                  : "text-[#5D6B98]"
                              }`}
                            />
                          ),
                          value: "Prosjekt",
                        },
                      ].map((item: any, index: number) => (
                        <div
                          key={index}
                          onClick={() => {
                            form.setValue("TypeProsjekt", item.value);
                            form.clearErrors("TypeProsjekt");
                            form.resetField("VelgSerie");
                            form.setValue("VelgSerie", "");
                          }}
                          className={`flex items-center gap-2 border-2 rounded-lg py-2 px-3 cursor-pointer ${
                            selectedHouseType === item.value
                              ? "border-[#444CE7]"
                              : "border-[#EFF1F5]"
                          }`}
                        >
                          {item.icon}
                          <div className="text-darkBlack text-sm text-center">
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>
                    {form.formState.errors.TypeProsjekt && (
                      <p className="text-red text-sm mt-1">
                        {form.formState.errors.TypeProsjekt.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="Kundenr"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            BP prosjektnummer*
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn BP prosjektnummer"
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
                      name="Tiltakshaver"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Tiltakshaver*
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn navn på tiltakshaver"
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
                      name="Byggeadresse"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Byggeadresse*
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn Byggeadresse"
                                {...field}
                                className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                                type="text"
                                ref={kartInputRef}
                                onChange={handleKartInputChange}
                                value={address}
                                autoComplete="off"
                              />
                              {address &&
                                addressData &&
                                addressData.length > 0 && (
                                  <div
                                    className="absolute top-[45px] left-0 bg-white rounded-[8px] w-full h-auto max-h-[300px] overflow-y-auto overFlowYAuto"
                                    style={{
                                      zIndex: 999,
                                      boxShadow:
                                        "rgba(16, 24, 40, 0.09) 0px 4px 6px -2px, rgba(16, 24, 40, 0.09) 0px 12px 16px -4px",
                                    }}
                                  >
                                    {addressData &&
                                      addressData?.map(
                                        (address: any, index: number) => (
                                          <div
                                            className="p-2 flex items-center gap-2 hover:bg-lightPurple cursor-pointer"
                                            key={index}
                                            onClick={() => {
                                              form.setValue(
                                                "Byggeadresse",
                                                `${address.adressetekst} ${address.postnummer} ${address.poststed}`
                                              );
                                              setAddressData(null);
                                              setAddress(
                                                `${address.adressetekst} ${address.postnummer} ${address.poststed}`
                                              );
                                              form.setValue(
                                                "Postnr",
                                                address.postnummer
                                              );
                                              form.setValue(
                                                "Kommune",
                                                Number(address.kommunenummer)
                                              );
                                              form.setValue(
                                                "Poststed",
                                                address.poststed
                                              );
                                            }}
                                          >
                                            <img
                                              src={Ic_search_location}
                                              alt="location"
                                              className="w-6 h-6 md:w-7 md:h-7"
                                            />
                                            <div>
                                              <span className="text-black font-medium text-sm">
                                                {`${address.adressetekst}  ${address.postnummer} ${address.poststed}` ||
                                                  "N/A"}
                                              </span>
                                            </div>
                                          </div>
                                        )
                                      )}
                                  </div>
                                )}
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
                      name="Postnr"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Postnr*
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn Postnr"
                                {...field}
                                className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                                type="text"
                                disable
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
                      name="Poststed"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Poststed*
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn Poststed"
                                {...field}
                                className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                                type="text"
                                disable
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
                      name="Kommune"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Kommune*
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn Kommune"
                                {...field}
                                className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                                type="number"
                                onChange={(e: any) =>
                                  field.onChange(Number(e.target.value) || "")
                                }
                                disable
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-3 flex flex-col md:flex-row gap-4 md:gap-5 md:items-center">
                    <div className="md:w-1/2">
                      <FormField
                        control={form.control}
                        name="TelefonMobile"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm`}
                            >
                              Tlf. Mobil*
                            </p>
                            <FormControl>
                              <div className="relative">
                                <InputMobile
                                  placeholder="Skriv inn Tlf. Mobil"
                                  {...field}
                                  className={`bg-white rounded-[8px] border text-black
                              ${
                                fieldState?.error
                                  ? "border-red"
                                  : "border-gray1"
                              } `}
                                  type="tel"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="md:w-1/2">
                      <FormField
                        control={form.control}
                        name={`Finansiering`}
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`mb-2 ${
                                fieldState.error ? "text-red" : "text-black"
                              } text-sm`}
                            >
                              Har kunden godkjent finansiering?*
                            </p>
                            <FormControl>
                              <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                                {Finansiering.map((option) => (
                                  <div
                                    key={option}
                                    className="relative flex items-center gap-2 cursor-pointer"
                                    onClick={() => {
                                      form.setValue("Finansiering", option);
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
                                          `Finansiering`,
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
                  <div className="border-t border-[#B9C0D4] col-span-3 my-1"></div>
                  <h4 className="uppercase text-darkBlack font-semibold col-span-3 text-sm md:text-base">
                    Velg serie og leveransebeskrivelse
                  </h4>
                  {form.watch("TypeProsjekt") !== "Prosjekt" && (
                    <div className="col-span-3">
                      <p
                        className={`${
                          form.formState.errors.VelgSerie
                            ? "text-red"
                            : "text-black"
                        } mb-[6px] text-sm`}
                      >
                        Velg serie*
                      </p>
                      <div className="flex flex-wrap gap-2 lg:gap-4 items-center">
                        {selectedOptions.map((item: any, index: number) => (
                          <div
                            key={index}
                            onClick={() => {
                              form.setValue("VelgSerie", item.value);
                              form.clearErrors("VelgSerie");
                            }}
                            className={`flex items-center gap-2 border-2 rounded-lg py-2 px-3 cursor-pointer ${
                              VelgSerie === item.value
                                ? "border-[#444CE7]"
                                : "border-[#EFF1F5]"
                            }`}
                          >
                            <item.Icon
                              className={`${
                                velgSerie === item.value
                                  ? "text-[#444CE7]"
                                  : "text-[#5D6B98]"
                              }`}
                            />
                            <div className="text-darkBlack text-sm text-center">
                              {item.label}
                            </div>
                          </div>
                        ))}
                      </div>
                      {form.formState.errors.VelgSerie && (
                        <p className="text-red text-sm mt-1">
                          {form.formState.errors.VelgSerie.message}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name={`DatoBoligPartnerLeveransebeskrivelse`}
                      render={({ field, fieldState }: any) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : ""
                            } mb-[6px] text-sm`}
                          >
                            Dato BoligPartner leveransebeskrivelse*
                          </p>
                          <FormControl>
                            <div className="relative">
                              <DatePickerComponent
                                selectedDate={
                                  field.value ? new Date(field.value) : null
                                }
                                onDateChange={(date) => {
                                  const formattedDate = date
                                    ? `${date.getFullYear()}-${(
                                        date.getMonth() + 1
                                      )
                                        .toString()
                                        .padStart(2, "0")}-${date
                                        .getDate()
                                        .toString()
                                        .padStart(2, "0")}`
                                    : "";
                                  field.onChange(formattedDate);
                                }}
                                placeholderText="Skriv inn Dato BoligPartner leveransebeskrivelse"
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
                  <div className="border-t border-[#B9C0D4] col-span-3 my-1"></div>
                  <h4 className="uppercase text-darkBlack font-semibold col-span-3 text-sm md:text-base">
                    Prosjekteringsunderlag
                  </h4>
                  <div>
                    <FormField
                      control={form.control}
                      name="TegnNummer"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Tegn.nummer*
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn tegningsnummer"
                                {...field}
                                className={`bg-white rounded-[8px] border text-black
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
                  <div>
                    <FormField
                      control={form.control}
                      name={`SignertDato`}
                      render={({ field, fieldState }: any) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : ""
                            } mb-[6px] text-sm`}
                          >
                            Signert 1:100 tegning datert*
                          </p>
                          <FormControl>
                            <div className="relative">
                              <DatePickerComponent
                                selectedDate={
                                  field.value ? new Date(field.value) : null
                                }
                                onDateChange={(date) => {
                                  const formattedDate = date
                                    ? `${date.getFullYear()}-${(
                                        date.getMonth() + 1
                                      )
                                        .toString()
                                        .padStart(2, "0")}-${date
                                        .getDate()
                                        .toString()
                                        .padStart(2, "0")}`
                                    : "";
                                  field.onChange(formattedDate);
                                }}
                                placeholderText="Skriv inn Signert 1:100 tegning datert"
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
                  <div>
                    <FormField
                      control={form.control}
                      name={`GjeldendeDato`}
                      render={({ field, fieldState }: any) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : ""
                            } mb-[6px] text-sm`}
                          >
                            Gjeldende 1:50 tegning datert*
                          </p>
                          <FormControl>
                            <div className="relative">
                              <DatePickerComponent
                                selectedDate={
                                  field.value ? new Date(field.value) : null
                                }
                                onDateChange={(date) => {
                                  const formattedDate = date
                                    ? `${date.getFullYear()}-${(
                                        date.getMonth() + 1
                                      )
                                        .toString()
                                        .padStart(2, "0")}-${date
                                        .getDate()
                                        .toString()
                                        .padStart(2, "0")}`
                                    : "";
                                  field.onChange(formattedDate);
                                }}
                                placeholderText="Skriv inn Gjeldende 1:50 tegning datert"
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
                  <div>
                    <FormField
                      control={form.control}
                      name={`Situasjonsplan`}
                      render={({ field, fieldState }: any) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : ""
                            } mb-[6px] text-sm`}
                          >
                            Situasjonsplan (dato)*
                          </p>
                          <FormControl>
                            <div className="relative">
                              <DatePickerComponent
                                selectedDate={
                                  field.value ? new Date(field.value) : null
                                }
                                onDateChange={(date) => {
                                  const formattedDate = date
                                    ? `${date.getFullYear()}-${(
                                        date.getMonth() + 1
                                      )
                                        .toString()
                                        .padStart(2, "0")}-${date
                                        .getDate()
                                        .toString()
                                        .padStart(2, "0")}`
                                    : "";
                                  field.onChange(formattedDate);
                                }}
                                placeholderText="Skriv inn Situasjonsplan dat"
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
                  <div>
                    <FormField
                      control={form.control}
                      name={`Kalkyledato`}
                      render={({ field, fieldState }: any) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : ""
                            } mb-[6px] text-sm`}
                          >
                            Kalkyledato*
                          </p>
                          <FormControl>
                            <div className="relative">
                              <DatePickerComponent
                                selectedDate={
                                  field.value ? new Date(field.value) : null
                                }
                                onDateChange={(date) => {
                                  const formattedDate = date
                                    ? `${date.getFullYear()}-${(
                                        date.getMonth() + 1
                                      )
                                        .toString()
                                        .padStart(2, "0")}-${date
                                        .getDate()
                                        .toString()
                                        .padStart(2, "0")}`
                                    : "";
                                  field.onChange(formattedDate);
                                }}
                                placeholderText="Skriv inn Referanse / kalkyledato"
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
                  <div>
                    <FormField
                      control={form.control}
                      name={`TypeKalkyle`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`mb-2 ${
                              fieldState.error ? "text-red" : "text-black"
                            } text-sm`}
                          >
                            Type kalkyle*
                          </p>
                          <FormControl>
                            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                              {TypeKalkyle.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    form.setValue("TypeKalkyle", option);
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
                                        `TypeKalkyle`,
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
                  <h4 className="uppercase text-darkBlack font-semibold col-span-3 text-sm md:text-base">
                    Leveransedetaljer
                  </h4>
                  <div className="col-span-3 flex flex-col md:flex-row gap-4 md:gap-5">
                    <div className="md:w-1/2">
                      <FormField
                        control={form.control}
                        name="ØnsketLeveranseukeForFørsteKtkjøring"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm`}
                            >
                              Ønsket leveranseuke for første utkjøring*
                            </p>
                            <FormControl>
                              <div className="relative">
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    form.setValue("TakstolerLeveresUke", "");
                                    form.setValue("VinduerLeveresUke", "");
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
                                    <SelectValue placeholder="Velg uke" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white">
                                    <SelectGroup>
                                      {weekArray?.map((item, index) => {
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
                    <div className="md:w-1/2">
                      <FormField
                        control={form.control}
                        name="TakstolerLeveresUke"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm`}
                            >
                              Takstoler leveres uke*
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
                                    <SelectValue placeholder="Velg uke" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white">
                                    <SelectGroup>
                                      {weekArray?.map((item, index) => {
                                        const weekNumber = parseInt(item);
                                        const selectedWeekNumber =
                                          selectedOnsketLeveranseukeWeek
                                            ? parseInt(
                                                selectedOnsketLeveranseukeWeek
                                              )
                                            : 0;
                                        const isDisabled =
                                          weekNumber <= selectedWeekNumber;

                                        return (
                                          <SelectItem
                                            key={index}
                                            value={item}
                                            disabled={isDisabled}
                                            className={
                                              isDisabled
                                                ? "text-gray-400 cursor-not-allowed"
                                                : ""
                                            }
                                          >
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
                  </div>
                  <div className="col-span-3 flex flex-col md:flex-row gap-4 md:gap-5">
                    <div className="md:w-1/3">
                      <FormField
                        control={form.control}
                        name="VinduerLeveresUke"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm`}
                            >
                              Vinduer leveres uke*
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
                                    <SelectValue placeholder="Velg uke" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white">
                                    <SelectGroup>
                                      {weekArray?.map((item, index) => {
                                        const weekNumber = parseInt(item);
                                        const selectedWeekNumber =
                                          selectedOnsketLeveranseukeWeek
                                            ? parseInt(
                                                selectedOnsketLeveranseukeWeek
                                              )
                                            : 0;
                                        const isDisabled =
                                          weekNumber <= selectedWeekNumber;

                                        return (
                                          <SelectItem
                                            key={index}
                                            value={item}
                                            disabled={isDisabled}
                                            className={
                                              isDisabled
                                                ? "text-gray-400 cursor-not-allowed"
                                                : ""
                                            }
                                          >
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
                    <div className="md:w-2/3">
                      <FormField
                        control={form.control}
                        name={`VedleggTilKontraktDatert`}
                        render={({ field, fieldState }: any) => (
                          <FormItem>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : ""
                              } mb-[6px] text-sm`}
                            >
                              Vedlegg til kontrakt datert*
                            </p>
                            <FormControl>
                              <div className="relative">
                                <DatePickerComponent
                                  selectedDate={
                                    field.value ? new Date(field.value) : null
                                  }
                                  onDateChange={(date) => {
                                    const formattedDate = date
                                      ? `${date.getFullYear()}-${(
                                          date.getMonth() + 1
                                        )
                                          .toString()
                                          .padStart(2, "0")}-${date
                                          .getDate()
                                          .toString()
                                          .padStart(2, "0")}`
                                      : "";
                                    field.onChange(formattedDate);
                                  }}
                                  placeholderText="Skriv inn Vedlegg til kontrakt datert"
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
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="BestillingsoversiktDatert"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Bestillingsoversikt datert*
                          </p>
                          <FormControl>
                            <div className="relative">
                              <DatePickerComponent
                                selectedDate={
                                  field.value ? new Date(field.value) : null
                                }
                                onDateChange={(date) => {
                                  const formattedDate = date
                                    ? `${date.getFullYear()}-${(
                                        date.getMonth() + 1
                                      )
                                        .toString()
                                        .padStart(2, "0")}-${date
                                        .getDate()
                                        .toString()
                                        .padStart(2, "0")}`
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
                      name={`KommentarProsjektLeveransedetaljer`}
                      render={({ field, fieldState }: any) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : ""
                            } mb-[6px] text-sm`}
                          >
                            Kommentar til prosjekt- og leveransedetaljer
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
                    Prev();
                    const currIndex = 0;
                    localStorage.setItem(
                      "currIndexBolig",
                      currIndex.toString()
                    );
                  }}
                >
                  <Button
                    text="Avbryt"
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
