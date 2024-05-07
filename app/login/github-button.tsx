"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Github } from "lucide-react";
import React from "react";

export const GithubButton = () => {
  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
      "http://localhost:3000/";
    // Make sure to include `https://` when not localhost.
    url = url.includes("http") ? url : `https://${url}`;
    // Make sure to include a trailing `/`.
    url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
    return url;
  };

  const loginWithGithub = () => {
    const supabase = createClient();

    supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: getURL() + "/auth/callback",
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
