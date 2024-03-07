import SetForm from "@/components/set-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CreateSet() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div className="p-8 py-12 md:px-10 md:py-12 space-y-4">
      <h1 className="text-2xl font-bold">Create Utterance Set</h1>
      <SetForm />
    </div>
  );
}
