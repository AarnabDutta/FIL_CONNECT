"use client";

import { useEffect, useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AlertTriangle, MoreHorizontal, Ban } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Layout } from "@/components/layout";
import type { Report } from "@/lib/types";
import { apiRequest } from "../apiconnector/api";
import { toast } from "sonner";

// Function to fetch user names by ID
const fetchUserName = async (userId: string) => {
  try {
    const res = await apiRequest(`users/${userId}`, "GET");
    return res?.username || "Unknown User"; // Assuming API response has a `username` field
  } catch (error) {
    console.error("Error fetching user name:", error);
    return "Unknown User";
  }
};

export default function ReportsPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllReports = async () => {
      try {
        setLoading(true);
        const res = await apiRequest("reports", "GET");

        if (!res || !Array.isArray(res)) {
          console.error("Invalid reports data:", res);
          setReports([]);
          return;
        }

        // Fetch user names for each report and determine targetType
        const updatedReports = await Promise.all(
          res.map(async (report: Report) => {
            const reportedUserName = await fetchUserName(report.reportedUserId);
            const reporterUserName = await fetchUserName(report.reporterUserId);

            return {
              ...report,
              reportedUserName,
              reporterUserName,
              targetType: report.reportedPostId ? "Post" : "User",
            };
          })
        );

        setReports(updatedReports);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllReports();
  }, []);

  // Define table columns
  const columns: ColumnDef<Report>[] = [
    {
      accessorKey: "targetType",
      header: "Type",
    },
    {
      accessorKey: "reportedUserName",
      header: "Target",
    },
    {
      accessorKey: "reason",
      header: "Reason",
    },
    {
      accessorKey: "reporterUserName",
      header: "Reported By",
    },
    {
      accessorKey: "reportStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("reportStatus") as string | undefined;

        if (!status) return <div className="text-gray-400">No status</div>;

        const getStatusColor = (status: string) => {
          switch (status.toLowerCase()) {
            case "resolved":
              return "text-green-600";
            case "dismissed":
              return "text-red-600";
            case "pending":
              return "text-yellow-600";
            default:
              return "text-gray-600";
          }
        };

        return (
          <div className={`font-medium ${getStatusColor(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const report = row.original;

        const handleWarn = async () => {
          const res = await apiRequest(`notifications/warn/${report.reportedUserId}`, "POST");
          toast.message("User warned successfully");
        };

        const handleBlock = async () => {
          const res = await apiRequest(`users/rejectUser/${report.reportedUserId}`, "PUT");
          toast.message("User blocked successfully");
        };

     

        return (
          <div className="flex items-center gap-2">
            {report.targetType?.toLowerCase() === "user" &&
              report.reportStatus?.toUpperCase() === "PENDING" && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleWarn}
                    className="h-8 w-8 text-yellow-600"
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBlock}
                    className="h-8 w-8 text-red-600"
                  >
                    <Ban className="h-4 w-4" />
                  </Button>
                </>
              )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                <DropdownMenuItem>Dismiss Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: reports,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Input
            placeholder="Filter reports..."
            value={(table.getColumn("reason")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("reason")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Loading reports...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
