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

const formSchema = z.object({
  Hoveddør: z.object({
    StandardHvitmalt: z.boolean().optional(),
    VinduerNedTilGulv: z.string().optional(),
    Alt: z.string().optional(),
    MDFUtforing: z.boolean().optional(),
    HvitmaltUtvLakkertInnv: z.string().optional(),
    TilpassesVeggkledning: z.boolean().optional(),
    TilpassesVeggkledningDate: z.string().optional(),
    AndreFargekombinasjoner: z.string().optional(),
    SigaWigluvRundtVindu: z.string().optional(),
    LøseForinger: z.boolean().optional(),
    ForingerSeparatOrdre: z.string().optional(),
  }),
  Sprosser: z.object({
    mmVertikale: z.boolean().optional(),
    mmHorisontale: z.boolean().optional(),
    mmHorisontaleKlips: z.boolean().optional(),
    mmHorisontaleKlips50: z.boolean().optional(),
  }),
  VinduerIKjellerrom: z.object({
    IkkeRelevant: z.boolean().optional(),
    LikSometg: z.boolean().optional(),
    Alt: z.string().optional(),
  }),
  VinduerUninnredetLoft: z.object({
    IkkeRelevant: z.boolean().optional(),
    StandardUtenUtforing: z.boolean().optional(),
    UtføresTil: z.string().optional(),
    SigaWigluvRundtVindu: z.string().optional(),
    MDFUtforingHvitmalt: z.string().optional(),
  }),
  TakvinduVelux: z.object({
    IkkeRelevant: z.boolean().optional(),
    Type: z.string().optional(),
    Størrelse: z.string().optional(),
    Utforing: z.string().optional(),
  }),
});

