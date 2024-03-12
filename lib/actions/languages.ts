"use server";

import { createClient } from "../supabase/server";

export const getLanguages = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.from("languages").select("id, name");

  if (!error) return data;

  return [];
};
