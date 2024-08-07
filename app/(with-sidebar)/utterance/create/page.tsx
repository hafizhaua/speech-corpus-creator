import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLanguages } from "@/lib/actions/languages";
import { UtteranceSetForm } from "@/components/utterance-set-form";

export default async function CreateSet() {
  const supabase = createClient();
  const { data: userData, error } = await supabase.auth.getUser();

  if (error || !userData?.user) {
    redirect("/login");
  }

  const languages = await getLanguages();

  return (
    <div className="px-6 py-10  md:px-10 md:py-12 space-y-4">
      <h1 className="text-2xl font-bold">Create Utterance Set</h1>
      <UtteranceSetForm languages={languages} />
    </div>
  );
}
