import { createClient } from "@/lib/supabase/server";
import React, { Suspense } from "react";
import { getLanguages } from "@/lib/actions/languages";
import { UtteranceSetForm } from "@/components/utterance-set-form";
import { notFound } from "next/navigation";
import EditSkeleton from "./loading";

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

  if (!data) notFound();

  const languages = await getLanguages();
  return (
    <Suspense fallback={<EditSkeleton />}>
      <div className="p-8 py-12 md:px-10 md:py-12 space-y-4">
        <h1 className="text-2xl font-bold">Edit Utterance Set</h1>
        <UtteranceSetForm languages={languages} initialValue={data} />
      </div>
    </Suspense>
  );
}
