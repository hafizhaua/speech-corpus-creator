import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LogOutButton from "./log-out-button";
import { createClient } from "@/lib/supabase/server";
import { LogIn } from "lucide-react";
import { Link } from "next-view-transitions";

export const AuthProfile = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  const userName = data?.user?.user_metadata.name || data?.user?.email;
  const avatarUrl = data?.user?.user_metadata.avatar_url;

  const getInitial = (name: string) => {
    // Splitting the name into individual parts
    let nameParts = name.split(" ");

    // Extracting the first character of each part and joining them
    let initials = nameParts.map((part) => part[0].toUpperCase()).join("");

    return initials;
  };

  return (
    <div className="w-full">
      {data?.user ? (
        <div className="w-full overflow-hidden border rounded-lg px-6 py-2 md:py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex gap-2 md:gap-3 items-center">
              <Avatar className="w-6 h-6 md:w-8 md:h-8">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>{`${getInitial(userName)}`}</AvatarFallback>
              </Avatar>
              <p className="truncate">
                <span className="font-semibold text-sm md:text-base">
                  {userName}
                </span>
              </p>
            </Link>
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
    </div>
  );
};
