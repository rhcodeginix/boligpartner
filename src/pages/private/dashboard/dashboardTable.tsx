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
import { useMemo, useState } from "react";
import Ic_Avatar from "../../../assets/images/Ic_Avatar.svg";
import Ic_husmodell from "../../../assets/images/Ic_husmodell.svg";
import Ic_Leverandor from "../../../assets/images/Ic_Leverandor.svg";
import Ic_map from "../../../assets/images/Ic_map.svg";
import Ic_search from "../../../assets/images/Ic_search.svg";
import Ic_filter from "../../../assets/images/Ic_filter.svg";
import Ic_download from "../../../assets/images/Ic_download.svg";

const data = [
  {
    id: 1,
    kunde: "Simen Wolmer",
    email: "Simen@gmail.com",
    husmodell: "ST 66",
    leverandor: Ic_Leverandor,
    adresse: "Sokkabekveien 77",
    adresse2: "3478 Nærsnes",
    avatar: Ic_Avatar,
    leadSent: "5. mars 2025",
    status: "Lead sendt",
    Husmodell: Ic_husmodell,
    map_image: Ic_map,
  },
  {
    id: 2,
    kunde: "Eskil Pedersen",
    email: "eskilpedersen@gmail.com",
    husmodell: "Banktips",
    leverandor: Ic_Leverandor,
    adresse: "Sokkabekveien 77",
    adresse2: "3478 Nærsnes",
    leadSent: "5. mars 2025",
    avatar: Ic_Avatar,
    Husmodell: Ic_husmodell,
    map_image: Ic_map,
    status: "Tilbud sendt",
  },
  {
    id: 3,
    kunde: "Eskil Pedersen",
    email: "eskilpedersen@gmail.com",
    husmodell: "Banktips",
    leverandor: Ic_Leverandor,
    adresse: "Sokkabekveien 77",
    adresse2: "3478 Nærsnes",
    leadSent: "5. mars 2025",
    avatar: Ic_Avatar,
    Husmodell: Ic_husmodell,
    map_image: Ic_map,
    status: "Tilbud sendt",
  },
  {
    id: 4,
    kunde: "Eskil Pedersen",
    email: "eskilpedersen@gmail.com",
    husmodell: "Banktips",
    leverandor: Ic_Leverandor,
    adresse: "Sokkabekveien 77",
    adresse2: "3478 Nærsnes",
    leadSent: "5. mars 2025",
    avatar: Ic_Avatar,
    Husmodell: Ic_husmodell,
    map_image: Ic_map,
    status: "Tilbud sendt",
  },
];

export const DashboardTable = () => {
  const [page, setPage] = useState(1);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "kunde",
        header: "Kunde",
        cell: ({ row }) => (
          <div className="flex items-start gap-3">
            <img
              src={row.original.avatar}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="font-medium text-black text-sm mb-[2px]">
                {row.original.kunde}
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
              src={row.original.Husmodell}
              alt="Husmodell"
              className="w-8 h-8 rounded-full"
            />
            <p className="font-medium text-sm text-darkBlack">
              {row.original.husmodell}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "leverandor",
        header: "Leverandør",
        cell: ({ row }) => (
          <img src={row.original.leverandor} alt="leverandor" className="h-5" />
        ),
      },
      {
        accessorKey: "adresse",
        header: "Adresse",
        cell: ({ row }) => (
          <div className="flex items-start gap-3">
            <img
              src={row.original.map_image}
              alt="map"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="font-medium text-black text-sm mb-[2px]">
                {row.original.adresse}
              </p>
              <p className="text-xs text-gray">{row.original.adresse2}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "leadSent",
        header: "Lead sendt",
        cell: ({ row }) => (
          <p className="text-sm font-semibold text-black">
            {row.original.leadSent}
          </p>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span className="px-3 py-1 rounded-full bg-[#F1F2FF] text-[#02107A] text-xs font-semibold">
            {row.original.status}
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

  const pageSize = 10;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [page]);

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
    pageCount: Math.ceil(data.length / pageSize),
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
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
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
