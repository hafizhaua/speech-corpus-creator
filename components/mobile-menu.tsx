import { Button } from "./ui/button";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AuthProfile } from "./auth-profile";
import { MyUtteranceLibrary } from "./my-utterance-library";

export default function MobileMenu() {
  return (
    <Sheet>
      <div className="w-full py-4 px-4 border-b border-muted">
        <SheetTrigger asChild>
          <Button size="icon" variant="outline">
            <Menu />
          </Button>
        </SheetTrigger>
      </div>
      <SheetContent className="flex gap-4 flex-col h-full items-center p-2 w-auto">
        <AuthProfile />
        <MyUtteranceLibrary />
      </SheetContent>
    </Sheet>
  );
}
