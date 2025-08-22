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
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import {
  fetchAdminData,
  fetchAdminDataByEmail,
  fetchProjectsData,
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
      const formatDate = (date: Date) =>
        date.toLocaleString("sv-SE", { timeZone: "UTC" }).replace(",", "");
      const now = new Date();

      // await deleteDoc(doc(db, "projects", entryId));
      const ref = doc(db, "projects", entryId);
      await updateDoc(ref, {
        is_deleted: true,
        deleted_at: formatDate(now),
      });

      fetchHusmodellsData();
      setShowConfirm(false);
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

  const fetchUserData = async (id: string) => {
    if (!id) return null;

    try {
      const officeData = await fetchAdminData(id);
      if (officeData) {
        return officeData;
      }
      return null;
    } catch (error) {
      console.error("Error fetching office data:", error);
      return null;
    }
  };

  const fetchTagData = async (id: string) => {
    if (!id) return null;

    try {
      const officeQuery = query(
        collection(db, "housemodell_configure_broker"),
        where("id", "==", id)
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
      console.error("Error fetching tag data:", error);
      return null;
    }
  };

  const fetchHusmodellsData = async () => {
    setIsLoading(true);
    try {
      // const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));

      let q;
      if (IsAdmin) {
        q = query(collection(db, "projects"), where("is_deleted", "==", false));
      } else {
        q = query(
          collection(db, "projects"),
          where("office_id", "==", office),
          where("is_deleted", "==", false)
        );
      }
      const querySnapshot = await getDocs(q);

      const data: any = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a: any, b: any) => {
          const dateA = a.createdAt?.toDate
            ? a.createdAt.toDate()
            : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate
            ? b.createdAt.toDate()
            : new Date(b.createdAt);
          return dateB - dateA;
        });

      setHouseModels(data);
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

        const categoryIds = new Set<string>();
        const userIds = new Set<string>();

        for (const item of houseModels as any) {
          if (item?.category_id) categoryIds.add(item.category_id);
          if (item?.created_by) userIds.add(item.created_by);
        }

        const fetchTags = async () => {
          const results: Record<string, any> = {};
          const promises = Array.from(categoryIds).map(async (id) => {
            const data = await fetchTagData(id);
            if (data) results[id] = data;
          });
          await Promise.all(promises);
          return results;
        };

        const fetchUsers = async () => {
          const results: Record<string, any> = {};
          const promises = Array.from(userIds).map(async (id) => {
            const data = await fetchUserData(id);
            if (data) results[id] = data;
          });
          await Promise.all(promises);
          return results;
        };

        const [tagMap, userMap] = await Promise.all([
          fetchTags(),
          fetchUsers(),
        ]);

        const allKunder = houseModels.map((item: any) => {
          const tagData = item?.category_id ? tagMap[item.category_id] : null;
          const userData = item?.created_by ? userMap[item.created_by] : null;

          return {
            ...item,
            husmodell_name: item?.VelgSerie || tagData?.husmodell_name || null,
            parentId: item.category_id,
            createDataBy: userData || null,
            tag: tagData?.tag || null,
            placeOrder: item?.placeOrder || false,
            configurator:
              item?.Plantegninger?.length > 0
                ? item.Plantegninger.some((room: any) => !room.configurator)
                : true,
            createdAt: item?.createdAt || null,
            kundeId: item?.uniqueId,
            id: item?.uniqueId,
            self_id: item?.self_id,
          };
        });

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
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
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
        link.download = selectedData?.Kundenavn;
        document.body.appendChild(link);
        link.click();
        link.remove();
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
      // {
      //   accessorKey: "office_name",
      //   header: "Kontornavn",
      //   cell: ({ row }) => {
      //     return (
      //       <p className="text-sm font-medium text-black w-max">
      //         {row.original?.office_name}
      //       </p>
      //     );
      //   },
      // },
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
              <p className="text-sm font-medium text-primary w-max bg-lightGreen py-1 px-2 rounded-full">
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
            {formatDateTime(row.original?.createdAt)}
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
                  if (!row.original.category_id || !row.original.self_id)
                    return;
                  setKundeId(row.original.self_id);
                  setId(row.original.category_id);
                  setIsPlacingOrder(true);
                  const formatDate = (date: Date) =>
                    date
                      .toLocaleString("sv-SE", { timeZone: "UTC" })
                      .replace(",", "");

                  try {
                    const houseData = await fetchProjectsData(
                      row.original.self_id
                    );

                    const newId = row.original.self_id;

                    const docRef = doc(db, "projects", newId);

                    if (!newConfiguratorName.trim()) {
                      setPendingPayload({
                        ...houseData,
                      });
                      setShowConfiguratorModal(true);
                      return;
                    }

                    await setDoc(docRef, {
                      ...houseData,
                      updatedAt: formatDate(new Date()),
                      name: newConfiguratorName.trim(),
                    });

                    toast.success("Bestillingen er lagt inn!", {
                      position: "top-right",
                    });
                    navigate(
                      `/Room-Configurator/${row.original.category_id}/${row.original.self_id}`
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
                  `/se-series/${row.original.parentId}/edit-husmodell/${row.original?.self_id}`
                )
              }
            />
            <Trash
              className="h-5 w-5 text-red cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                confirmDelete(row.original?.self_id);
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
  const [offices, setOffices] = useState<any>(null);

  const fetchOfficeData = async () => {
    try {
      if (selectedData?.office_id) {
        const husmodellDocRef = doc(db, "office", selectedData?.office_id);
        const docSnap = await getDoc(husmodellDocRef);

        if (docSnap.exists()) {
          setOffices(docSnap.data());
        }
      }
    } catch (error) {
      console.error("Error fetching husmodell data:", error);
    }
  };

  useEffect(() => {
    if (selectedData?.office_id) {
      fetchOfficeData();
    }
  }, [selectedData]);

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
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-2 flex gap-2 flex-col lg:flex-row lg:items-center justify-between bg-lightGreen rounded-[12px] py-3 px-4">
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
                      `/se-series/${row.original.parentId}/edit-husmodell/${row.original?.self_id}`
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
                    className="border border-primary bg-primary text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
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
            offices={offices}
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
              <span className="text-primary text-base font-medium">
                Eksporterer...
              </span>
              <div className="w-48 h-1 overflow-hidden rounded-lg">
                <div className="w-full h-full bg-primary animate-[progress_1.5s_linear_infinite] rounded-lg" />
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
            <span className="text-primary text-base font-medium">
              Overfører til Aktive tiltak...
            </span>
            <div className="w-48 h-1 overflow-hidden rounded-lg">
              <div className="w-full h-full bg-primary animate-[progress_1.5s_linear_infinite] rounded-lg" />
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
                className="bg-primary text-white"
                onClick={async () => {
                  setShowConfiguratorModal(false);
                  setIsPlacingOrder(true);

                  if (!pendingPayload) return;
                  const newId = kundeId;
                  const docRef = doc(db, "projects", String(newId));
                  const docSnap = await getDoc(docRef);
                  const formatDate = (date: Date) =>
                    date
                      .toLocaleString("sv-SE", { timeZone: "UTC" })
                      .replace(",", "");

                  let existingData = docSnap.exists() ? docSnap.data() : {};

                  let updatedKundeInfo = {
                    ...existingData,
                    placeOrder: true,
                    name: newConfiguratorName.trim(),
                    updatedAt: formatDate(new Date()),
                  };

                  await setDoc(docRef, { ...updatedKundeInfo });

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
