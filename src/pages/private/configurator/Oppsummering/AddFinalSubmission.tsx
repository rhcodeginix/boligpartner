import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../../components/ui/form";
import Button from "../../../../components/common/button";
import { Input } from "../../../../components/ui/input";
import { parsePhoneNumber } from "react-phone-number-input";
import {
  fetchAdminDataByEmail,
  fetchProjectsData,
  phoneNumberValidations,
} from "../../../../lib/utils";
import { InputMobile } from "../../../../components/ui/inputMobile";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { useLocation, useNavigate } from "react-router-dom";
import { removeUndefinedOrNull } from "../Oppmelding/Yttervegger";
import { toast } from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
// import html2canvas from "html2canvas";
// import PptxGenJS from "pptxgenjs";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
import Modal from "../../../../components/common/modal";
import { Spinner } from "../../../../components/Spinner";
import { ExportViewData } from "./exportViewData";
import { v4 as uuidv4 } from "uuid";

const formSchema = z.object({
  Kundenavn: z.string({
    required_error: "Kundenavn must må spesifiseres.",
  }),
  mobile: z.string().refine(
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
  Serie: z.string({
    required_error: "Serie must må spesifiseres.",
  }),
  Kundenummer: z.string({ required_error: "BP prosjektnummer er påkrevd." }),
  Husmodell: z.string({
    required_error: "Husmodell må spesifiseres.",
  }),
  exportType: z.string({ required_error: "Obligatorisk" }),
});

export const AddFinalSubmission: React.FC<{
  onClose: any;
  rooms: any;
  roomsData: any;
}> = ({ onClose, rooms, roomsData }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const id = pathSegments.length > 2 ? pathSegments[2] : null;
  const kundeId = pathSegments.length > 3 ? pathSegments[3] : null;

  const previewRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [isExporting, setIsExporting] = useState(false);

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [createData, setCreateData] = useState<any>(null);
  useEffect(() => {
    const getData = async () => {
      const data = await fetchAdminDataByEmail();
      if (data) {
        setCreateData(data);
      }
    };

    getData();
  }, []);
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitLoading(true);

    try {
      const formatDate = (date: Date) => {
        return date
          .toLocaleString("sv-SE", { timeZone: "UTC" })
          .replace(",", "");
      };

      const filteredData = removeUndefinedOrNull(data);

      if (id && kundeId) {
        const husmodellDocRef = doc(db, "projects", String(kundeId));

        const docSnap = await getDoc(husmodellDocRef);
        if (!docSnap.exists()) {
          throw new Error("Document does not exist!");
        }
        const existingDocData = docSnap.data();

        const updatedKundeInfo = {
          ...existingDocData,
          VelgSerie: data.Serie,
          FinalSubmission: filteredData,
          Prosjektdetaljer: {
            ...existingDocData.Prosjektdetaljer,
            VelgSerie: data.Serie,
          },
          updatedAt: formatDate(new Date()),
        };

        await updateDoc(husmodellDocRef, {
          ...updatedKundeInfo,
          updatedAt: new Date().toISOString(),
        });
      }

      onClose();
      toast.success("Lagret", {
        position: "top-right",
      });

      // if (data.exportType === "PDF") {
      setIsExporting(true);
      const element = previewRef.current as HTMLElement | null;
      if (!element) return;

      const htmlDocument = `
          <html>
            <head>
              <meta charset="UTF-8" />
              <title>Export</title>
              <style>
              body {
                font-family: "Inter", sans-serif !important;
                margin: 0 !important;
                padding: 0 !important;
                box-sizing: border-box;
                list-style: none;
              }
              p {
                margin: 0 !important;
              }
              
              .upperCaseHeading {
                color: #101828;
                font-weight: 700;
                font-size: 18px;
                text-transform: uppercase;
              }  
              .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
              }
            
              .checkbox-box {
                width: 1rem; /* 20px */
                height: 1rem;
                border: 2px solid #444CE7;
                border-radius: 0.125rem; /* rounded-sm */
              }
            
              .checkmark {
                pointer-events: none;
                position: absolute;
                left: 2px; /* 2px */
                top: 2px;
              }
            
              .checkmark-icon {
                width: 0.75rem;
                height: 0.75rem;
                color: #444CE7;
              }
            
              .horizontal-divider {
                width: 100%;
                border-top: 1px solid #EBEBEB;
              }           
              .custom-grid {
                display: grid;
                grid-template-columns: repeat(1, minmax(0, 1fr));
                gap: 1rem;
              }
      
              @media (min-width: 640px) {
                .custom-grid {
                  grid-template-columns: repeat(2, minmax(0, 1fr));
                }
              }
      
              @media (min-width: 768px) {
                .custom-grid {
                  grid-template-columns: repeat(3, minmax(0, 1fr));
                }
              }
            </style>
            </head>
            <body>
              ${element.outerHTML}
            </body>
          </html>
        `;

      // const htmlFile = new File([htmlDocument], "document.html", {
      //   type: "text/html",
      // });

      // const formData = new FormData();
      // formData.append("File", htmlFile);
      // formData.append("FileName", "exported.pdf");

      try {
        // const response = await fetch(
        //   "https://v2.convertapi.com/convert/html/to/pdf",
        //   {
        //     method: "POST",
        //     headers: {
        //       Authorization: `Bearer ${process.env.REACT_APP_HTML_TO_PDF}`,
        //     },
        //     body: formData,
        //   }
        // );

        // if (!response.ok) {
        //   const errorText = await response.text();
        //   console.error("ConvertAPI returned an error:", errorText);
        //   throw new Error(
        //     `HTTP error! status: ${response.status} - ${errorText}`
        //   );
        // }

        // const json = await response.json();

        // if (json.Files && json.Files[0]) {
        //   const file = json.Files[0];
        //   const base64 = file.FileData;
        //   const fileName = roomsData?.Kundenavn;

        //   const byteCharacters = atob(base64);
        //   const byteNumbers = new Array(byteCharacters.length);
        //   for (let i = 0; i < byteCharacters.length; i++) {
        //     byteNumbers[i] = byteCharacters.charCodeAt(i);
        //   }
        //   const byteArray = new Uint8Array(byteNumbers);
        //   const blob = new Blob([byteArray], { type: "application/pdf" });

        //   const link = document.createElement("a");
        //   link.href = window.URL.createObjectURL(blob);
        //   link.download = fileName;
        //   document.body.appendChild(link);
        //   link.click();
        //   document.body.removeChild(link);
        //   setIsExporting(false);
        // }

        const payload = {
          tasks: {
            "import-1": {
              operation: "import/raw",
              file: htmlDocument,
              filename: "document.html",
            },
            convert: {
              operation: "convert",
              input: "import-1",
              output_format: "pdf",
              options: {
                page_size: "A4",
                margin_top: "10mm",
                margin_bottom: "10mm",
                margin_left: "10mm",
                margin_right: "10mm",
              },
            },
            export: {
              operation: "export/url",
              input: "convert",
            },
          },
          tag: "html-css-conversion",
        };

        const createJobRes = await fetch(
          "https://api.cloudconvert.com/v2/jobs",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_HTML_TO_PDF_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!createJobRes.ok) {
          throw new Error(`Job creation failed: ${await createJobRes.text()}`);
        }

        const createJobData = await createJobRes.json();
        const jobId = createJobData.data.id;

        let exportFileUrl = "";
        while (true) {
          const jobStatusRes = await fetch(
            `https://api.cloudconvert.com/v2/jobs/${jobId}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.REACT_APP_HTML_TO_PDF_TOKEN}`,
              },
            }
          );

          const jobStatusData = await jobStatusRes.json();
          const exportTask = jobStatusData.data.tasks.find(
            (t: any) => t.operation === "export/url" && t.status === "finished"
          );

          if (exportTask) {
            exportFileUrl = exportTask.result.files[0].url;
            break;
          }

          await new Promise((r) => setTimeout(r, 2000));
        }

        const pdfResponse = await fetch(exportFileUrl);
        const pdfBlob = await pdfResponse.blob();

        const link = document.createElement("a");
        link.href = URL.createObjectURL(pdfBlob);
        link.download = roomsData?.Kundenavn;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setIsExporting(false);
      } catch (error) {
        console.error("Error converting HTML to PDF:", error);
      } finally {
        setIsExporting(false);
      }
      // }

      // if (data.exportType === "PPT") {
      //   setIsExporting(true);
      //   const exportToPpt = async () => {
      //     const element = previewRef.current;
      //     if (!element) return;

      //     const fullCanvas = await html2canvas(element, {
      //       scale: 1,
      //       useCORS: true,
      //     });

      //     const slideWidthInches = 10;
      //     const slideHeightInches = 5.625;
      //     const paddingInches = 0.2;
      //     const usableWidthInches = slideWidthInches - 2 * paddingInches;
      //     const usableHeightInches = slideHeightInches - 2 * paddingInches;
      //     const DPI = 96;

      //     const totalHeightPx = fullCanvas.height;
      //     const totalWidthPx = fullCanvas.width;
      //     const sliceHeightPx = usableHeightInches * DPI;

      //     const pptx = new PptxGenJS();
      //     let offsetY = 0;

      //     while (offsetY < totalHeightPx) {
      //       const sliceCanvas = document.createElement("canvas");
      //       sliceCanvas.width = totalWidthPx;
      //       const currentSliceHeight = Math.min(
      //         sliceHeightPx,
      //         totalHeightPx - offsetY
      //       );
      //       sliceCanvas.height = currentSliceHeight;

      //       const ctx = sliceCanvas.getContext("2d");
      //       if (ctx) {
      //         ctx.drawImage(
      //           fullCanvas,
      //           0,
      //           offsetY,
      //           totalWidthPx,
      //           currentSliceHeight,
      //           0,
      //           0,
      //           totalWidthPx,
      //           currentSliceHeight
      //         );
      //       }

      //       const imgData = sliceCanvas.toDataURL("image/png");

      //       const imageWidthInches = totalWidthPx / DPI;
      //       const imageHeightInches = currentSliceHeight / DPI;

      //       let scaledWidth = usableWidthInches;
      //       let scaledHeight =
      //         imageHeightInches * (scaledWidth / imageWidthInches);

      //       if (scaledHeight > usableHeightInches) {
      //         scaledHeight = usableHeightInches;
      //         scaledWidth =
      //           imageWidthInches * (scaledHeight / imageHeightInches);
      //       }

      //       const slide = pptx.addSlide();
      //       slide.addImage({
      //         data: imgData,
      //         x: paddingInches + (usableWidthInches - scaledWidth) / 2,
      //         y: paddingInches + (usableHeightInches - scaledHeight) / 2,
      //         w: scaledWidth,
      //         h: scaledHeight,
      //       });

      //       offsetY += currentSliceHeight;
      //     }

      //     pptx.writeFile({ fileName: `export-${Date.now()}.pptx` });
      //   };
      //   exportToPpt();
      // }

      // if (data.exportType === "Excel") {
      //   setIsExporting(true);
      //   const exportToExcel = () => {
      //     const rows: any[] = [];

      //     rooms.forEach((room: any) => {
      //       room.rooms?.forEach((innerRoom: any) => {
      //         innerRoom.Kategorinavn?.forEach((kat: any) => {
      //           if (kat.productOptions === "Text") return;

      //           kat.produkter?.forEach((prod: any) => {
      //             if (!prod?.isSelected) return;

      //             rows.push({
      //               RoomTitle: room?.title,
      //               RoomName: innerRoom?.name_no || innerRoom?.name,
      //               Category: kat?.navn,
      //               Product: prod?.Produktnavn,
      //               Price: prod?.IncludingOffer
      //                 ? "Standard"
      //                 : prod?.pris || "-",
      //               DeliveredBy: prod?.delieverBy || "Boligpartner",
      //             });
      //           });
      //         });
      //       });
      //     });

      //     const worksheet = XLSX.utils.json_to_sheet(rows);
      //     const workbook = XLSX.utils.book_new();
      //     XLSX.utils.book_append_sheet(
      //       workbook,
      //       worksheet,
      //       "Customisation Summary"
      //     );

      //     const excelBuffer = XLSX.write(workbook, {
      //       bookType: "xlsx",
      //       type: "array",
      //     });
      //     const blob = new Blob([excelBuffer], {
      //       type: "application/octet-stream",
      //     });

      //     saveAs(blob, `customisation-summary-${Date.now()}.xlsx`);
      //   };
      //   exportToExcel();
      // }

      const uniqueId = uuidv4();

      const boligconfiguratorDocRef = doc(
        db,
        "boligconfigurator_count",
        String(uniqueId)
      );

      const boligconfiguratorSnap = await getDoc(boligconfiguratorDocRef);

      if (!boligconfiguratorSnap.exists()) {
        const initialData = {
          id: uniqueId,
          type: data?.exportType,
          timeStamp: new Date().toISOString(),
          created_by: createData?.id,
          document_id: kundeId,
        };

        await setDoc(boligconfiguratorDocRef, initialData);
      }

      setIsExporting(false);
      // navigate("/Bolig-configurator");
    } catch (error) {
      console.error("error:", error);
      toast.error("Something went wrong!", {
        position: "top-right",
      });
    } finally {
      setIsExporting(false);
      setIsSubmitLoading(false);
    }
  };

  // const exportType = [
  //   "PDF",
  //   "PPT",
  //   // "Excel"
  // ];

  const [array, setArray] = useState<string[]>([]);

  useEffect(() => {
    if (!id || !kundeId) {
      return;
    }

    const typeProsjekt =
      roomsData?.Prosjektdetaljer?.TypeProsjekt || roomsData?.TypeProsjekt;

    if (typeProsjekt === "Bolig") {
      setArray(["Herskapelig", "Moderne", "Nostalgi", "Funkis"]);
    } else if (typeProsjekt === "Hytte") {
      setArray(["Tur", "V-serie", "Karakter", "Moderne"]);
    } else {
      form.resetField("Serie");
      form.setValue("Serie", "");
      setArray([]);
    }

    const getData = async () => {
      const data = await fetchProjectsData(kundeId);

      if (data) {
        if (data && data?.FinalSubmission) {
          Object.entries(data?.FinalSubmission).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              form.setValue(key as any, value);
              if (key === "Kundenummer") {
                form.setValue("Kundenummer", String(value));
              }
            }
            if (key === "Serie" && value === "") {
              const serieValue =
                roomsData?.Prosjektdetaljer?.VelgSerie ?? roomsData?.VelgSerie;
              form.setValue(
                key,
                serieValue && serieValue.trim() !== "" ? serieValue : undefined
              );
              form.setValue("exportType", "PDF");
            }
          });
        } else if (roomsData) {
          const serieValue =
            roomsData?.Prosjektdetaljer?.VelgSerie ?? roomsData?.VelgSerie;

          form.reset({
            Serie:
              serieValue && serieValue.trim() !== "" ? serieValue : undefined,
            Kundenummer: String(
              roomsData?.Prosjektdetaljer?.Kundenr ?? roomsData?.Kundenummer
            ),
            mobile:
              roomsData?.Prosjektdetaljer?.TelefonMobile ??
              roomsData?.mobileNummer ??
              "",
            Kundenavn:
              roomsData?.Prosjektdetaljer?.Tiltakshaver ??
              roomsData?.Kundenavn ??
              "",
          });
          form.setValue("exportType", "PDF");
        }
      }
    };

    getData();
  }, [id, roomsData, form, array.length > 0]);

  useEffect(() => {
    const navbar = document.getElementById("navbar");
    const exportDiv = document.getElementById("export_div");

    if (navbar) {
      navbar.style.zIndex = isExporting ? "-1" : "999";
    }

    if (exportDiv) {
      exportDiv.style.zIndex = isExporting ? "-1" : "999";
    }
  }, [isExporting]);

  return (
    <>
      {isSubmitLoading && <Spinner />}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative w-full"
        >
          <div className="p-4 md:p-6 flex flex-col sm:grid grid-cols-2 gap-4">
            <div>
              <FormField
                control={form.control}
                name="Kundenavn"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <p
                      className={`${
                        fieldState.error ? "text-red" : "text-black"
                      } mb-[6px] text-sm font-medium`}
                    >
                      Kundenavn
                    </p>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Skriv inn Kundenavn"
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
                name={`mobile`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <p
                      className={`${
                        fieldState.error ? "text-red" : ""
                      } mb-[6px] text-sm`}
                    >
                      Mobil
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
            {(roomsData?.Prosjektdetaljer?.TypeProsjekt !== "Prosjekt" ??
              roomsData?.TypeProsjekt !== "Prosjekt") && (
              <div>
                <FormField
                  control={form.control}
                  name="Serie"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <p
                        className={`${
                          fieldState.error ? "text-red" : "text-black"
                        } mb-[6px] text-sm`}
                      >
                        Serie:
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
                                {array?.map((item: any, index: number) => {
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
            )}
            <div>
              <FormField
                control={form.control}
                name="Kundenummer"
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
                name="Husmodell"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <p
                      className={`${
                        fieldState.error ? "text-red" : "text-black"
                      } mb-[6px] text-sm font-medium`}
                    >
                      Husmodell:
                    </p>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Skriv inn Husmodell"
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
            {/* <div>
              <FormField
                control={form.control}
                name={`exportType`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <p
                      className={`mb-2 ${
                        fieldState.error ? "text-red" : "text-black"
                      } text-sm`}
                    >
                      Velg type export av tiltak:
                    </p>
                    <FormControl>
                      <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                        {exportType.map((option) => (
                          <div
                            key={option}
                            className="relative flex items-center gap-2 cursor-pointer"
                            onClick={() => {
                              form.setValue("exportType", option);
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
                                form.setValue(`exportType`, e.target.value);
                              }}
                              checked={field.value === option}
                            />
                            <p className={`text-black text-sm`}>{option}</p>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> */}
          </div>
          <div
            className="flex fixed bottom-0 justify-end w-full gap-5 items-center left-0 px-8 py-4"
            style={{
              boxShadow:
                "0px -3px 4px -2px #1018280F, 0px -4px 8px -2px #1018281A",
            }}
            id="export_div"
          >
            <div onClick={() => form.reset()}>
              <Button
                text="Avbryt"
                className="border border-lightPurple bg-lightPurple text-purple text-sm rounded-[8px] h-[40px] font-medium relative px-12 py-2 flex items-center gap-2"
              />
            </div>
            <Button
              text="Generer"
              className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-12 py-2 flex items-center gap-2"
              type="submit"
            />
          </div>
        </form>
      </Form>

      <div
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <div ref={previewRef}>
          <ExportViewData kundeInfo={form.getValues()} />
        </div>
      </div>

      {isExporting && (
        <Modal
          onClose={() => setIsExporting(false)}
          isOpen={true}
          outSideClick={false}
        >
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="flex flex-col items-center gap-4 bg-white p-3 rounded-lg">
              <span className="text-purple text-base font-medium">
                Eksporterer...
              </span>
              <div className="w-48 h-1 overflow-hidden rounded-lg">
                <div className="w-full h-full bg-purple animate-[progress_1.5s_linear_infinite] rounded-lg" />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
