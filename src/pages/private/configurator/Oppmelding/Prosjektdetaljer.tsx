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
import { phoneNumberValidations } from "../../../../lib/utils";
import { InputMobile } from "../../../../components/ui/inputMobile";
import { House, Store, Warehouse } from "lucide-react";
import { forwardRef, useImperativeHandle } from "react";

const formSchema = z.object({
  Kundenr: z.number({ required_error: "Kundenr er påkrevd." }),
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
  TelefonPrivate: z.string().refine(
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
  Hustype: z.string({ required_error: "Hustype er påkrevd." }),
  Finansiering: z.string({ required_error: "Finansiering er påkrevd." }),
  Leveransebeskrivelse: z.string({
    required_error: "Leveransebeskrivelse er påkrevd.",
  }),
  Energiberegning: z.string().optional(),
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
  Referansekalkyledato: z.string({
    required_error: "Referanse / kalkyledato er påkrevd.",
  }),
});

// export const Prosjektdetaljer: React.FC<{ handleNext: any }> = ({
//   handleNext,
// }) => {
export const Prosjektdetaljer = forwardRef(
  (
    { handleNext, Prev }: { handleNext: () => void; Prev: () => void },
    ref: any
  ) => {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
    });
    useImperativeHandle(ref, () => ({
      validateForm: async () => {
        const result = await form.trigger();
        return result;
      },
    }));

    const selectedHouseType = form.watch("Hustype");

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
      console.log(data);
      handleNext();
      localStorage.setItem("currVerticalIndex", String(2));
    };
    const Finansiering = ["Privat", "Husbank"];
    return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <div className="border border-[#B9C0D4] rounded-lg">
              <div className="text-darkBlack font-semibold text-lg p-5 border-b border-[#B9C0D4]">
                Prosjektdetaljer
              </div>
              <div className="p-4 md:p-5">
                <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5">
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
                            Kundenr*
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn Kundenr"
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
                                placeholder="Skriv inn Tiltakshaver"
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
                  <div>
                    <FormField
                      control={form.control}
                      name="TelefonPrivate"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Tlf. privat*
                          </p>
                          <FormControl>
                            <div className="relative">
                              <InputMobile
                                placeholder="Skriv inn Tlf. privat"
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
                  <div>
                    <p
                      className={`${
                        form.formState.errors.Hustype
                          ? "text-red"
                          : "text-black"
                      } mb-[6px] text-sm`}
                    >
                      Hustype*
                    </p>
                    <div className="flex flex-wrap gap-2 lg:gap-4 items-center">
                      {[
                        {
                          label: "Bolig",
                          icon: (
                            <House
                              className={`${
                                selectedHouseType === "bolig"
                                  ? "text-[#444CE7]"
                                  : "text-[#5D6B98]"
                              }`}
                            />
                          ),
                          value: "bolig",
                        },
                        {
                          label: "Hytte",
                          icon: (
                            <Store
                              className={`${
                                selectedHouseType === "hytte"
                                  ? "text-[#444CE7]"
                                  : "text-[#5D6B98]"
                              }`}
                            />
                          ),
                          value: "hytte",
                        },
                        {
                          label: "Prosjekt",
                          icon: (
                            <Warehouse
                              className={`${
                                selectedHouseType === "prosjekt"
                                  ? "text-[#444CE7]"
                                  : "text-[#5D6B98]"
                              }`}
                            />
                          ),
                          value: "prosjekt",
                        },
                      ].map((item: any, index: number) => (
                        <div
                          key={index}
                          onClick={() => {
                            form.setValue("Hustype", item.value);
                            form.clearErrors("Hustype");
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
                    {form.formState.errors.Hustype && (
                      <p className="text-red text-sm mt-1">
                        {form.formState.errors.Hustype.message}
                      </p>
                    )}
                  </div>
                  <div>
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
                            Finansiering*
                          </p>
                          <FormControl>
                            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                              {Finansiering.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2"
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
                  <div>
                    <FormField
                      control={form.control}
                      name={`Leveransebeskrivelse`}
                      render={({ field, fieldState }: any) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : ""
                            } mb-[6px] text-sm`}
                          >
                            Leveransebeskrivelse (Dato)*
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn Leveransebeskrivelse (Dato)"
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
                      name={`Energiberegning`}
                      render={({ field, fieldState }: any) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : ""
                            } mb-[6px] text-sm`}
                          >
                            Energiberegning dat
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn Energiberegning dat"
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
                      name={`Situasjonsplan`}
                      render={({ field, fieldState }: any) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : ""
                            } mb-[6px] text-sm`}
                          >
                            Situasjonsplan dat*
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn Situasjonsplan dat"
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
                                placeholder="Skriv inn  Tegn.nummer"
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
                              <Input
                                placeholder="Skriv inn Gjeldende 1:50 tegning datert"
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
                              <Input
                                placeholder="Skriv inn Signert 1:100 tegning datert"
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
                      name={`Referansekalkyledato`}
                      render={({ field, fieldState }: any) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : ""
                            } mb-[6px] text-sm`}
                          >
                            Referanse / kalkyledato*
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn Referanse / kalkyledato"
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
