"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import Link from "next/link";
import DeleteAlert from "./delete-alert";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UtteranceListProps {
  id: string;
  title: string;
  langCode: string;
  lang: string;
  href?: string;
}

export const MyUtteranceList: React.FC<UtteranceListProps> = ({
  id,
  title,
  lang,
  langCode,
  href,
}) => {
  const router = useRouter();
  const handleDelete = async (id: string) => {
    console.log("Deleting ", id);
    const supabase = createClient();

    const { error } = await supabase
      .from("utterance_sets")
      .delete()
      .eq("id", id);

    if (!error) {
      toast.success("Your set has been deleted successfully");
      router.refresh();
    } else {
      toast.error("Something wrong");
    }
  };
  return (
    <div className="flex justify-between items-center gap-2">
      <Link href={`/utterance/${id}`} className="group">
        <div className="truncate">
          <h2 className="truncate font-semibold text-primary/90 mb-1 group-hover:text-primary transition">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            <ReactCountryFlag countryCode={langCode} />
            <span className="truncate text-primary/50 group-hover:text-primary/75 transition text-sm">
              {lang}
            </span>
          </div>
        </div>
      </Link>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="text-primary/50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={"/utterance/edit/" + id}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(id)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
