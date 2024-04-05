"use server";

import { createClient } from "../supabase/server";
type LanguagesType = {
  id: string;
  lang_name: string;
  country_name: string;
  lang_code: string;
  country_code: string;
};

export const getLanguages = async () => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("languages")
    .select("id, country_name, lang_name, lang_code, country_code")
    .order("lang_name", { ascending: true })
    .returns<LanguagesType[]>();

  if (!error) return data;

  return [];
};
