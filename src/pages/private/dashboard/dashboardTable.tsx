import { Ellipsis, Loader2 } from "lucide-react";
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
import { useEffect, useMemo, useState } from "react";
import Ic_husmodell from "../../../assets/images/Ic_husmodell.svg";
import Ic_Leverandor from "../../../assets/images/Ic_Leverandor.svg";
import Ic_map from "../../../assets/images/Ic_map.svg";
import Ic_search from "../../../assets/images/Ic_search.svg";
import Ic_filter from "../../../assets/images/Ic_filter.svg";
import Ic_download from "../../../assets/images/Ic_download.svg";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import { convertTimestamp } from "../../../lib/utils";

export const DashboardTable = () => {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSuppliersData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const data: any = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users data:", error);
    }
  };

  const filteredData = useMemo(() => {
    return users.filter((model: any) => {
      const name = model?.name?.toLowerCase() || "";
      return name.includes(searchTerm.toLowerCase());
    });
  }, [users, searchTerm]);

  useEffect(() => {
    fetchSuppliersData();
  }, []);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "kunde",
        header: "Kunde",
        cell: ({ row }) => (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center border-gray1 border bg-gray3">
              {row.original.name[0]}
            </div>
            <div>
              <p className="font-medium text-black text-sm mb-[2px]">
                {row.original.name}
              </p>
              <p className="text-xs text-gray">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "husmodell",
        header: "Husmodell",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <img
              src={Ic_husmodell}
              alt="Husmodell"
              className="w-8 h-8 rounded-full"
            />
            <p className="font-medium text-sm text-darkBlack">ST 66</p>
          </div>
        ),
      },
      {
        accessorKey: "leverandor",
        header: "Leverandør",
        cell: ({ row }) => (
          <img src={Ic_Leverandor} alt="leverandor" className="h-5" />
        ),
      },
      {
        accessorKey: "adresse",
        header: "Adresse",
        cell: ({ row }) => (
          <div className="flex items-start gap-3">
            <img src={Ic_map} alt="map" className="w-8 h-8 rounded-full" />
            <div>
              <p className="font-medium text-black text-sm mb-[2px]">
                Sokkabekveien 77
              </p>
              <p className="text-xs text-gray">3478 Nærsnes</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "leadSent",
        header: "Lead sendt",
        cell: ({ row }) => (
          <p className="text-sm font-semibold text-black">
            {row.original.createdAt
              ? convertTimestamp(
                  row.original.createdAt?.seconds,
                  row.original.createdAt?.nanoseconds
                )
              : "-"}
          </p>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span className="px-3 py-1 rounded-full bg-[#F1F2FF] text-[#02107A] text-xs font-semibold">
            Tilbud sendt
          </span>
        ),
      },
      {
        id: "handling",
        header: "Handling",
        cell: () => (
          <button className="h-8 w-8 flex items-center justify-center">
            <Ellipsis className="h-4 w-4 text-gray-500" />
          </button>
        ),
      },
    ],
    []
  );

  const pageSize = 6;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [page, filteredData]);

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
      <div className="mb-2 flex items-center justify-between bg-lightPurple rounded-[12px] py-3 px-4">
        <div className="flex items-center border border-gray1 shadow-shadow1 bg-[#fff] gap-2 rounded-lg py-[10px] px-[14px]">
          <img src={Ic_search} alt="search" />
          <input
            type="text"
            placeholder="Søk i leads"
            className="focus-within:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 items-center">
          <div className="border border-gray1 rounded-[8px] flex gap-2 items-center py-[10px] px-4 cursor-pointer shadow-shadow1 h-[40px] bg-[#fff]">
            <img src={Ic_download} alt="" />
            <span className="text-black font-medium text-sm">Eksporter</span>
          </div>
          <div className="border border-gray1 rounded-[8px] flex gap-2 items-center py-[10px] px-4 cursor-pointer shadow-shadow1 h-[40px] bg-[#fff]">
            <img src={Ic_filter} alt="" />
            <span className="text-black font-medium text-sm">Filter</span>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-gray2 shadow-shadow2 overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header: any) => (
                  <TableHead key={header.id} className="h-8 text-sm">
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
            {users.length === 0 ? (
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
                  className="hover:bg-muted/50"
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
    </>
  );
};
