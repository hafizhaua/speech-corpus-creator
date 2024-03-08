"use client";

import React from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";
import { redirect, useRouter } from "next/navigation";

export default function LogOutButton() {
  const router = useRouter();
  const handleLogout = async () => {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
    }
    console.log("Logged out");
    router.push("/");
    router.refresh();
  };

  return (
    <Button variant="outline" size="icon" onClick={handleLogout}>
      <LogOut className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Log Out</span>
    </Button>
  );
}
