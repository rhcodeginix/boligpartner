/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import {
  ArrowBigRightDash,
  Download,
  Loader2,
  Pencil,
  Trash,
  X,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useRef, useState } from "react";
import Ic_search from "../../../assets/images/Ic_search.svg";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import {
  fetchAdminDataByEmail,
  fetchHusmodellData,
  formatDateTime,
} from "../../../lib/utils";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Modal from "../../../components/common/modal";
import Button from "../../../components/common/button";
import { ExportView } from "../configurator/Oppsummering/exportView";

export const HusmodellerTable = () => {
  const [page, setPage] = useState(1);
  const [houseModels, setHouseModels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState(null);
  const [kundeId, setKundeId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  const [IsAdmin, setIsAdmin] = useState<any>(null);
  const [office, setOfice] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchAdminDataByEmail();
      if (data) {
        if (data?.office) {
          setOfice(data?.office);
        }
        setIsAdmin(data?.is_admin ?? false);
      }
    };

    getData();
  }, []);

  const [activeTab, setActiveTab] = useState<"Bolig" | "Hytte" | "Prosjekt">(
    "Bolig"
  );

  const handleDelete = async (entryId: string) => {
    try {
      const docRef = doc(db, "housemodell_configure_broker", String(id));
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const currentKundeInfo = data?.KundeInfo || [];

        const updatedKundeInfo = currentKundeInfo.filter(
          (entry: any) => entry.uniqueId !== entryId
        );

        await updateDoc(docRef, {
          KundeInfo: updatedKundeInfo,
          updatedAt: new Date().toISOString(),
        });
        setId(null);
        toast.success("Slettet", { position: "top-right" });
        fetchHusmodellsData();
        setShowConfirm(false);
      }
    } catch (error) {
      console.error("Error deleting entry from KundeInfo:", error);
      toast.error("Noe gikk galt ved sletting.");
    }
  };

  const handleConfirmPopup = () => {
    if (showConfirm) {
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };

  const getData = async (email: string) => {
    try {
      if (email) {
        const q = query(collection(db, "admin"), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          return querySnapshot.docs[0].data();
        }
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  const fetchOfficeData = async (officeId: string) => {
    if (!officeId) return null;

    try {
      const officeQuery = query(
        collection(db, "office"),
        where("id", "==", officeId)
      );

      const querySnapshot = await getDocs(officeQuery);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
        };
      }

      return null;
    } catch (error) {
      console.error("Error fetching office data:", error);
      return null;
    }
  };

  const fetchHusmodellsData = async () => {
    setIsLoading(true);
    try {
      const q = query(
        collection(db, "housemodell_configure_broker"),
        orderBy("updatedAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      const data: any = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      let finalData: any = [];

      if (IsAdmin) {
        finalData = data;
      } else {
        const filteredData = await Promise.all(
          data.map(async (item: any) => {
            const email = item?.createDataBy?.email;
            if (!email) return null;

            const userData = await getData(email);
            return userData?.office === office ? item : null;
          })
        );
        finalData = filteredData.filter((item) => item !== null);
      }

      setHouseModels(finalData);
    } catch (error) {
      console.error("Error fetching husmodell data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (IsAdmin !== null || office !== null) {
      fetchHusmodellsData();
    }
  }, [office, IsAdmin]);
  const confirmDelete = (id: string) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const [filteredData, setFilteredData] = useState<any[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);

        const allKunder: any[] = [];

        for (const item of (houseModels as any) || []) {
          const kundeInfo = item?.KundeInfo;
          if (!Array.isArray(kundeInfo) || kundeInfo.length === 0) continue;

          let officeData: any = null;

          if (item?.createDataBy?.office) {
            officeData = await fetchOfficeData(item.createDataBy.office);
          } else if (item?.createDataBy?.email) {
            const userSnap = await getDocs(
              query(
                collection(db, "admin"),
                where("email", "==", item.createDataBy.email)
              )
            );

            if (!userSnap.empty) {
              const userData = userSnap.docs[0].data();

              if (userData?.office) {
                officeData = await fetchOfficeData(userData.office);
              }
            }
          }

          for (const kunde of kundeInfo) {
            const mappedKunde = {
              ...kunde,
              photo: item.photo || null,
              husmodell_name: kunde?.VelgSerie || item?.husmodell_name || null,
              parentId: item.id,
              createDataBy: item?.createDataBy || null,
              tag: item?.tag || null,
              placeOrder: kunde?.placeOrder || false,
              configurator:
                kunde?.Plantegninger?.length > 0
                  ? kunde.Plantegninger.some((room: any) => !room.configurator)
                  : true,
              updatedAt: kunde.updatedAt || item.updatedAt || null,
              kundeId: kunde?.uniqueId,
              id: item?.id,
              office_name: officeData?.data?.name || null,
            };

            allKunder.push(mappedKunde);
          }
        }

        const filtered = allKunder.filter((kunde) => {
          const matchesSearch =
            !searchTerm ||
            kunde.Kundenavn?.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesFilter =
            !selectedFilter || kunde.husmodell_name === selectedFilter;
          const matchesTypeProsjekt =
            !activeTab || kunde.tag?.toLowerCase() === activeTab.toLowerCase();
          return matchesSearch && matchesFilter && matchesTypeProsjekt;
        });

        const sorted = filtered.sort((a, b) => {
          const dateA = new Date(a.updatedAt || 0).getTime();
          const dateB = new Date(b.updatedAt || 0).getTime();
          return dateB - dateA;
        });

        setFilteredData(sorted);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [houseModels, searchTerm, selectedFilter, activeTab]);

  const [isExporting, setIsExporting] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [showConfiguratorModal, setShowConfiguratorModal] = useState(false);
  const [newConfiguratorName, setNewConfiguratorName] = useState("");
  const [pendingPayload, setPendingPayload] = useState<any>(null);

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    if (showConfiguratorModal) {
      setNewConfiguratorName(
        `${pendingPayload?.Anleggsadresse} - ${pendingPayload?.Kundenavn}`
      );
    } else {
      setNewConfiguratorName("");
    }
  }, [showConfiguratorModal, pendingPayload]);
  useEffect(() => {
    const exportToPDF = async () => {
      if (!isExporting || !selectedData) return;

      try {
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
                font-size: 28px;
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
                width: 1.25rem; /* 20px */
                height: 1.25rem;
                border: 2px solid #444CE7;
                border-radius: 0.125rem; /* rounded-sm */
              }
            
              .checkmark {
                pointer-events: none;
                position: absolute;
                left: 4px; /* 2px */
                top: 4px;
              }
            
              .checkmark-icon {
                width: 1rem;
                height: 1rem;
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

        const htmlFile = new File([htmlDocument], "document.html", {
          type: "text/html",
        });

        const formData = new FormData();
        formData.append("File", htmlFile);
        formData.append("FileName", "exported.pdf");

        try {
          const response = await fetch(
            "https://v2.convertapi.com/convert/html/to/pdf",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${process.env.REACT_APP_HTML_TO_PDF}`,
              },
              body: formData,
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            console.error("ConvertAPI returned an error:", errorText);
            throw new Error(
              `HTTP error! status: ${response.status} - ${errorText}`
            );
          }

          const json = await response.json();

          if (json.Files && json.Files[0]) {
            const file = json.Files[0];
            const base64 = file.FileData;
            const fileName = selectedData?.Kundenavn;

            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "application/pdf" });

            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setIsExporting(false);
          }
        } catch (error) {
          console.error("Error converting HTML to PDF:", error);
        } finally {
          setIsExporting(false);
        }
      } catch (err) {
        console.error("Failed to generate PDF:", err);
        toast.error("Kunne ikke laste ned PDF.");
      } finally {
        setIsExporting(false);
        setSelectedData(null);
      }
    };

    exportToPDF();
  }, [isExporting, selectedData]);

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

  const columns = useMemo<ColumnDef<any>[]>(() => {
    const baseColumns: ColumnDef<any>[] = [
      {
        accessorKey: "Kundenavn",
        header: "Kundenavn",
        cell: ({ row }) => (
          <p className="text-sm font-medium text-black w-max">
            {row.original?.Kundenavn}
          </p>
        ),
      },
      {
        accessorKey: "office_name",
        header: "Kontornavn",
        cell: ({ row }) => {
          return (
            <p className="text-sm font-medium text-black w-max">
              {row.original?.office_name}
            </p>
          );
        },
      },
      {
        accessorKey: "Anleggsadresse",
        header: "Anleggsadresse",
        cell: ({ row }) => (
          <p className="text-sm font-medium text-black w-max">
            {row.original?.Anleggsadresse}
          </p>
        ),
      },
      {
        accessorKey: "Kundenummer",
        header: "BP prosjektnummer",
        cell: ({ row }) => (
          <p className="text-sm font-medium text-black w-max">
            {row.original?.Kundenummer}
          </p>
        ),
      },
      {
        accessorKey: "Boligkonsulent",
        header: "Boligkonsulent",
        cell: ({ row }) => (
          <p className="text-sm font-medium text-black w-max">
            {row.original?.createDataBy?.f_name
              ? `${row.original?.createDataBy?.f_name} ${row.original?.createDataBy?.l_name}`
              : row.original?.createDataBy?.name}
          </p>
        ),
      },
      {
        accessorKey: "TypeProsjekt",
        header: "TypeProsjekt",
        cell: ({ row }) => (
          <p className="text-sm font-medium text-black w-max">
            {row.original?.TypeProsjekt ?? "-"}
          </p>
        ),
      },
      {
        accessorKey: "Status",
        header: "Status",
        cell: ({ row }) => (
          <>
            {row.original?.placeOrder ? (
              <p className="text-sm font-medium text-green w-max bg-lightGreen py-1 px-2 rounded-full">
                Overført til oppmelding
              </p>
            ) : row.original?.configurator ? (
              <p className="text-sm font-medium text-primary w-max bg-lightPurple py-1 px-2 rounded-full">
                Ferdig konfiguert
              </p>
            ) : (
              <p className="text-sm font-medium text-black w-max bg-gray2 py-1 px-2 rounded-full">
                Under behandling
              </p>
            )}
          </>
        ),
      },
      {
        accessorKey: "sisteoppdatertav",
        header: "Sist oppdatert",
        cell: ({ row }) => (
          <p className="text-sm font-medium text-black w-max">
            {formatDateTime(row.original?.updatedAt)}
          </p>
        ),
      },
      {
        id: "action",
        header: "Action",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-3">
            {!row.original.placeOrder && (
              <ArrowBigRightDash
                className={`text-primary cursor-pointer ${
                  row.original.configurator
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  if (row.original.configurator === true) return;
                  if (!row.original.id || !row.original.kundeId) return;
                  setKundeId(row.original.kundeId);
                  setId(row.original.id);
                  setIsPlacingOrder(true);
                  const formatDate = (date: Date) =>
                    date
                      .toLocaleString("sv-SE", { timeZone: "UTC" })
                      .replace(",", "");

                  try {
                    const houseData: any = await fetchHusmodellData(
                      row.original.id
                    );
                    const kundeList = houseData?.KundeInfo || [];

                    const targetKundeIndex = kundeList.findIndex(
                      (k: any) =>
                        String(k.uniqueId) === String(row.original.kundeId)
                    );
                    if (targetKundeIndex === -1) return;

                    const refetched = await fetchHusmodellData(row.original.id);
                    const targetKunde = refetched?.KundeInfo?.find(
                      (kunde: any) =>
                        String(kunde.uniqueId) === String(row.original.kundeId)
                    );

                    const newId = row.original.id;

                    const docRef = doc(
                      db,
                      "housemodell_configure_broker",
                      newId
                    );

                    if (!newConfiguratorName.trim()) {
                      setPendingPayload({
                        ...targetKunde,
                        createdAt: formatDate(new Date()),
                      });
                      setShowConfiguratorModal(true);
                      return;
                    }

                    await setDoc(docRef, {
                      ...targetKunde,
                      createdAt: formatDate(new Date()),
                      name: newConfiguratorName.trim(),
                    });

                    toast.success("Bestillingen er lagt inn!", {
                      position: "top-right",
                    });
                    navigate(
                      `/Room-Configurator/${row.original.id}/${row.original.kundeId}`
                    );
                  } catch (err) {
                    console.error("Error saving data:", err);
                    toast.error("Noe gikk galt", { position: "top-right" });
                  } finally {
                    setIsPlacingOrder(false);
                  }
                }}
              />
            )}

            {row.original?.Plantegninger?.filter(
              (p: any) => p?.rooms && p.rooms.length > 0
            ).length > 0 && (
              <Download
                className="h-5 w-5 text-primary cursor-pointer"
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedData(row.original);
                  setIsExporting(true);
                }}
              />
            )}

            <Pencil
              className="h-5 w-5 text-primary cursor-pointer"
              onClick={() =>
                navigate(
                  `/se-series/${row.original.parentId}/edit-husmodell/${row.original?.uniqueId}`
                )
              }
            />
            <Trash
              className="h-5 w-5 text-red cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                confirmDelete(row.original?.uniqueId);
                setId(row.original.parentId);
              }}
            />
          </div>
        ),
      },
    ];

    if (activeTab !== "Prosjekt") {
      baseColumns.splice(3, 0, {
        accessorKey: "Serienavn",
        header: "Serienavn",
        cell: ({ row }) => (
          <p className="text-sm font-medium text-black w-max">
            {row.original?.husmodell_name}
          </p>
        ),
      });
    }

    return baseColumns;
  }, [navigate, activeTab]);

  const pageSize = 10;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    },
    pageCount: Math.ceil(filteredData.length / pageSize),
    manualPagination: true,
    onPaginationChange: (updater: any) => {
      if (typeof updater === "function") {
        const newState = updater({
          pageIndex: page - 1,
          pageSize,
        });
        setPage(newState.pageIndex + 1);
      }
    },
  });

  return (
    <>
      <div className="mb-5 flex justify-center">
        <div className="flex gap-1.5">
          {["Bolig", "Hytte", "Prosjekt"].filter(Boolean).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as "Bolig" | "Hytte" | "Prosjekt");
                setSelectedFilter("");
                setPage(1);
              }}
              className={`px-2 md:px-4 py-2 text-sm font-medium ${
                activeTab === tab
                  ? "border-b-2 border-purple text-purple"
                  : "text-gray-500"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-2 flex gap-2 flex-col lg:flex-row lg:items-center justify-between bg-lightPurple rounded-[12px] py-3 px-4">
        <div className="flex items-center border border-gray1 shadow-shadow1 bg-[#fff] gap-2 rounded-lg py-[10px] px-[14px]">
          <img src={Ic_search} alt="search" />
          <input
            type="text"
            placeholder="Søk etter lead"
            className="focus-within:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="shadow-shadow1 border border-gray1 rounded-[8px] flex flex-col sm:flex-row overflow-hidden sm:w-max">
          {activeTab !== "Prosjekt" && (
            <div
              className={`p-2.5 md:py-3 md:px-4 text-black2 font-medium text-[13px] sm:text-sm border-b sm:border-b-0 sm:border-r border-gray1 cursor-pointer ${
                selectedFilter === "" && "bg-white"
              }`}
              onClick={() => {
                setPage(1);
                setSelectedFilter("");
              }}
            >
              Alle
            </div>
          )}
          {activeTab === "Bolig" && (
            <div
              className={`p-2.5 md:py-3 md:px-4 text-black2 font-medium text-[13px] sm:text-sm cursor-pointer ${
                selectedFilter === "Nostalgi" && "bg-white"
              }`}
              onClick={() => {
                setPage(1);
                setSelectedFilter("Nostalgi");
              }}
            >
              Nostalgi
            </div>
          )}
          {activeTab === "Hytte" && (
            <div
              className={`p-2.5 md:py-3 md:px-4 text-black2 font-medium text-[13px] sm:text-sm cursor-pointer ${
                selectedFilter === "Karakter" && "bg-white"
              }`}
              onClick={() => {
                setPage(1);
                setSelectedFilter("Karakter");
              }}
            >
              Karakter
            </div>
          )}
          {activeTab === "Bolig" && (
            <div
              className={`p-2.5 md:py-3 md:px-4 text-black2 font-medium text-[13px] sm:text-sm border-b border-t sm:border-t-0 sm:border-b-0 sm:border-r sm:border-l border-gray1 cursor-pointer ${
                selectedFilter === "Herskapelig" && "bg-white"
              }`}
              onClick={() => {
                setPage(1);
                setSelectedFilter("Herskapelig");
              }}
            >
              Herskapelig
            </div>
          )}
          {activeTab === "Hytte" && (
            <div
              className={`p-2.5 md:py-3 md:px-4 text-black2 font-medium text-[13px] sm:text-sm border-b border-t sm:border-t-0 sm:border-b-0 sm:border-r sm:border-l border-gray1 cursor-pointer ${
                selectedFilter === "Tur" && "bg-white"
              }`}
              onClick={() => {
                setSelectedFilter("Tur");
                setPage(1);
              }}
            >
              Tur
            </div>
          )}
          {activeTab !== "Prosjekt" && (
            <div
              className={`p-2.5 md:py-3 md:px-4 text-black2 font-medium text-[13px] sm:text-sm cursor-pointer border-b sm:border-b-0 sm:border-r border-gray1 ${
                selectedFilter === "Moderne" && "bg-white"
              }`}
              onClick={() => {
                setPage(1);
                setSelectedFilter("Moderne");
              }}
            >
              Moderne
            </div>
          )}
          {activeTab === "Bolig" && (
            <div
              className={`p-2.5 md:py-3 md:px-4 text-black2 font-medium text-[13px] sm:text-sm cursor-pointer ${
                selectedFilter === "Funkis" && "bg-white"
              }`}
              onClick={() => {
                setPage(1);
                setSelectedFilter("Funkis");
              }}
            >
              Funkis
            </div>
          )}
          {activeTab === "Hytte" && (
            <div
              className={`p-2.5 md:py-3 md:px-4 text-black2 font-medium text-[13px] sm:text-sm cursor-pointer ${
                selectedFilter === "V-serie" && "bg-white"
              }`}
              onClick={() => {
                setPage(1);
                setSelectedFilter("V-serie");
              }}
            >
              V-serie
            </div>
          )}
        </div>
      </div>
      <div className="rounded-lg border border-gray2 shadow-shadow2 overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header: any) => (
                  <TableHead
                    key={header.id}
                    className="h-8 text-sm whitespace-nowrap"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows?.length &&
              table.getRowModel().rows.map((row: any) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/se-series/${row.original.parentId}/edit-husmodell/${row.original?.uniqueId}`
                    )
                  }
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id} className="px-6 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center py-4 px-6 border-t border-gray2">
          <button
            className="px-[14px] py-2 rounded-lg disabled:opacity-50 shadow-shadow1 border border-gray1 text-black font-semibold text-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Forrige
          </button>
          <span className="text-black text-sm">
            Side <span className="font-semibold">{page}</span> av{" "}
            <span className="font-semibold">{table.getPageCount()}</span>
          </span>
          <button
            className="px-[14px] py-2 rounded-lg disabled:opacity-50 shadow-shadow1 border border-gray1 text-black font-semibold text-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Neste
          </button>
        </div>
      </div>
      {showConfirm && (
        <Modal onClose={handleConfirmPopup} isOpen={true}>
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg font-bold">
                Er du sikker på at du vil slette?
              </p>
              <div className="flex justify-center mt-5 w-full gap-5 items-center">
                <div onClick={() => setShowConfirm(false)}>
                  <Button
                    text="Avbryt"
                    className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                  />
                </div>
                <div onClick={() => handleDelete(selectedId)}>
                  <Button
                    text="Bekreft"
                    className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

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
          <ExportView
            rooms={selectedData?.Plantegninger}
            kundeInfo={selectedData}
            roomsData={selectedData}
          />
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

      {isPlacingOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center"
          style={{ zIndex: 99999 }}
        >
          <div className="flex flex-col items-center gap-4 bg-white p-3 rounded-lg">
            <span className="text-purple text-base font-medium">
              Overfører til Aktive tiltak...
            </span>
            <div className="w-48 h-1 overflow-hidden rounded-lg">
              <div className="w-full h-full bg-purple animate-[progress_1.5s_linear_infinite] rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {showConfiguratorModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowConfiguratorModal(false)}
          outSideClick={true}
        >
          <div className="p-6 bg-white rounded-lg shadow-lg relative w-full sm:w-[546px]">
            <X
              className="text-primary absolute top-2.5 right-2.5 w-5 h-5 cursor-pointer"
              onClick={() => {
                setShowConfiguratorModal(false);
                setNewConfiguratorName("");
                setPendingPayload(null);
              }}
            />
            <h2 className="text-lg font-bold mb-4">
              Sett navn på konfigurasjonen
            </h2>
            <input
              type="text"
              value={newConfiguratorName}
              onChange={(e) => setNewConfiguratorName(e.target.value)}
              placeholder="Skriv inn navn på konfigurator"
              className="bg-white rounded-[8px] border text-black border-gray1 flex h-11 w-full border-input px-[14px] py-[10px] text-base file:border-0 file:bg-transparent file:text-sm file:font-medium  focus-visible:outline-none focus:bg-lightYellow2 disabled:cursor-not-allowed disabled:bg-[#F5F5F5] disabled:hover:border-gray7 focus:shadow-none focus-visible:shadow-none placeholder:text-[#667085] placeholder:text-opacity-55 placeholder:text-base disabled:text-[#767676] focus:shadow-shadow1 mb-4"
            />
            <div className="flex justify-end gap-4">
              <Button
                text="Avbryt"
                className="border border-gray2 text-black"
                onClick={() => {
                  setNewConfiguratorName("");
                  setShowConfiguratorModal(false);
                  setPendingPayload(null);
                }}
              />
              <Button
                text="Opprett"
                className="bg-purple text-white"
                onClick={async () => {
                  setShowConfiguratorModal(false);
                  setIsPlacingOrder(true);

                  if (!pendingPayload) return;
                  const newId = id;
                  const docRef = doc(
                    db,
                    "housemodell_configure_broker",
                    String(newId)
                  );
                  const docSnap = await getDoc(docRef);
                  const formatDate = (date: Date) =>
                    date
                      .toLocaleString("sv-SE", { timeZone: "UTC" })
                      .replace(",", "");

                  let existingData = docSnap.exists() ? docSnap.data() : {};

                  let updatedKundeInfo = (existingData.KundeInfo || []).map(
                    (kunde: any) => {
                      if (kunde.uniqueId === kundeId) {
                        return {
                          ...kunde,
                          placeOrder: true,
                          name: newConfiguratorName.trim(),
                        };
                      }
                      return kunde;
                    }
                  );

                  const updatePayload: any = {
                    ...existingData,
                    KundeInfo: updatedKundeInfo,

                    createDataBy: createData,
                  };

                  if (!docSnap.exists()) {
                    updatePayload.createdAt = formatDate(new Date());
                  }

                  await setDoc(docRef, updatePayload);

                  toast.success("Bestillingen er lagt inn!", {
                    position: "top-right",
                  });

                  setShowConfiguratorModal(false);
                  setNewConfiguratorName("");
                  navigate(`/Room-Configurator/${id}/${kundeId}`);
                  const currIndex = 0;
                  const currVerticalIndex = 1;
                  localStorage.setItem("currIndexBolig", currIndex.toString());
                  localStorage.setItem(
                    "currVerticalIndex",
                    currVerticalIndex.toString()
                  );
                  setIsPlacingOrder(false);
                  setKundeId(null);
                  setId(null);
                }}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
