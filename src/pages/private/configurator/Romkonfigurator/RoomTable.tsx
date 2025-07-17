/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { Loader2, Pencil, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import Ic_search from "../../../../assets/images/Ic_search.svg";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { fetchAdminDataByEmail, formatDateTime } from "../../../../lib/utils";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Modal from "../../../../components/common/modal";
import Button from "../../../../components/common/button";

export const RoomTable = () => {
  const [page, setPage] = useState(1);
  const [RoomConfigurator, setRoomConfigurator] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState(null);

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

  const handleDelete = async () => {
    const husmodellDocRef = doc(db, "room_configurator", String(id));

    try {
      await deleteDoc(husmodellDocRef);

      setId(null);
      fetchRoomConfiguratorData();
      setShowConfirm(false);
      toast.success("Romkonfiguratoren er slettet!", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error deleting floor:", error);
      toast.error("Failed to delete room configurator", {
        position: "top-right",
      });
    }
  };

  const handleConfirmPopup = () => {
    if (showConfirm) {
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };

  const fetchRoomConfiguratorData = async () => {
    setIsLoading(true);
    try {
      let q = query(
        collection(db, "room_configurator"),
        orderBy("updatedAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      const data: any = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const finalData: any = IsAdmin
        ? data
        : (
            await Promise.all(
              data.map(async (item: any) => {
                const userData = await getData(item?.createDataBy?.email);

                return userData?.office === office ? item : null;
              })
            )
          ).filter((item) => item !== null);

      setRoomConfigurator(finalData);
    } catch (error) {
      console.error("Error fetching husmodell data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (IsAdmin !== null || office !== null) {
      fetchRoomConfiguratorData();
    }
  }, [office, IsAdmin]);

  const filteredData = useMemo(() => {
    return RoomConfigurator.filter((model: any) =>
      model.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [RoomConfigurator, searchTerm]);

  const [editId, setEditId] = useState<string | null>(null);
  const [editedFloorName, setEditedFloorName] = useState<string>("");

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "Navn",
        header: "Navn",
        cell: ({ row }) => (
          <div className="flex gap-2 items-center justify-between">
            <p className="text-sm font-medium text-black w-max">
              {row.original?.name}
            </p>
            <Pencil
              className="w-5 h-5 text-purple cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setEditId(row.original.id);
                setEditedFloorName(row.original.name || "");
              }}
            />
          </div>
        ),
      },
      {
        accessorKey: "Kundenavn",
        header: "Kundenavn",
        cell: ({ row }) => (
          <div className="flex gap-2 items-center justify-between">
            <p className="text-sm font-medium text-black w-max">
              {row.original?.Kundenavn ??
                row.original?.Prosjektdetaljer?.Tiltakshaver ??
                "-"}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "Anleggsadresse",
        header: "Anleggsadresse",
        cell: ({ row }) => (
          <p className="text-sm font-medium text-black w-max">
            {row.original?.Anleggsadresse ??
              row.original?.Prosjektdetaljer?.Byggeadresse ??
              "-"}
          </p>
        ),
      },
      {
        accessorKey: "Kundenummer",
        header: "BP prosjektnummer",
        cell: ({ row }) => (
          <p className="text-sm font-medium text-black w-max">
            {row.original?.Kundenummer ??
              row.original?.Prosjektdetaljer?.Kundenr ??
              "-"}
          </p>
        ),
      },
      {
        accessorKey: "Boligkonsulent",
        header: "Boligkonsulent",
        cell: ({ row }) => (
          <p className="text-sm font-medium text-black w-max">
            {row.original?.createDataBy?.name ?? "-"}
          </p>
        ),
      },
      {
        accessorKey: "Serienavn",
        header: "Serienavn",
        cell: ({ row }) => (
          <div className="flex gap-2 items-center justify-between">
            <p className="text-sm font-medium text-black w-max">
              {row.original?.husmodell_name ??
                row.original?.Prosjektdetaljer?.VelgSerie ??
                "-"}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "TypeProsjekt",
        header: "TypeProsjekt",
        cell: ({ row }) => (
          <p className="text-sm font-medium text-black w-max">
            {row.original?.TypeProsjekt ??
              row.original?.Prosjektdetaljer?.TypeProsjekt ??
              "-"}
          </p>
        ),
      },
      {
        accessorKey: "sisteoppdatertav",
        header: "Siste oppdatert av",
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
          <>
            <div className="flex items-center justify-center gap-3">
              <Pencil
                className="h-5 w-5 text-primary cursor-pointer"
                onClick={() => {
                  navigate(`/Room-Configurator/${row.original?.id}`);
                  const currIndex = 0;
                  const currVerticalIndex = 1;
                  localStorage.setItem("currIndexBolig", currIndex.toString());
                  localStorage.setItem(
                    "currVerticalIndex",
                    currVerticalIndex.toString()
                  );
                }}
              />

              <Trash
                className="h-5 w-5 text-red cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowConfirm(true);
                  setId(row.original.id);
                }}
              />
            </div>
          </>
        ),
      },
    ],
    [navigate]
  );

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
                  onClick={() => {
                    navigate(`/Room-Configurator/${row.original?.id}`);
                    const currIndex = 0;
                    const currVerticalIndex = 1;
                    localStorage.setItem(
                      "currIndexBolig",
                      currIndex.toString()
                    );
                    localStorage.setItem(
                      "currVerticalIndex",
                      currVerticalIndex.toString()
                    );
                  }}
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
                <div onClick={() => handleDelete()}>
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

      {editId && (
        <Modal onClose={() => setEditId(null)} isOpen={true}>
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] max-w-full">
              <h2 className="text-lg font-bold mb-4">Oppdater navn</h2>
              <input
                type="text"
                value={editedFloorName}
                onChange={(e) => setEditedFloorName(e.target.value)}
                className="border border-gray1 rounded px-3 py-2 w-full mb-4"
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <Button
                  text="Avbryt"
                  className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px]"
                  onClick={() => setEditId(null)}
                />
                <Button
                  text="Oppdater"
                  className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-3 py-[10px]"
                  onClick={async () => {
                    try {
                      const husmodellDocRef = doc(
                        db,
                        "room_configurator",
                        String(editId)
                      );
                      await updateDoc(husmodellDocRef, {
                        name: editedFloorName,
                        updatedAt: new Date().toISOString(),
                      });

                      setRoomConfigurator((prev: any) =>
                        prev.map((room: any) =>
                          String(room.id) === String(editId)
                            ? { ...room, name: editedFloorName }
                            : room
                        )
                      );

                      toast.success("Navn oppdatert!", {
                        position: "top-right",
                      });
                      setEditId(null);
                    } catch (err) {
                      console.error("Failed to update:", err);
                      toast.error("Kunne ikke oppdatere navn.", {
                        position: "top-right",
                      });
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
