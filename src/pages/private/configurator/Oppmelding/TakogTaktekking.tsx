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
// import { Input } from "../../../../components/ui/input";
// import { forwardRef, useImperativeHandle } from "react";

// const formSchema = z.object({
//   StandardUndertak: z.boolean().optional(),
//   TakTaktekkingIhtPkt: z.boolean().optional(),
//   PappTekkeArbeidLeveresLokalt: z.boolean().optional(),
//   UndertakDpapp: z.boolean().optional(),
//   Kommentar: z.string().optional(),
//   TaksteinType: z.string().optional(),
//   TaksteinStruktur: z.array(z.string()).optional(),
//   TaksteinFarge: z.string().optional(),
//   TaksteinKode: z.string().optional(),
//   SnøfangerKrokerGrad: z.string().optional(),
//   HeisesPåTak: z.boolean().optional(),
//   Avløpslufteribetongdobbkr: z.string().optional(),
//   SnøfangereMeter: z.string().optional(),
//   SnøfangereFarge: z.string().optional(),
//   GradrennerBeslagFarge: z.string().optional(),
//   GradrennerBeslagFargeAlt: z.string().optional(),
//   Fuglelist: z.boolean().optional(),
//   FuglelistText: z.string().optional(),
//   Feieplatå: z.boolean().optional(),
//   FeieplatåText: z.string().optional(),
//   MøneValmtettingsrull: z.boolean().optional(),
//   MøneValmtettingsrullText: z.string().optional(),
//   Takbeleggsløsning: z.boolean().optional(),
//   AltFlattTak: z.string().optional(),
//   InnvendigNedløp: z.string().optional(),
//   AnsvarligNedløp: z.string().optional(),
// });

// export const TakogTaktekking = forwardRef(
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
//       localStorage.setItem("currVerticalIndex", String(8));
//     };

//     const Avløpslufteribetongdobbkr = ["Ja", "Nei"];
//     const GradrennerBeslagFarge = ["Silver", "Alt"];
//     const TaksteinStruktur = ["Struktur", "Glatt 5.2"];
//     const MøneValmtettingsrull = form.watch("MøneValmtettingsrull");
//     const Fuglelist = form.watch("Fuglelist");
//     const Feieplatå = form.watch("Feieplatå");

//     return (
//       <>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
//             <div className="border border-[#B9C0D4] rounded-lg">
//               <div className="text-darkBlack font-semibold text-lg p-5 border-b border-[#B9C0D4]">
//                 Tak og taktekking
//               </div>
//               <div className="p-4 md:p-5">
//                 <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5">
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="StandardUndertak"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="StandardUndertak"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Standard undertak
//                           </p>
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="TakTaktekkingIhtPkt"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="TakTaktekkingIhtPkt"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Tak/taktekking iht. pkt. 6.1
//                           </p>
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="PappTekkeArbeidLeveresLokalt"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="PappTekkeArbeidLeveresLokalt"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Papp og tekke arbeid leveres lokalt
//                           </p>
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="UndertakDpapp"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="UndertakDpapp"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Undertak med D-papp
//                           </p>
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="Kommentar"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`${
//                               fieldState.error ? "text-red" : "text-black"
//                             } mb-[6px] text-sm`}
//                           >
//                             Kommentar
//                           </p>
//                           <FormControl>
//                             <div className="relative">
//                               <Input
//                                 placeholder="Skriv inn Kommentar"
//                                 {...field}
//                                 className={`bg-white rounded-[8px] border text-black
//                                           ${
//                                             fieldState?.error
//                                               ? "border-red"
//                                               : "border-gray1"
//                                           } `}
//                                 type="text"
//                               />
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
//                       name="TaksteinType"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`${
//                               fieldState.error ? "text-red" : "text-black"
//                             } mb-[6px] text-sm`}
//                           >
//                             Takstein type
//                           </p>
//                           <FormControl>
//                             <div className="relative">
//                               <Input
//                                 placeholder="Skriv type takstein"
//                                 {...field}
//                                 className={`bg-white rounded-[8px] border text-black
//                                           ${
//                                             fieldState?.error
//                                               ? "border-red"
//                                               : "border-gray1"
//                                           } `}
//                                 type="text"
//                               />
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
//                       name={`TaksteinStruktur`}
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
//                             <div className="flex items-center flex-wrap gap-3 lg:gap-5">
//                               {TaksteinStruktur.map((option) => (
//                                 <div
//                                   key={option}
//                                   className="relative flex items-center gap-2"
//                                 >
//                                   <input
//                                     className={`bg-white rounded-[8px] border text-black
//         ${
//           fieldState?.error ? "border-red" : "border-gray1"
//         } h-4 w-4 accent-[#444CE7]`}
//                                     type="checkbox"
//                                     value={option}
//                                     checked={field.value?.includes(option)}
//                                     onChange={(e) => {
//                                       const checked = e.target.checked;
//                                       const currentValues = field.value || [];

