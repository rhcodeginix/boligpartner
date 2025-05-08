import { Trash2, UserRoundCheck } from "lucide-react";
// import { Spinner } from "../../../components/Spinner";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../components/ui/form";
import Button from "../../../components/common/button";
import { phoneNumberValidations } from "../../../lib/utils";
import { parsePhoneNumber } from "react-phone-number-input";
import { InputMobile } from "../../../components/ui/inputMobile";
import { Input } from "../../../components/ui/input";
import DatePickerComponent from "../../../components/ui/datepicker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

const formSchema = z.object({
  Kundeinformasjon: z
    .array(
      z.object({
        mobileNummer: z.string().refine(
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
        f_name: z.string().min(1, {
          message: "Fornavn må bestå av minst 2 tegn.",
        }),
        l_name: z.string().min(1, {
          message: "Etternavn må bestå av minst 2 tegn.",
        }),
        Adresse: z.string().min(1, {
          message: "Adresse må bestå av minst 2 tegn.",
        }),
        EPost: z
          .string()
          .email({ message: "Vennligst skriv inn en gyldig e-postadresse." })
          .min(1, { message: "E-posten må være på minst 2 tegn." }),
        dato: z.union([z.date(), z.null()]).refine((val) => val !== null, {
          message: "Dato er påkrevd.",
        }),
        Personnummer: z.string().min(1, {
          message: "Personnummer må bestå av minst 2 tegn.",
        }),
        Kundetype: z.string().min(1, { message: "Kundetype må spesifiseres." }),
      })
    )
    .min(1, "Minst ett produkt er påkrevd."),
});

export const Kunden: React.FC<{
  setActiveTab: any;
}> = ({ setActiveTab }) => {
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Kundeinformasjon: [
        {
          mobileNummer: "",
          f_name: "",
          l_name: "",
          Adresse: "",
          EPost: "",
          dato: null,
          Personnummer: "",
          Kundetype: "",
        },
      ],
    },
  });
  //   const [loading, setLoading] = useState(true);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "Kundeinformasjon",
  });

  const addProduct = () => {
    append({
      mobileNummer: "",
      f_name: "",
      l_name: "",
      Adresse: "",
      EPost: "",
      dato: null,
      Personnummer: "",
      Kundetype: "",
    } as any);
  };
  const removeProduct = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
    setActiveTab(1);

    // try {

    // } catch (error) {
    //   console.error("Firestore operation failed:", error);
    //   toast.error("Something went wrong. Please try again.", {
    //     position: "top-right",
    //   });
    // }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
          <div
            className="mx-10 rounded-lg"
            style={{
              boxShadow: "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
            }}
          >
            <div className="py-4 px-5 flex items-center gap-3 border-b border-[#E8E8E8]">
              <UserRoundCheck />
              <span className="text-lg font-semibold">
                Registrering av kunde
              </span>
            </div>
            <div className="bg-[#F6F4F2] py-3 px-5 text-sm font-semibold">
              Informasjon om oppdragsgiver
            </div>
            <div className="p-6 mb-6 z-40 relative">
              <div className="flex flex-col gap-8">
                {fields.map((product, index) => {
                  return (
                    <div key={product.id}>
                      <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3 justify-between">
                          {index === 0 ? (
                            <div>
                              <h3 className="text-base font-semibold mb-1.5">
                                Kundeinformasjon ({index + 1})
                              </h3>
                              <p className="text-sm text-[#4D4D4D]">
                                Oppdragsnummeret blir automatisk tildelt i Vitec
                                ved signering av oppdragsavtalen.
                              </p>
                            </div>
                          ) : (
                            <div>
                              <h3 className="text-base font-semibold mb-1.5">
                                Kundeinformasjon ({index + 1})
                              </h3>
                              <p className="text-sm text-[#4D4D4D]">
                                Kunde {index + 1} skal være medlånstaker .
                              </p>
                            </div>
                          )}
                          {index !== 0 && (
                            <div
                              className={`w-max whitespace-nowrap flex items-center gap-1 font-medium text-[#D4121E] cursor-pointer`}
                              onClick={() => {
                                removeProduct(index);
                              }}
                            >
                              <Trash2 />
                            </div>
                          )}
                        </div>
                        <div>
                          <FormField
                            control={form.control}
                            name={`Kundeinformasjon.${index}.mobileNummer`}
                            render={({ field, fieldState }) => (
                              <FormItem>
                                <p
                                  className={`${
                                    fieldState.error ? "text-red" : ""
                                  } mb-[6px] text-sm`}
                                >
                                  Mobilnummer
                                </p>
                                <FormControl>
                                  <div className="relative flex gap-1.5 items-center">
                                    <InputMobile
                                      placeholder="Skriv inn Telefon"
                                      {...field}
                                      className={`bg-white w-max rounded-[8px] border text-black
                              ${
                                fieldState?.error
                                  ? "border-red"
                                  : "border-gray1"
                              } `}
                                      type="tel"
                                    />
                                    <div className="border-primary border-2 rounded-lg py-2 px-3 text-primary font-semibold cursor-pointer h-12 flex items-center justify-center">
                                      Søk på telefonummer
                                    </div>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <FormField
                              control={form.control}
                              name={`Kundeinformasjon.${index}.f_name`}
                              render={({ field, fieldState }) => (
                                <FormItem>
                                  <p
                                    className={`${
                                      fieldState.error ? "text-red" : ""
                                    } mb-[6px] text-sm`}
                                  >
                                    Fornavn
                                  </p>
                                  <FormControl>
                                    <div className="relative">
                                      <Input
                                        placeholder="Skriv inn Fornavn"
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
                              name={`Kundeinformasjon.${index}.l_name`}
                              render={({ field, fieldState }) => (
                                <FormItem>
                                  <p
                                    className={`${
                                      fieldState.error ? "text-red" : ""
                                    } mb-[6px] text-sm`}
                                  >
                                    Etternavn
                                  </p>
                                  <FormControl>
                                    <div className="relative">
                                      <Input
                                        placeholder="Skriv inn Etternavn"
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
                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <FormField
                              control={form.control}
                              name={`Kundeinformasjon.${index}.Adresse`}
                              render={({ field, fieldState }) => (
                                <FormItem>
                                  <p
                                    className={`${
                                      fieldState.error ? "text-red" : ""
                                    } mb-[6px] text-sm`}
                                  >
                                    Adresse
                                  </p>
                                  <FormControl>
                                    <div className="relative">
                                      <Input
                                        placeholder="Skriv inn Adresse"
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
                              name={`Kundeinformasjon.${index}.mobileNummer`}
                              render={({ field, fieldState }) => (
                                <FormItem>
                                  <p
                                    className={`${
                                      fieldState.error ? "text-red" : ""
                                    } mb-[6px] text-sm`}
                                  >
                                    Mobilnummer
                                  </p>
                                  <FormControl>
                                    <div className="relative flex gap-1.5 items-center">
                                      <InputMobile
                                        placeholder="Skriv inn Telefon"
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
                              name={`Kundeinformasjon.${index}.EPost`}
                              render={({ field, fieldState }) => (
                                <FormItem>
                                  <p
                                    className={`${
                                      fieldState.error ? "text-red" : ""
                                    } mb-[6px] text-sm`}
                                  >
                                    E-post
                                  </p>
                                  <FormControl>
                                    <div className="relative">
                                      <Input
                                        placeholder="Skriv inn E-post"
                                        {...field}
                                        className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                                        type="email"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <FormField
                              control={form.control}
                              name={`Kundeinformasjon.${index}.dato`}
                              render={({ field, fieldState }) => (
                                <FormItem>
                                  <p
                                    className={`${
                                      fieldState.error ? "text-red" : ""
                                    } mb-[6px] text-sm`}
                                  >
                                    Fødselsdato
                                  </p>
                                  <FormControl>
                                    <div className="w-full">
                                      <DatePickerComponent
                                        selectedDate={field.value ?? null}
                                        onDateChange={field.onChange}
                                        dateFormat="MM/dd/yyyy"
                                        placeholderText="Select Fødselsdato"
                                        className={`border h-11 ${
                                          fieldState.error
                                            ? "border-red"
                                            : "border-gray1"
                                        } rounded-[8px] flex gap-2 items-center py-[10px] px-4 cursor-pointer shadow-shadow1 w-full`}
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
                              name={`Kundeinformasjon.${index}.Personnummer`}
                              render={({ field, fieldState }) => (
                                <FormItem>
                                  <p
                                    className={`${
                                      fieldState.error ? "text-red" : ""
                                    } mb-[6px] text-sm`}
                                  >
                                    Personnummer
                                  </p>
                                  <FormControl>
                                    <div className="relative">
                                      <Input
                                        placeholder="Skriv inn Personnummer"
                                        {...field}
                                        className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                                        type="number"
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
                              name={`Kundeinformasjon.${index}.Kundetype`}
                              render={({ field, fieldState }) => (
                                <FormItem>
                                  <p
                                    className={`${
                                      fieldState.error
                                        ? "text-red"
                                        : "text-black"
                                    } mb-[6px] text-sm font-medium`}
                                  >
                                    Kundetype
                                  </p>
                                  <FormControl>
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
                                        <SelectValue placeholder="Enter Kundetype" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-white">
                                        <SelectGroup>
                                          <SelectItem value="Privatperson">
                                            Privatperson
                                          </SelectItem>
                                          <SelectItem value="Offentlig person">
                                            Offentlig person
                                          </SelectItem>
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {index !== fields.length - 1 && (
                          <div className={`border-t border-gray2`}></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mb-8 mx-10">
            <div
              className="text-white rounded-lg w-max bg-purple font-medium justify-center text-base flex items-center gap-1 cursor-pointer h-full px-4 py-[10px]"
              onClick={addProduct}
            >
              + Legg til ny byggekostnad
            </div>
          </div>
          <div className="flex justify-end w-full gap-5 items-center sticky bottom-0 bg-white z-50 border-t border-gray2 p-4 left-0">
            <div className="w-1/2 sm:w-auto">
              <Button
                text="Avbryt"
                className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
              />
            </div>
            <div id="submit">
              <Button
                text="Lagre"
                className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                type="submit"
              />
            </div>
          </div>
          {/* {loading && <Spinner />} */}
        </form>
      </Form>
    </>
  );
};
