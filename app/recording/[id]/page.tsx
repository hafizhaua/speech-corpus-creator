import React from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Session } from "./session";
import { v4 } from "uuid";
import { generateShortId } from "./utils";

type UtteranceRecordingType = {
  user_id: string;
  is_visible: boolean;
  utterances: string;
  languages: {
    lang_code: string;
  };
};

const getUtterances = async (id: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("utterance_sets")
    .select("user_id, is_visible, utterances, languages (lang_code)")
    .eq("id", id)
    .returns<UtteranceRecordingType[]>()
    .single();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (
    !error &&
    !userError &&
    (userData?.user.id === data?.user_id || data?.is_visible)
  ) {
    const utterancesString = data?.utterances;
    const utterancesArray = utterancesString.split("|");

    const utteranceArray = utterancesArray.map((utt: string, idx: number) => {
      return {
        id: v4(),
        text: utt.trim(),
      };
    });

    const result = {
      lang_code: data?.languages.lang_code,
      utterances: utteranceArray,
    };

    return result;
  }

  return null;
};
export default async function RecordingPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const data = await getUtterances(id);

  if (!data) notFound();

  return (
    <div className="">
      <Session utterances={data.utterances} langCode={data.lang_code} />
    </div>
  );
}
