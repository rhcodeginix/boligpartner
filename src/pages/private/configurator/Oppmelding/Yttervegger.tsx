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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

const formSchema = z.object({
  StandardLeveranse: z.boolean().optional(),
  PanelMaskinbeisetGrunnet: z.boolean().optional(),
  ResterendeKledningMaskinbeiset: z.boolean().optional(),
  Fargekode: z.string().optional(),
  mellomstrøkMaskinbeisetFabrikk: z.boolean().optional(),
  Ultimalt: z.boolean().optional(),
  UltimaltText: z.string().optional(),
  mellomstrøk: z.boolean().optional(),
  mellomstrøkText: z.string().optional(),
  YtterveggGarasjeUisolertBod: z.boolean().optional(),
  AsfaltVindtettBodGarasjeUtlekting: z.boolean().optional(),
  AsfaltVindtettBodGarasjeUtlektingText: z.string().optional(),
  KommentarTekstboks: z.string().optional(),
});

export const Yttervegger: React.FC<{
  handleNext: any;
  handlePrevious: any;
}> = ({ handleNext, handlePrevious }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
    handleNext();
    localStorage.setItem("currVerticalIndex", String(6));
  };
  const Ultimalt = form.watch("Ultimalt");
  const AsfaltVindtettBodGarasjeUtlekting = form.watch(
    "AsfaltVindtettBodGarasjeUtlekting"
  );
  const mellomstrøk = form.watch("mellomstrøk");

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
          <div className="border border-[#B9C0D4] rounded-lg">
            <div className="text-darkBlack font-semibold text-lg p-5 border-b border-[#B9C0D4]">
              Yttervegger
            </div>
            <div className="p-4 md:p-5">
              <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5">
                <div>
                  <FormField
                    control={form.control}
                    name="StandardLeveranse"
                    render={({ field }) => (
                      <FormItem>
                        <p
                          className={`text-sm flex gap-2 items-baseline ${
                            field.value ? "text-black" : "text-black"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="StandardLeveranse"
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          Standard leveranse 198+48mm
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="PanelMaskinbeisetGrunnet"
                    render={({ field }) => (
                      <FormItem>
                        <p
                          className={`text-sm flex gap-2 items-baseline ${
                            field.value ? "text-black" : "text-black"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="PanelMaskinbeisetGrunnet"
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          Panel maskinbeiset grunnet (farge hvit)
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="ResterendeKledningMaskinbeiset"
                    render={({ field }) => (
                      <FormItem>
                        <p
                          className={`text-sm flex gap-2 items-baseline ${
                            field.value ? "text-black" : "text-black"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="ResterendeKledningMaskinbeiset"
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          Resterende kledning maskinbeiset
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="Fargekode"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <p
                          className={`${
                            fieldState.error ? "text-red" : "text-black"
                          } mb-[6px] text-sm`}
                        >
                          Fargekode
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
                    name="mellomstrøkMaskinbeisetFabrikk"
                    render={({ field }) => (
                      <FormItem>
                        <p
                          className={`text-sm flex gap-2 items-baseline ${
                            field.value ? "text-black" : "text-black"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="mellomstrøkMaskinbeisetFabrikk"
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          1 mellomstrøk maskinbeiset fra fabrikk
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="Ultimalt"
                    render={({ field }) => (
                      <FormItem>
                        <p
                          className={`mb-[6px] text-sm flex gap-2 items-baseline ${
                            field.value ? "text-black" : "text-black"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="Ultimalt"
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          Ultimalt (sopp/råte + grunning)
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="UltimaltText"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                              }}
                              value={field.value}
                              disabled={Ultimalt}
                            >
                              <SelectTrigger
                                className={`bg-white rounded-[8px] border text-black
                              ${
                                fieldState?.error
                                  ? "border-red"
                                  : "border-gray1"
                              } `}
                              >
                                <SelectValue placeholder="Velg fargekode" />
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
                    name="YtterveggGarasjeUisolertBod"
                    render={({ field }) => (
                      <FormItem>
                        <p
                          className={`text-sm flex gap-2 items-baseline ${
                            field.value ? "text-black" : "text-black"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="YtterveggGarasjeUisolertBod"
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          Yttervegg i garasje og uisolert bod
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="mellomstrøk"
                    render={({ field }) => (
                      <FormItem>
                        <p
                          className={`mb-[6px] text-sm flex gap-2 items-baseline ${
                            field.value ? "text-black" : "text-black"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="mellomstrøk"
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          1 mellomstrøk
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mellomstrøkText"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                              }}
                              value={field.value}
                              disabled={mellomstrøk}
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
                    name="AsfaltVindtettBodGarasjeUtlekting"
                    render={({ field }) => (
                      <FormItem>
                        <p
                          className={`mb-[6px] text-sm flex gap-2 items-baseline ${
                            field.value ? "text-black" : "text-black"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="AsfaltVindtettBodGarasjeUtlekting"
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          Asfalt vindtett bod/garasje inkl. utlekting
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="AsfaltVindtettBodGarasjeUtlektingText"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                              }}
                              value={field.value}
                              disabled={AsfaltVindtettBodGarasjeUtlekting}
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
                    name="KommentarTekstboks"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <p
                          className={`${
                            fieldState.error ? "text-red" : "text-black"
                          } mb-[6px] text-sm`}
                        >
                          Kommentar (tekstboks)
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
};
