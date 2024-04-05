"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Trash } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useUtteranceSetStore from "./store";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Utterance = {
  id: string;
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
    cell: ({ row, table }) => {
      const { deleteUtterance, updateUtterance, addUtterance } =
        useUtteranceSetStore();
      const [newUtterance, setNewUtterance] = useState("");
      const [editedUtterance, setEditedUtterance] = useState(row.original.text);
      const isLastRow =
        table.getRowModel().rows.length - 1 ===
        table.getRowModel().rows.indexOf(row);

      console.log();
      return (
        <div className="flex gap-8 relative">
          {/* <span className="text-yellow-500">Edit</span> */}
          <div className="space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                {/* <Button variant="outline" type="button">
                  Edit
                </Button> */}

                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  className="w-9 h-9 border-yellow-900"
                >
                  <Pencil className="w-4 h-4 text-yellow-500" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit this utterance</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex gap-4">
                    {/* <Label htmlFor="utterance" className="text-left">
                        Utterance
                      </Label> */}
                    <Input
                      id="utterance"
                      value={editedUtterance}
                      onChange={(e) => setEditedUtterance(e.target.value)}
                      placeholder="I'm cooking a fried rice."
                    />

                    <DialogClose asChild>
                      <Button
                        onClick={() =>
                          updateUtterance(editedUtterance, row.original.id)
                        }
                      >
                        Edit
                      </Button>
                    </DialogClose>
                  </div>
                </div>
                <DialogFooter></DialogFooter>
              </DialogContent>
            </Dialog>

            {/* <Button
              type="button"
              variant="outline"
              onClick={() => deleteUtterance(row.original.id)}
            >
              Delete
            </Button> */}
            <Button
              variant="outline"
              size="icon"
              type="button"
              className="w-9 h-9 border-red-900"
              onClick={() => deleteUtterance(row.original.id)}
            >
              <Trash className="w-4 h-4 text-red-500" />
            </Button>
          </div>

          {!isLastRow && (
            <Dialog>
              <DialogTrigger asChild>
                {/* <Button variant="outline" type="button">
                Add new below
              </Button> */}
                <Button
                  variant="outline"
                  size="icon"
                  className="w-9 h-9 relative top-9"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add new utterance</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex gap-4">
                    {/* <Label htmlFor="utterance" className="text-left">
                        Utterance
                      </Label> */}
                    <Input
                      id="utterance"
                      value={newUtterance}
                      onChange={(e) => setNewUtterance(e.target.value)}
                      placeholder="I'm cooking a fried rice."
                    />

                    <DialogClose asChild>
                      <Button
                        onClick={() =>
                          addUtterance(newUtterance, row.original.id)
                        }
                        type="button"
                      >
                        Add
                      </Button>
                    </DialogClose>
                  </div>
                </div>
                <DialogFooter></DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* <span className="text-red-500">Delete</span> */}
        </div>
      );
    },
  },
];
