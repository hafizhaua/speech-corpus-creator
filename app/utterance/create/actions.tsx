"use server";

import { createClient } from "@/lib/supabase/server";

export const createUtteranceSet = async (formData: FormData) => {
  const supabase = createClient();

  const { data, error } = await supabase.from("utterance_sets").insert(body);
};
