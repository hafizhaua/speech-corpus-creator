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

export const updateUtteranceSet = async (body: FormType, id: string) => {
  const supabase = createClient();

  const response = await supabase
    .from("utterance_sets")
    .update(body)
    .eq("id", id)
    .select();

  revalidatePath("/");
  return response;
};

export const createUtteranceSet = async (body: FormType) => {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();

  const response = await supabase
    .from("utterance_sets")
    .insert({ created_by: userData?.user?.user_metadata.name, ...body })
    .select();
  revalidatePath("/");
  return response;
};
