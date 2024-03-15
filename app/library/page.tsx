import React from "react";

import { createClient } from "@/lib/supabase/server";
import { SetList } from "./set-list";

async function getLanguages() {
  const supabase = createClient();

  const { data, error } = await supabase.from("languages").select("id, name");

  if (!error) return data;

  return [];
}

export default async function UtteranceLibrary() {
  // const data = await getUtterance();
  const languages = await getLanguages();
  const selectOptions = [{ id: "all", name: "All" }, ...languages];
  return (
    <div className="p-8 py-12 md:px-10 md:py-12 flex flex-col gap-8 h-screen">
      <div className="">
        <h1 className="text-2xl font-bold mb-2">Utterance Library</h1>
        <p className="text-muted-foreground">
          Browse some utterance sets made by others that you can also use.
        </p>
      </div>
      <SetList languages={selectOptions} />
    </div>
  );
}
