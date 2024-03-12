import SetForm from "@/components/set-form";
import { createClient } from "@/lib/supabase/server";
import React from "react";

const getUtteranceSet = async (id: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("utterance_sets")
    .select("title, description, language_id, utterances, is_visible")
    .eq("id", id).returns();

  if (!error) return data;

  return null;
};
export default async function EditSet({
  params: { id },
}: {
  params: { id: string };
}) {
  const data = await getUtteranceSet(id);
  console.log(data);
  // const data = {
  //   title: "Percakapan Kota Urban",
  //   description:
  //     "Percakapan yang biasa ditemui di kantor, toko, dan tempat umum di kota",
  //   language_id: "INA",
  //   utterances:
  //     "This is the first sentence.|The second sentence follows.|Each sentence is on a new line.|Here is the fourth sentence.|We are now at sentence number five.|Sixth sentence is here.|This is the seventh sentence.|The eighth sentence is next.|Sentence number nine.|Now we're at the tenth sentence.|Eleventh sentence coming up.|This is the twelfth sentence.|Here is the thirteenth sentence.|Fourteenth sentence is right here.|Finally, the fifteenth sentence.",
  //   is_visible: true,
  // };
  return (
    <div className="p-8 py-12 md:px-10 md:py-12 space-y-4">
      <h1 className="text-2xl font-bold">Create Utterance Set</h1>
      <SetForm initialValue={data} />
    </div>
  );
}
