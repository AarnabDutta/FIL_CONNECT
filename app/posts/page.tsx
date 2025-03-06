"use client"

import { useEffect, useState } from "react"
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
} from "@tanstack/react-table"
import { Check, X, MoreHorizontal, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Layout } from "@/components/layout"
import type { Post } from "@/lib/types"
import { apiRequest } from "../apiconnector/api"

export default function PostsPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [activeTab, setActiveTab] = useState("pending")
  const [posts, setPosts] = useState<Post[]>([]);

  // Function to fetch posts based on active tab
  const fetchPosts = async () => {
    try {
      const res = await apiRequest("posts", "GET");
      console.log(res);

      let filteredPosts = res;

      if (activeTab === "pending") {
        filteredPosts = res.filter((post: Post) => post.status === "3");
      } else if (activeTab === "approved") {
        filteredPosts = res.filter((post: Post) => post.status === "1");
      } else if (activeTab === "rejected") {
        filteredPosts = res.filter((post: Post) => post.status === "0");
      }

      setPosts(filteredPosts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeTab]); // Depend on activeTab to refetch data

  // Column definitions with updated action handlers
  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "user.username",
      header: "Author",
    },
    {
      accessorKey: "user.createdAt",
      header: "Created",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const post = row.original

        const handleApprove = async () => {
          try {
            // Add approve logic here
            const res = await apiRequest(`posts/approvePost/${post.id}`, "PUT");
            console.log(res);
            console.log("Approve post:", post.id);
            
            // Refresh the posts list after approval
            fetchPosts();
          } catch (error) {
            console.error("Failed to approve post:", error);
          }
        }

        const handleReject = async () => {
          try {
            // Add reject logic here
            const res = await apiRequest(`posts/rejectPost/${post.id}`, "PUT");
            console.log(res);
            console.log("Reject post:", post.id);
            
            // Refresh the posts list after rejection
            fetchPosts();
          } catch (error) {
            console.error("Failed to reject post:", error);
          }
        }

        return (
          <div className="flex items-center gap-2">
            {post.status === "3" && (
              <>
                <Button variant="ghost" size="icon" onClick={handleApprove} className="h-8 w-8 text-green-600">
                  <Check className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleReject} className="h-8 w-8 text-red-600">
                  <X className="h-4 w-4" />
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
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={async () => {
                    try {
                      await apiRequest(`posts/deletePost/${post.id}`, "DELETE");
                      fetchPosts(); // Refresh after deletion
                    } catch (error) {
                      console.error("Failed to delete post:", error);
                    }
                  }}
                >
                  Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: posts,
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
  })

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Input
            placeholder="Filter posts..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending" onClick={() => setActiveTab("pending")}>
              Pending
            </TabsTrigger>
            <TabsTrigger value="approved" onClick={() => setActiveTab("approved")}>
              Approved
            </TabsTrigger>
            <TabsTrigger value="rejected" onClick={() => setActiveTab("rejected")}>
              Rejected
            </TabsTrigger>
            <TabsTrigger value="all" onClick={() => setActiveTab("all")}>
              All Posts
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </Layout>
  )
}