//                                       if (checked) {
//                                         form.setValue("TaksteinStruktur", [
//                                           ...currentValues,
//                                           option,
//                                         ]);
//                                       } else {
//                                         form.setValue(
//                                           "TaksteinStruktur",
//                                           currentValues.filter(
//                                             (val) => val !== option
//                                           )
//                                         );
//                                       }
//                                     }}
//                                   />
//                                   <p
//                                     className={`text-gray text-sm font-medium`}
//                                   >
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
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="TaksteinFarge"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`${
//                               fieldState.error ? "text-red" : "text-black"
//                             } mb-[6px] text-sm`}
//                           >
//                             Takstein farge
//                           </p>
//                           <FormControl>
//                             <div className="relative">
//                               <Input
//                                 placeholder="Skriv her"
//                                 {...field}
//                                 className={`bg-white rounded-[8px] border text-black
//                                           ${
//                                             fieldState?.error
//                                               ? "border-red"
//                                               : "border-gray1"
//                                           } `}
//                                 type="text"
//                               />
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
//                       name="TaksteinKode"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`${
//                               fieldState.error ? "text-red" : "text-black"
//                             } mb-[6px] text-sm`}
//                           >
//                             Takstein kode
//                           </p>
//                           <FormControl>
//                             <div className="relative">
//                               <Input
//                                 placeholder="Skriv her"
//                                 {...field}
//                                 className={`bg-white rounded-[8px] border text-black
//                                           ${
//                                             fieldState?.error
//                                               ? "border-red"
//                                               : "border-gray1"
//                                           } `}
//                                 type="text"
//                               />
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
//                       name="HeisesPåTak"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="HeisesPåTak"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Heises på tak
//                           </p>
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name={`Avløpslufteribetongdobbkr`}
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`mb-2 ${
//                               fieldState.error ? "text-red" : "text-black"
//                             } text-sm`}
//                           >
//                             Avløpslufter i betong, dobb.kr.
//                           </p>
//                           <FormControl>
//                             <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
//                               {Avløpslufteribetongdobbkr.map((option) => (
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
//                                         `Avløpslufteribetongdobbkr`,
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
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="SnøfangereMeter"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`${
//                               fieldState.error ? "text-red" : "text-black"
//                             } mb-[6px] text-sm`}
//                           >
//                             Snøfangere meter
//                           </p>
//                           <FormControl>
//                             <div className="relative">
//                               <Input
//                                 placeholder="Antall meter"
//                                 {...field}
//                                 className={`bg-white rounded-[8px] border text-black
//                                           ${
//                                             fieldState?.error
//                                               ? "border-red"
//                                               : "border-gray1"
//                                           } `}
//                                 type="text"
//                               />
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
//                       name="SnøfangereFarge"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`${
//                               fieldState.error ? "text-red" : "text-black"
//                             } mb-[6px] text-sm`}
//                           >
//                             Snøfangere farge
//                           </p>
//                           <FormControl>
//                             <div className="relative">
//                               <Input
//                                 placeholder="Skriv fargekode"
//                                 {...field}
//                                 className={`bg-white rounded-[8px] border text-black
//                                           ${
//                                             fieldState?.error
//                                               ? "border-red"
//                                               : "border-gray1"
//                                           } `}
//                                 type="text"
//                               />
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
//                       name={`GradrennerBeslagFarge`}
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`mb-2 ${
//                               fieldState.error ? "text-red" : "text-black"
//                             } text-sm`}
//                           >
//                             Gradrenner/beslag farge
//                           </p>
//                           <FormControl>
//                             <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
//                               {GradrennerBeslagFarge.map((option) => (
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
//                                         `GradrennerBeslagFarge`,
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
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="GradrennerBeslagFargeAlt"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`${
//                               fieldState.error ? "text-red" : "text-black"
//                             } mb-[6px] text-sm`}
//                           >
//                             Gradrenner/beslag farge (Alt)
//                           </p>
//                           <FormControl>
//                             <div className="relative">
//                               <Input
//                                 placeholder="Skriv her"
//                                 {...field}
//                                 className={`bg-white rounded-[8px] border text-black
//                                           ${
//                                             fieldState?.error
//                                               ? "border-red"
//                                               : "border-gray1"
//                                           } `}
//                                 type="text"
//                               />
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
//                       name="SnøfangerKrokerGrad"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`${
//                               fieldState.error ? "text-red" : "text-black"
//                             } mb-[6px] text-sm`}
//                           >
//                             Snøfanger kroker i grad
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
//                       name="Fuglelist"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`mb-[6px] text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="Fuglelist"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Fuglelist
//                           </p>
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="FuglelistText"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <FormControl>
//                             <div className="relative">
//                               <Select
//                                 onValueChange={(value) => {
//                                   field.onChange(value);
//                                 }}
//                                 value={field.value}
//                                 disabled={Fuglelist}
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
//                       name="Feieplatå"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`mb-[6px] text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="Feieplatå"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Feieplatå
//                           </p>
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="FeieplatåText"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <FormControl>
//                             <div className="relative">
//                               <Select
//                                 onValueChange={(value) => {
//                                   field.onChange(value);
//                                 }}
//                                 value={field.value}
//                                 disabled={Feieplatå}
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
//                       name="MøneValmtettingsrull"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`mb-[6px] text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="MøneValmtettingsrull"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Møne og valmtettingsrull
//                           </p>
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="MøneValmtettingsrullText"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <FormControl>
//                             <div className="relative">
//                               <Select
//                                 onValueChange={(value) => {
//                                   field.onChange(value);
//                                 }}
//                                 value={field.value}
//                                 disabled={MøneValmtettingsrull}
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
//                       name="Takbeleggsløsning"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="Takbeleggsløsning"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Standard leveranse med takbelegg inkl. sluk og med
//                             Silver parapetbeslag
//                           </p>
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="AltFlattTak"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`${
//                               fieldState.error ? "text-red" : "text-black"
//                             } mb-[6px] text-sm`}
//                           >
//                             Alt. flatt tak
//                           </p>
//                           <FormControl>
//                             <div className="relative">
//                               <Input
//                                 placeholder="Velg"
//                                 {...field}
//                                 className={`bg-white rounded-[8px] border text-black
//                                           ${
//                                             fieldState?.error
//                                               ? "border-red"
//                                               : "border-gray1"
//                                           } `}
//                                 type="text"
//                               />
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
//                       name="InnvendigNedløp"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`${
//                               fieldState.error ? "text-red" : "text-black"
//                             } mb-[6px] text-sm`}
//                           >
//                             Innvendig nedløp
//                           </p>
//                           <FormControl>
//                             <div className="relative">
//                               <Input
//                                 placeholder="Velg"
//                                 {...field}
//                                 className={`bg-white rounded-[8px] border text-black
//                                           ${
//                                             fieldState?.error
//                                               ? "border-red"
//                                               : "border-gray1"
//                                           } `}
//                                 type="text"
//                               />
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
//                       name="AnsvarligNedløp"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`${
//                               fieldState.error ? "text-red" : "text-black"
//                             } mb-[6px] text-sm`}
//                           >
//                             Ansvarlig for nedløp
//                           </p>
//                           <FormControl>
//                             <div className="relative">
//                               <Input
//                                 placeholder="Velg"
//                                 {...field}
//                                 className={`bg-white rounded-[8px] border text-black
//                                           ${
//                                             fieldState?.error
//                                               ? "border-red"
//                                               : "border-gray1"
//                                           } `}
//                                 type="text"
//                               />
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
//                     localStorage.setItem("currVerticalIndex", String(6));
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
import { Input } from "../../../../components/ui/input";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { removeUndefinedOrNull } from "./Yttervegger";

