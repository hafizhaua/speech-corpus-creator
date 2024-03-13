"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type FormType = {
  title: string;
  description: string;
  language_id: string;
  utterances: string;
  is_visible: boolean;
};

export const createUtteranceSet = async (body: FormType) => {
  const supabase = createClient();

  const response = await supabase.from("utterance_sets").insert(body);
  revalidatePath("/");
  return response;
};
