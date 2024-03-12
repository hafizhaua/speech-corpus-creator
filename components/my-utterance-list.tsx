import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import Link from "next/link";

interface UtteranceListProps {
  id: number;
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
  return (
    <div className="flex justify-between items-center gap-2">
      <Link href={"/utterance/1"} className="group">
        <div className="truncate">
          <h2 className="truncate font-semibold text-primary/90 mb-1 group-hover:text-primary transition">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            <ReactCountryFlag countryCode={langCode} svg />
            <span className="truncate text-primary/50 group-hover:text-primary/75 transition text-sm">
              {lang}
            </span>
          </div>
        </div>
      </Link>
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
          <Link href={"/utterance/delete/1"}>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