const formSchema = z.object({
  StandardUndertak: z.boolean().optional(),
  PappskingelTypeSortSkiferKarakter: z.boolean().optional(),
  PappTekkingTypeModerne: z.boolean().optional(),
  UndertakDpapp: z.boolean().optional(),
  Tekstboks: z.string().optional(),
  TaksteinType: z.boolean().optional(),
  TaksteinFarge: z.string().optional(),
  TaksteinKode: z.string().optional(),
  HeisesPåTak: z.boolean().optional(),
  Avløpslufteribetongdobbkr: z.boolean().optional(),
  SnøfangereMeter: z.string().optional(),
  SnøfangereFarge: z.string().optional(),
  StandardTakbeleggsløsning: z.boolean().optional(),
  UndertakDpappText: z.string().optional(),
  Hytte: z.array(z.string()).optional(),
  Hus: z.array(z.string()).optional(),
  Struktur: z.boolean().optional(),
  GlattPristilleggAreal: z.boolean().optional(),
  GlattPristilleggArealText: z.string().optional(),
  Sort: z.boolean().optional(),
  Rød: z.boolean().optional(),
  SnøfangereKroker: z.boolean().optional(),
  FeieplassPristillegg: z.boolean().optional(),
  GradrennerBeslagFargeAlt: z.string().optional(),
});

