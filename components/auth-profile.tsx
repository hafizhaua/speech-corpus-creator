import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LogOutButton from "./log-out-button";
import { createClient } from "@/lib/supabase/server";
import { LogIn } from "lucide-react";
import Link from "next/link";

export const AuthProfile = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  const extractUsername = (email: string) =>
    (email.match(/^([^@]+)@/) || [])[1];

  return (
    <>
      {data?.user ? (
        <div className="w-full overflow-hidden border rounded-lg px-6 py-4">
          <div className="flex items-center justify-between ">
            <div className="flex gap-3 items-center">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/images/hua.png" />
                <AvatarFallback>HUA</AvatarFallback>
              </Avatar>
              <p className="truncate font-semibold">
                {extractUsername(data?.user.email || "")}
              </p>
            </div>
            <LogOutButton />
          </div>
        </div>
      ) : (
        <Link href="/login" className="w-full">
          <div className="w-full overflow-hidden border rounded-lg px-6 py-4 justify-start hover:bg-muted transition">
            <div className="flex items-center justify-between ">
              <div className="flex gap-3 items-center">
                <LogIn className="h-[1.2rem] w-[1.2rem]" />
                <p className="truncate">Login/Register</p>
              </div>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};
