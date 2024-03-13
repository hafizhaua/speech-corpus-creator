import SetForm from "@/components/set-form";
import { createClient } from "@/lib/supabase/server";
import React from "react";
import { EditForm } from "./edit-form";
import { getLanguages } from "@/lib/actions/languages";

type SetType = {
  title: string;
  description: string;
  language_id: string;
  utterances: string;
  is_visible: boolean;
};

const getUtteranceSet = async (id: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("utterance_sets")
    .select("id, title, description, language_id, utterances, is_visible")
    .eq("id", id)
    .returns<SetType>()
    .single();

  if (!error) return data;

  return null;
};
export default async function EditSet({
  params: { id },
}: {
  params: { id: string };
}) {
  const data = await getUtteranceSet(id);
  const languages = await getLanguages();
  return (
    <div className="p-8 py-12 md:px-10 md:py-12 space-y-4">
      <h1 className="text-2xl font-bold">Edit Utterance Set</h1>

      <EditForm languages={languages} initialValue={data} />
    </div>
  );
}