export const TakogTaktekking = forwardRef(
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
          TakogTaktekkingTakogTaktekking: filteredData,
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

    const Hytte = [
      "Karakter skingel",
      "Tar takstein",
      "V-lytte",
      "Moderne papp",
    ];

    const Hus = [
      "Moderne hus med lav vinkel: Takpapp",
      "Funkis: Puden",
      "Alle andre hus: takstein",
    ];
    useEffect(() => {
      if (roomsData && roomsData?.TakogTaktekkingTakogTaktekking) {
        Object.entries(roomsData?.TakogTaktekkingTakogTaktekking).forEach(
          ([key, value]) => {
            if (value !== undefined && value !== null) {
              form.setValue(key as any, value);
            }
          }
        );
      }
    }, [roomsData, Hytte, Hus]);
    return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <div className="border border-[#B9C0D4] rounded-lg">
              <div className="text-darkBlack font-semibold text-lg p-5 border-b border-[#B9C0D4]">
                Tak/taktekking, pkt. 6 i leveransebeskrivelse
              </div>
              <div className="p-4 md:p-5">
                <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5">
                  <div className="col-span-3 text-darkBlack font-medium text-base">
                    Standardalternativer
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="StandardUndertak"
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
                              id="StandardUndertak"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Standard undertak
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="UndertakDpapp"
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
                              id="UndertakDpapp"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Undertak med D-papp
                          </p>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="UndertakDpappText"
                      render={({ field, fieldState }) => (
                        <FormItem>
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
                                placeholder="Skriv inn Tekstboks"
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
                    Informasjonsseksjoner
                  </div>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name={`Hytte`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`mb-2 ${
                              fieldState.error ? "text-red" : "text-black"
                            } text-sm`}
                          >
                            Hytte
                          </p>
                          <FormControl>
                            <div className="flex items-center flex-wrap gap-3 lg:gap-5">
                              {Hytte.map((option) => (
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

                                    form.setValue("Hytte", newValues);
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
                                        form.setValue("Hytte", [
                                          ...currentValues,
                                          option,
                                        ]);
                                      } else {
                                        form.setValue(
                                          "Hytte",
                                          currentValues.filter(
                                            (val) => val !== option
                                          )
                                        );
                                      }
                                    }}
                                  />
                                  <p
                                    className={`text-gray text-sm font-medium`}
                                  >
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
                      name={`Hus`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`mb-2 ${
                              fieldState.error ? "text-red" : "text-black"
                            } text-sm`}
                          >
                            Hus
                          </p>
                          <FormControl>
                            <div className="flex items-center flex-wrap gap-3 lg:gap-5">
                              {Hus.map((option) => (
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

                                    form.setValue("Hus", newValues);
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
                                        form.setValue("Hus", [
                                          ...currentValues,
                                          option,
                                        ]);
                                      } else {
                                        form.setValue(
                                          "Hus",
                                          currentValues.filter(
                                            (val) => val !== option
                                          )
                                        );
                                      }
                                    }}
                                  />
                                  <p
                                    className={`text-gray text-sm font-medium`}
                                  >
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
                  <div className="my-1 border-t border-[#DCDFEA] col-span-3"></div>
                  <div className="col-span-3 text-darkBlack font-medium text-base">
                    Roofing Type Selection
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="PappskingelTypeSortSkiferKarakter"
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
                              id="PappskingelTypeSortSkiferKarakter"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Pappskingel type sort skifer (Karakter)
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="PappTekkingTypeModerne"
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
                              id="PappTekkingTypeModerne"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Papptekking type med av Moderne, Prosjekt, V og
                            Moderne hytter
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="StandardTakbeleggsløsning"
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
                              id="StandardTakbeleggsløsning"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Standard leveranse med takbelegg inkl. sluk og med
                            Silver parapetbeslag
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="my-1 border-t border-[#DCDFEA] col-span-3"></div>
                  <div className="col-span-3 text-darkBlack font-medium text-base">
                    Takstein (Roof Tiles)
                  </div>
                  <div className="col-span-3 text-darkBlack font-medium text-sm">
                    Roof Tile Type Selection:
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="TaksteinType"
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
                              id="TaksteinType"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Takstein type
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="Struktur"
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
                              id="Struktur"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Struktur (standard)
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="GlattPristilleggAreal"
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
                              id="GlattPristilleggAreal"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Glatt (pristillegg) Areal:
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="GlattPristilleggArealText"
                      render={({ field, fieldState }) => (
                        <FormItem>
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
                  <div className="col-span-3 text-darkBlack font-medium text-sm">
                    Roof Tile Color:
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
                                placeholder="Skriv inn Takstein farge"
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
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Heises på tak
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="Avløpslufteribetongdobbkr"
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
                              id="Avløpslufteribetongdobbkr"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Avløpspllass i betong, dobh kt (pristillegg)
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="my-1 border-t border-[#DCDFEA] col-span-3"></div>
                  <div className="col-span-3 text-darkBlack font-medium text-base">
                    Snøfangere (Snow Guards)
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
                      name="SnøfangereMeter"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Snøfangere meter
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Antall meter"
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
                    Edge Treatment:
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="GradrennerBeslagFargeAlt"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Gratbæmer/beslag farge
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
                      name="Sort"
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
                              id="Sort"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Sort
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="Rød"
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
                              id="Rød"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Rød
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-3 text-darkBlack font-medium text-sm">
                    Endelige alternativer:
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="SnøfangereKroker"
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
                              id="SnøfangereKroker"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Snøfangere kroker i grad (pristillegg)
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="FeieplassPristillegg"
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
                              id="FeieplassPristillegg"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Feieplass (pristillegg)
                          </p>
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
