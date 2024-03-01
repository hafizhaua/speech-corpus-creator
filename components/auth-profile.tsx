import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./mode-toggle";
// import { LogOut } from "lucide-react";

export const AuthProfile = () => {
  return (
    // <DropdownMenu>
    //   <DropdownMenuTrigger className="w-full overflow-hidden border rounded-lg flex items-center justify-between px-6 py-4">
    <div className="w-full overflow-hidden border rounded-lg flex items-center justify-between px-6 py-4">
      <div className="flex gap-3 items-center">
        <Avatar className="w-8 h-8">
          <AvatarImage src="/images/hua.png" />
          <AvatarFallback>HUA</AvatarFallback>
        </Avatar>
        <p className="truncate font-semibold">Hafizha Ulinnuha Ahmad</p>
      </div>
      <ModeToggle />
    </div>
    // </DropdownMenuTrigger>
    // <DropdownMenuContent className="w-full">
    //   <DropdownMenuLabel>My Account</DropdownMenuLabel>
    //   <DropdownMenuSeparator />
    //   <DropdownMenuItem>Logout</DropdownMenuItem>
    // </DropdownMenuContent>
    // </DropdownMenu>
  );
};
