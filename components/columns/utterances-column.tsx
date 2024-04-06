"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Trash } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { useCallback, useRef, useState } from "react";
import useUtteranceSetStore from "@/lib/hooks/useUtteranceSetStore";

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
    cell: function Cell({ row, table }) {
      const { deleteUtterance, updateUtterance, addUtterance } =
        useUtteranceSetStore();
      const editRef = useRef<HTMLButtonElement>(null);
      const addRef = useRef<HTMLButtonElement>(null);

      const [newUtterance, setNewUtterance] = useState("");
      const [editedUtterance, setEditedUtterance] = useState(row.original.text);

      const isLastRow =
        table.getRowModel().rows.length - 1 ===
        table.getRowModel().rows.indexOf(row);

      const handleKeyDownEdit = useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key === "Enter" && editRef.current) {
            editRef.current.click();
          }
        },
        []
      );

      const handleKeyDownAdd = useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key === "Enter" && addRef.current) {
            addRef.current.click();
          }
        },
        []
      );
      return (
        <div className="flex gap-8 relative">
          <div className="space-x-2">
            <Dialog>
              <DialogTrigger asChild>
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
                    <Input
                      id="utterance"
                      value={editedUtterance}
                      onKeyDown={handleKeyDownEdit}
                      onChange={(e) => setEditedUtterance(e.target.value)}
                      placeholder="I'm cooking a fried rice."
                    />

                    <DialogClose asChild>
                      <Button
                        ref={editRef}
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
                    <Input
                      id="utterance"
                      value={newUtterance}
                      onChange={(e) => setNewUtterance(e.target.value)}
                      onKeyDown={handleKeyDownAdd}
                      placeholder="I'm cooking a fried rice."
                    />

                    <DialogClose asChild>
                      <Button
                        ref={addRef}
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
