import { createClient } from "@/lib/supabase/server";
import MOSSession from "./mos-session";

const getNaturalIndoAudio = async () => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("random_audios")
    .select("id, audio_url, transcription")
    .eq("type", "natural")
    .eq("lang_code", "id-ID")
    .limit(1);

  if (!error) {
    return data;
  } else {
    console.error(error);
    return [];
  }
};

const getSynthesizedIndoAudio = async () => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("random_audios")
    .select("id, audio_url, transcription")
    .eq("type", "synthesized")
    .eq("lang_code", "id-ID")
    .limit(1);

  if (!error) {
    return data;
  } else {
    console.error(error);
    return [];
  }
};

const getNaturalEngAudio = async () => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("random_audios")
    .select("id, audio_url, transcription")
    .eq("type", "natural")
    .eq("lang_code", "en-US")
    .limit(1);

  if (!error) {
    return data;
  } else {
    console.error(error);
    return [];
  }
};

const getSynthesizedEngAudio = async () => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("random_audios")
    .select("id, audio_url, transcription")
    .eq("type", "synthesized")
    .eq("lang_code", "en-US")
    .limit(1);

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
  const naturalIndo = await getNaturalIndoAudio();
  const synthesizedIndo = await getSynthesizedIndoAudio();

  const naturalEng = await getNaturalEngAudio();
  const synthesizedEng = await getSynthesizedEngAudio();

  const indoAudios = shuffleArray([...naturalIndo, ...synthesizedIndo]);
  const engAudios = shuffleArray([...naturalEng, ...synthesizedEng]);

  // console.log("indo:", indoAudios);
  // console.log("eng:", engAudios);

  return <MOSSession indoAudios={indoAudios} engAudios={engAudios} />;
}
