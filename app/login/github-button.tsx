"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Github } from "lucide-react";
import React from "react";

export const GithubButton = () => {
  const loginWithGithub = () => {
    const supabase = createClient();

    supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback/`,
      },
    });
  };
  return (
    <Button
      onClick={loginWithGithub}
      variant={"outline"}
      className="flex gap-2 items-center"
    >
      <Github className="w-4 h-4" />
      GitHub
    </Button>
  );
};
