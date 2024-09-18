"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export type Job = {
  id: string;
  applied: boolean | null;
  title: string | null;
  url: string;
};

export const columns: ColumnDef<Job>[] = [
  {
    id: "select",
    accessorKey: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "applied",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Applied
          {!column.getIsSorted() ? (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const applied = Boolean(row.getValue("applied"));
      const variant = applied ? "default" : "destructive";
      const text = applied ? "Applied" : "Not Applied";

      return (
        <Badge variant={variant} size="sm">
          {text}
        </Badge>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          {!column.getIsSorted() ? (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "url",
    header: "URL",
  },
];
