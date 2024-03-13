import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLanguages } from "@/lib/actions/languages";
import { CreateForm } from "./create-form";

export default async function CreateSet() {
  const supabase = createClient();
  const { data: userData, error } = await supabase.auth.getUser();

  if (error || !userData?.user) {
    redirect("/login");
  }

  const languages = await getLanguages();

  return (
    <div className="p-8 py-12 md:px-10 md:py-12 space-y-4">
      <h1 className="text-2xl font-bold">Create Utterance Set</h1>
      <CreateForm languages={languages} />
    </div>
  );
}
