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
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { Input } from "../../../../components/ui/input";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { removeUndefinedOrNull } from "./Yttervegger";

const formSchema = z.object({
  SeRomskjema: z.boolean().optional(),
  mm70standard: z.boolean().optional(),
  mm100Pristillegg: z.boolean().optional(),
  InnvendigeHjørnelister: z.boolean().optional(),
  IkkeRelevantTiltak: z.boolean().optional(),

  Tekstboks: z.string().optional(),
  StandardLeveranseLeveransebeskrivelse: z.boolean().optional(),
  PakkeHusmalt: z.boolean().optional(),
  BeisemaltFargePprisøkningFarge: z.boolean().optional(),
  BeisemaltFargePprisøkningFargeText: z.string().optional(),
  Ubehandlet: z.boolean().optional(),
  prisøkning: z.string().optional(),
  Galvlut: z.boolean().optional(),
  Hvitmalt: z.boolean().optional(),
  BeisemaltFargePprisøkningFarge2: z.boolean().optional(),
  BeisemaltFargePprisøkningFarge2Text: z.string().optional(),
  Ubehandlet2: z.boolean().optional(),
  GestillVelclearSkarve: z.boolean().optional(),
  Hvitmalt3: z.boolean().optional(),
  BeisemaltFargePprisøkningFarge3: z.boolean().optional(),
  BeisemaltFargePprisøkningFarge3Text: z.string().optional(),
  Ubehandlet3: z.boolean().optional(),
  TekstboksLightingOption: z.string().optional(),
  CeilingStandardLeveranseValgteSignatur: z.boolean().optional(),
  CeilingStandardLeveranseValgteSignaturText: z.string().optional(),
  SeRomskjemaOverflateskJemaAvvik: z.boolean().optional(),
  SeRomskjemaOverflateskJemaAvvikText: z.string().optional(),
  LydhimlingIhtDetaljrNrFigB: z.boolean().optional(),
});

export const Innervegger = forwardRef(
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
          Innervegger: filteredData,
          id: id,
          updatedAt: formatDate(new Date()),
        };
        setRoomsData(mergedData);

        await updateDoc(husmodellDocRef, mergedData);
        toast.success("Lagret", {
          position: "top-right",
        });
        handleNext();
        localStorage.setItem("currVerticalIndex", String(7));
      } catch (error) {
        console.error("error:", error);
        toast.error("Something went wrong!", {
          position: "top-right",
        });
      }
    };
    useEffect(() => {
      if (roomsData && roomsData?.Innervegger) {
        Object.entries(roomsData?.Innervegger).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            form.setValue(key as any, value);
          }
        });
      }
    }, [roomsData]);
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
                  <div>
                    <FormField
                      control={form.control}
                      name="Tekstboks"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Tekstboks
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn"
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
                    Interior Lighting
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="StandardLeveranseLeveransebeskrivelse"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="StandardLeveranseLeveransebeskrivelse"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Standard leveranse ihtl leveransebeskrivelse for
                            valgte signatur
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-3 text-darkBlack font-medium text-sm">
                    Lighting Options Row 1:
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="PakkeHusmalt"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="PakkeHusmalt"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Pakke 1: Husmalt
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="BeisemaltFargePprisøkningFarge"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="BeisemaltFargePprisøkningFarge"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Beisemalt i samme farge (prisøkning) Farge
                          </p>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="BeisemaltFargePprisøkningFargeText"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn"
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
                      name="Ubehandlet"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="Ubehandlet"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Ubehandlet
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="prisøkning"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            prisøkning
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn"
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
                  <div className="col-span-3 text-darkBlack font-medium text-sm">
                    Lighting Options Row 2:
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="Galvlut"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="Galvlut"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Galvlut
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="Hvitmalt"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="Hvitmalt"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Hvitmalt
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="BeisemaltFargePprisøkningFarge2"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="BeisemaltFargePprisøkningFarge2"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Beisemalt i samme farge (prisøkning) Farge
                          </p>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="BeisemaltFargePprisøkningFarge2Text"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn"
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
                      name="Ubehandlet2"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="Ubehandlet2"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Ubehandlet
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-3 text-darkBlack font-medium text-sm">
                    Lighting Options Row 3:
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="GestillVelclearSkarve"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="GestillVelclearSkarve"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Gestill (velclear ou skarve)
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="Hvitmalt3"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="Hvitmalt3"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Hvitmalt
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="BeisemaltFargePprisøkningFarge3"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="BeisemaltFargePprisøkningFarge3"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Beisemalt i samme farge (prisøkning) Farge
                          </p>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="BeisemaltFargePprisøkningFarge3Text"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn"
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
                      name="Ubehandlet3"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="Ubehandlet3"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Ubehandlet (prisøkning)
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="TekstboksLightingOption"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Tekstboks
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn"
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
                    Ceiling
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="CeilingStandardLeveranseValgteSignatur"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="CeilingStandardLeveranseValgteSignatur"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Standard leveranse ihtl leveransebeskr for valgte
                            signatur
                          </p>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="CeilingStandardLeveranseValgteSignaturText"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn"
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
                      name="SeRomskjemaOverflateskJemaAvvik"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="SeRomskjemaOverflateskJemaAvvik"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Se romskjema/overflatesk jema for avvik fra standard
                          </p>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="SeRomskjemaOverflateskJemaAvvikText"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn"
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
                      name="LydhimlingIhtDetaljrNrFigB"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="LydhimlingIhtDetaljrNrFigB"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Lydhimling iht. detaljr nr. 231-110 fig.B
                          </p>
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
