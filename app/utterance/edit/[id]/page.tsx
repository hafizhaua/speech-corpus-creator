import SetForm from "@/components/set-form";
import React from "react";
export default function EditSet() {
  const data = {
    title: "Percakapan Kota Urban",
    description:
      "Percakapan yang biasa ditemui di kantor, toko, dan tempat umum di kota",
    language: "INA",
    utterances:
      "This is the first sentence.|The second sentence follows.|Each sentence is on a new line.|Here is the fourth sentence.|We are now at sentence number five.|Sixth sentence is here.|This is the seventh sentence.|The eighth sentence is next.|Sentence number nine.|Now we're at the tenth sentence.|Eleventh sentence coming up.|This is the twelfth sentence.|Here is the thirteenth sentence.|Fourteenth sentence is right here.|Finally, the fifteenth sentence.",
    is_public: true,
  };
  return (
    <div className="p-12 space-y-4">
      <h1 className="text-2xl font-bold">Create Utterance Set</h1>
      <SetForm initialValue={data} />
    </div>
  );
}
