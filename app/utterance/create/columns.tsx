"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Utterance = {
  id: number | string;
  text: string;
};

export const columns: ColumnDef<Utterance>[] = [
  {
    accessorKey: "text",
    header: "Utterance",
  },
  {
    header: "Action",
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-4">
          <span className="text-yellow-500">Edit</span>
          <span className="text-red-500">Delete</span>
        </div>
      );
    },
  },
];
