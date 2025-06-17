// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "../../../../components/ui/form";
// import Button from "../../../../components/common/button";
// import { z } from "zod";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../../../components/ui/select";
// import { forwardRef, useImperativeHandle } from "react";

// const formSchema = z.object({
//   SeRomskjema: z.boolean().optional(),
//   mmIsolasjon: z.boolean().optional(),
//   mmMineralull: z.boolean().optional(),
//   HjørnelisterTypeHulkil: z.string().optional(),
//   VeggerMotUtvendigMur: z.string().optional(),
// });

// export const Innervegger = forwardRef(
//   (
//     {
//       handleNext,
//       handlePrevious,
//     }: { handleNext: () => void; handlePrevious: () => void },
//     ref
//   ) => {
//     const form = useForm<z.infer<typeof formSchema>>({
//       resolver: zodResolver(formSchema),
//     });
//     useImperativeHandle(ref, () => ({
//       validateForm: async () => {
//         const valid = await form.trigger();
//         return valid;
//       },
//     }));

//     const onSubmit = async (data: z.infer<typeof formSchema>) => {
//       console.log(data);
//       handleNext();
//       localStorage.setItem("currVerticalIndex", String(7));
//     };

//     const VeggerMotUtvendigMur = [
//       "Ikke relevant",
//       "Standard 5.2",
//       "Standard 5.3",
//     ];

//     return (
//       <>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
//             <div className="border border-[#B9C0D4] rounded-lg">
//               <div className="text-darkBlack font-semibold text-lg p-5 border-b border-[#B9C0D4]">
//                 Innervegger
//               </div>
//               <div className="p-4 md:p-5">
//                 <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5">
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="SeRomskjema"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="SeRomskjema"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Se romskjema
//                           </p>
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="mmIsolasjon"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="mmIsolasjon"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             70 mm isolasjon
//                           </p>
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="mmMineralull"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="mmMineralull"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             100 mm mineralull 36
//                           </p>
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="HjørnelisterTypeHulkil"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`${
//                               fieldState.error ? "text-red" : "text-black"
//                             } mb-[6px] text-sm`}
//                           >
//                             Hjørnelister type hulkil 12x12
//                           </p>
//                           <FormControl>
//                             <div className="relative">
//                               <Select
//                                 onValueChange={(value) => {
//                                   field.onChange(value);
//                                 }}
//                                 value={field.value}
//                               >
//                                 <SelectTrigger
//                                   className={`bg-white rounded-[8px] border text-black
//                               ${
//                                 fieldState?.error
//                                   ? "border-red"
//                                   : "border-gray1"
//                               } `}
//                                 >
//                                   <SelectValue placeholder="Velg" />
//                                 </SelectTrigger>
//                                 <SelectContent className="bg-white">
//                                   <SelectGroup>
//                                     <SelectItem value="Abc">Abc</SelectItem>
//                                     <SelectItem value="Xyz">Xyz</SelectItem>
//                                   </SelectGroup>
//                                 </SelectContent>
//                               </Select>
//                             </div>
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name={`VeggerMotUtvendigMur`}
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`mb-2 ${
//                               fieldState.error ? "text-red" : "text-black"
//                             } text-sm`}
//                           >
//                             Vegger mot utvendig mur
//                           </p>
//                           <FormControl>
//                             <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
//                               {VeggerMotUtvendigMur.map((option) => (
//                                 <div
//                                   key={option}
//                                   className="relative flex items-center gap-2"
//                                 >
//                                   <input
//                                     className={`bg-white rounded-[8px] border text-black
//         ${
//           fieldState?.error ? "border-red" : "border-gray1"
//         } h-4 w-4 accent-[#444CE7]`}
//                                     type="radio"
//                                     value={option}
//                                     onChange={(e) => {
//                                       form.setValue(
//                                         `VeggerMotUtvendigMur`,
//                                         e.target.value
//                                       );
//                                     }}
//                                     checked={field.value === option}
//                                   />
//                                   <p className={`text-black text-sm`}>
//                                     {option}
//                                   </p>
//                                 </div>
//                               ))}
//                             </div>
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="flex justify-end w-full gap-5 items-center sticky bottom-0 bg-white z-50 border-t border-[#B9C0D4] rounded-b-lg p-4">
//                 <div
//                   onClick={() => {
//                     form.reset();
//                     handlePrevious();
//                     localStorage.setItem("currVerticalIndex", String(5));
//                   }}
//                 >
//                   <Button
//                     text="Tilbake"
//                     className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
//                   />
//                 </div>
//                 <Button
//                   text="Neste"
//                   className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
//                   type="submit"
//                 />
//               </div>
//             </div>
//           </form>
//         </Form>
//       </>
//     );
//   }
// );

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
import { forwardRef, useImperativeHandle } from "react";

const formSchema = z.object({
  SeRomskjema: z.boolean().optional(),
  mm70standard: z.boolean().optional(),
  mm100Pristillegg: z.boolean().optional(),
  InnvendigeHjørnelister: z.boolean().optional(),
  IkkeRelevantTiltak: z.boolean().optional(),
  HjørnelisterTypeHulkil: z.string().optional(),
  VeggerMotUtvendigMur: z.string().optional(),
});

export const Innervegger = forwardRef(
  (
    {
      handleNext,
      handlePrevious,
    }: { handleNext: () => void; handlePrevious: () => void },
    ref
  ) => {
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
      console.log(data);
      handleNext();
      localStorage.setItem("currVerticalIndex", String(7));
    };

    const VeggerMotUtvendigMur = [
      "Ikke relevant",
      "Standard 5.2",
      "Standard 5.3",
    ];

    return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <div className="border border-[#B9C0D4] rounded-lg">
              <div className="text-darkBlack font-semibold text-lg p-5 border-b border-[#B9C0D4]">
                Innervegger, pkt. 5 i leveransebeskrivelse
              </div>
              <div className="p-4 md:p-5">
                <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5">
                  <div className="col-span-3 text-darkBlack font-medium text-base">
                    Alternativer for veggkonstruksjon
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="SeRomskjema"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="SeRomskjema"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Se romskjema/ overflatebevaranskjema.
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="mm70standard"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="mm70standard"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            70 mm (standard)
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="mm100Pristillegg"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="mm100Pristillegg"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            100 mm (Pristillegg)
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="InnvendigeHjørnelister"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="InnvendigeHjørnelister"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Innvendige hjørnelister type hulkil 12 x 12 mm
                            grunnet, farge iht veggplater (Standard ved liggende
                            panel) (Pristillegg)
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="my-1 border-t border-[#DCDFEA] col-span-3"></div>
                  <div className="col-span-3 text-darkBlack font-medium text-base">
                    Innvendig paneling
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="IkkeRelevantTiltak"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="IkkeRelevantTiltak"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Ikke relevant for dette tiltak
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* --- */}
                  <div>
                    <FormField
                      control={form.control}
                      name="HjørnelisterTypeHulkil"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Hjørnelister type hulkil 12x12
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
                      name={`VeggerMotUtvendigMur`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`mb-2 ${
                              fieldState.error ? "text-red" : "text-black"
                            } text-sm`}
                          >
                            Vegger mot utvendig mur
                          </p>
                          <FormControl>
                            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                              {VeggerMotUtvendigMur.map((option) => (
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
                                        `VeggerMotUtvendigMur`,
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
                    localStorage.setItem("currVerticalIndex", String(5));
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
