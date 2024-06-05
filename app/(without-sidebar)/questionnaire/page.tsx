import { createClient } from "@/lib/supabase/server";
import MOSSession from "./mos-session";
import { getLanguages } from "@/lib/actions/languages";

const getAudios = async (lang, type, limit) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("random_audios")
    .select("id, audio_url, transcription")
    .eq("type", type)
    .eq("lang_code", lang)
    .limit(limit);

  if (!error) {
    return data;
  } else {
    console.error(error);
    return [];
  }
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default async function MOSPage() {
  const naturalIndo = await getAudios("id-ID", "natural", 15);
  const synthesizedIndo = await getAudios("id-ID", "synthesized", 15);

  const naturalEng = await getAudios("en-US", "natural", 15);
  const synthesizedEng = await getAudios("en-US", "synthesized", 15);

  // const langs = await getLanguages();

  const indoAudios = shuffleArray([...naturalIndo, ...synthesizedIndo]);
  const engAudios = shuffleArray([...naturalEng, ...synthesizedEng]);

  return <MOSSession indoAudios={indoAudios} engAudios={engAudios} />;
}
