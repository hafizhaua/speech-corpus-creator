import React from "react";
import RecordingSession from "./recording-session";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const getUtterances = async (id: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("utterance_sets")
    .select("user_id, is_visible, utterances")
    .eq("id", id)
    .single();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (
    !error &&
    !userError &&
    (userData?.user.id === data?.user_id || data?.is_visible)
  ) {
    const utterancesString = data?.utterances;
    const utterancesArray = utterancesString.split("|");

    return utterancesArray;
  }

  return null;
};
export default async function RecordingPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const data = await getUtterances(id);

  console.log(data);

  if (!data) notFound();

  return (
    <div className="p-8 md:px-10 md:py-32 min-h-screen flex flex-col gap-12 items-center">
      <RecordingSession utterances={data} />
    </div>
  );
}