export const Vinduer: React.FC<{
  handleNext: any;
  handlePrevious: any;
}> = ({ handleNext, handlePrevious }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
    handleNext();
    localStorage.setItem("currVerticalIndex", String(10));
  };

  const TilpassesVeggkledning = form.watch("Hoveddør.TilpassesVeggkledning");

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
          <div className="border border-[#B9C0D4] rounded-lg">
            <div className="text-darkBlack font-semibold text-lg p-5 border-b border-[#B9C0D4]">
              Vinduer
            </div>
            <div className="p-4 md:p-5">
              <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5">
                <div className="col-span-3 text-darkBlack font-medium text-base">
                  Hoveddør
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="Hoveddør.StandardHvitmalt"
                    render={({ field }) => (
                      <FormItem>
                        <p
                          className={`text-sm flex gap-2 items-baseline ${
                            field.value ? "text-black" : "text-black"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="Hoveddør.StandardHvitmalt"
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          Standard hvitmalt utv. og innv.
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="Hoveddør.VinduerNedTilGulv"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <p
                          className={`${
                            fieldState.error ? "text-red" : "text-black"
                          } mb-[6px] text-sm`}
                        >
                          Vinduer ned til gulv
                        </p>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Velg"
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
                    name="Hoveddør.Alt"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <p
                          className={`${
                            fieldState.error ? "text-red" : "text-black"
                          } mb-[6px] text-sm`}
                        >
                          Alt
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
                    name="Hoveddør.MDFUtforing"
                    render={({ field }) => (
                      <FormItem>
                        <p
                          className={`text-sm flex gap-2 items-baseline ${
                            field.value ? "text-black" : "text-black"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="MDFUtforing"
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          MDF utforing
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="Hoveddør.HvitmaltUtvLakkertInnv"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <p
                          className={`${
                            fieldState.error ? "text-red" : "text-black"
                          } mb-[6px] text-sm`}
                        >
                          Hvitmalt utv./lakkert innv.
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
                                  <SelectItem value="Abc">Abc</SelectItem>
                                  <SelectItem value="Xyz">Xyz</SelectItem>
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
                    name="Hoveddør.AndreFargekombinasjoner"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <p
                          className={`${
                            fieldState.error ? "text-red" : "text-black"
                          } mb-[6px] text-sm`}
                        >
                          Andre fargekombinasjoner
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
                                  <SelectItem value="Abc">Abc</SelectItem>
                                  <SelectItem value="Xyz">Xyz</SelectItem>
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
                    name="Hoveddør.TilpassesVeggkledning"
                    render={({ field }) => (
                      <FormItem>
                        <p
                          className={`mb-[6px] text-sm flex gap-2 items-baseline ${
                            field.value ? "text-black" : "text-black"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="Hoveddør.TilpassesVeggkledning"
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          Tilpasses veggkledning (romskjema)
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="Hoveddør.TilpassesVeggkledningDate"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Skriv inn Skriv detaljnummer"
                              {...field}
                              disable={TilpassesVeggkledning}
                              className={`bg-white rounded-[8px] border text-black ${
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
                    name="Hoveddør.LøseForinger"
                    render={({ field }) => (
                      <FormItem>
                        <p
                          className={`text-sm flex gap-2 items-baseline ${
                            field.value ? "text-black" : "text-black"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="Hoveddør.LøseForinger"
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          Løse foringer
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name={`Hoveddør.ForingerSeparatOrdre`}
                    render={({ field, fieldState }: any) => (
                      <FormItem>
                        <p
                          className={`${
                            fieldState.error ? "text-red" : ""
                          } mb-[6px] text-sm`}
                        >
                          Foringer separat ordre
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
                    name="Hoveddør.SigaWigluvRundtVindu"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <p
                          className={`${
                            fieldState.error ? "text-red" : "text-black"
                          } mb-[6px] text-sm`}
                        >
                          Siga Wigluv rundt vindu
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
                                  <SelectItem value="Abc">Abc</SelectItem>
                                  <SelectItem value="Xyz">Xyz</SelectItem>
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
                <div className="my-1 border-t border-[#DCDFEA] col-span-3"></div>
                <div className="col-span-3 text-darkBlack font-medium text-base">
                  Sprosser
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="Sprosser.mmVertikale"
                    render={({ field }) => (
                      <FormItem>
                        <p
                          className={`text-sm flex gap-2 items-baseline ${
                            field.value ? "text-black" : "text-black"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="Sprosser.mmVertikale"
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          65 mm vertikale
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="Sprosser.mmHorisontale"
                    render={({ field }) => (
                      <FormItem>
                        <p
                          className={`text-sm flex gap-2 items-baseline ${
                            field.value ? "text-black" : "text-black"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="Sprosser.mmHorisontale"
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          65 mm horisontale
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="Sprosser.mmHorisontaleKlips"
                    render={({ field }) => (
                      <FormItem>
                        <p
                          className={`text-sm flex gap-2 items-baseline ${
                            field.value ? "text-black" : "text-black"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="Sprosser.mmHorisontaleKlips"
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          25 mm horisontale klips
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="Sprosser.mmHorisontaleKlips50"
                    render={({ field }) => (
                      <FormItem>
                        <p
                          className={`text-sm flex gap-2 items-baseline ${
                            field.value ? "text-black" : "text-black"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="Sprosser.mmHorisontaleKlips50"
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          50 mm horisontale klips
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="my-1 border-t border-[#DCDFEA] col-span-3"></div>
                <div className="col-span-3 text-darkBlack font-medium text-base">
                  Vinduer i kjellerrom
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="VinduerIKjellerrom.IkkeRelevant"
                    render={({ field }) => (
                      <FormItem>
                        <p
                          className={`text-sm flex gap-2 items-baseline ${
                            field.value ? "text-black" : "text-black"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="VinduerIKjellerrom.IkkeRelevant"
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          Ikke relevant
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="VinduerIKjellerrom.LikSometg"
                    render={({ field }) => (
                      <FormItem>
                        <p
                          className={`text-sm flex gap-2 items-baseline ${
                            field.value ? "text-black" : "text-black"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="VinduerIKjellerrom.LikSometg"
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          Lik som 1. etg.
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="VinduerIKjellerrom.Alt"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <p
                          className={`${
                            fieldState.error ? "text-red" : "text-black"
                          } mb-[6px] text-sm`}
                        >
                          Alt
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
                <div className="my-1 border-t border-[#DCDFEA] col-span-3"></div>
                <div className="col-span-3 text-darkBlack font-medium text-base">
                  Vinduer uinnredet loft
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="VinduerUninnredetLoft.IkkeRelevant"
                    render={({ field }) => (
                      <FormItem>
                        <p
                          className={`text-sm flex gap-2 items-baseline ${
                            field.value ? "text-black" : "text-black"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="VinduerUninnredetLoft.IkkeRelevant"
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          Ikke relevant
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="VinduerUninnredetLoft.StandardUtenUtforing"
                    render={({ field }) => (
                      <FormItem>
                        <p
                          className={`text-sm flex gap-2 items-baseline ${
                            field.value ? "text-black" : "text-black"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="VinduerUninnredetLoft.StandardUtenUtforing"
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          Standard uten utforing
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="VinduerUninnredetLoft.UtføresTil"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <p
                          className={`${
                            fieldState.error ? "text-red" : "text-black"
                          } mb-[6px] text-sm`}
                        >
                          Utføres til
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
                    name="VinduerUninnredetLoft.SigaWigluvRundtVindu"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <p
                          className={`${
                            fieldState.error ? "text-red" : "text-black"
                          } mb-[6px] text-sm`}
                        >
                          Siga Wigluv rundt vindu
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
                                  <SelectItem value="Abc">Abc</SelectItem>
                                  <SelectItem value="Xyz">Xyz</SelectItem>
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
                    name="VinduerUninnredetLoft.MDFUtforingHvitmalt"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <p
                          className={`${
                            fieldState.error ? "text-red" : "text-black"
                          } mb-[6px] text-sm`}
                        >
                          MDF utforing hvitmalt
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
                                  <SelectItem value="Abc">Abc</SelectItem>
                                  <SelectItem value="Xyz">Xyz</SelectItem>
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
                <div className="my-1 border-t border-[#DCDFEA] col-span-3"></div>
                <div className="col-span-3 text-darkBlack font-medium text-base">
                  Takvindu Velux
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="TakvinduVelux.IkkeRelevant"
                    render={({ field }) => (
                      <FormItem>
                        <p
                          className={`text-sm flex gap-2 items-baseline ${
                            field.value ? "text-black" : "text-black"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="TakvinduVelux.IkkeRelevant"
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          Ikke relevant
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="TakvinduVelux.Type"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <p
                          className={`${
                            fieldState.error ? "text-red" : "text-black"
                          } mb-[6px] text-sm`}
                        >
                          Type
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
                    name="TakvinduVelux.Størrelse"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <p
                          className={`${
                            fieldState.error ? "text-red" : "text-black"
                          } mb-[6px] text-sm`}
                        >
                          Størrelse
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
                    name="TakvinduVelux.Utforing"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <p
                          className={`${
                            fieldState.error ? "text-red" : "text-black"
                          } mb-[6px] text-sm`}
                        >
                          Utforing
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
};
