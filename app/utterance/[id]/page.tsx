import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { UtteranceList } from "./utterance-list";
import SetMetadata from "./set-metadata";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import UtteranceSkeleton from "./loading";

interface SetType {
  title: string;
  description: string;
  languages: {
    lang_name: string;
  };
  utterances: string;
  is_visible: boolean;
  user_id: string;
}

const getUtteranceSet = async (id: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("utterance_sets")
    .select(
      "id, title, description, languages (lang_name), utterances, user_id"
    )
    .eq("id", id)
    .returns<SetType[]>()
    .single();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (!error && !userError && userData?.user.id === data?.user_id) return data;

  return null;
};

export default async function Utterance({
  params: { id },
}: {
  params: { id: string };
}) {
  const data = await getUtteranceSet(id);

  if (!data) notFound();

  return (
    <Suspense fallback={<UtteranceSkeleton />}>
      <div className="p-8 py-12 md:px-10 md:py-12 flex flex-col gap-8">
        <Header title={data?.title} description={data?.description} />
        <SetMetadata
          language={data?.languages?.lang_name}
          utterances={data?.utterances}
        />
        <UtteranceList utterancesString={data?.utterances || ""} />
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-semibold">Attention!</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            Ensure your recordings are authentic and diverse, with clear
            enunciations, varying lengths, and minimal background noise for a
            natural and engaging performance.
          </AlertDescription>
        </Alert>
        <Link href={`/recording/${id}`}>
          <Button className="w-full">Start recording</Button>
        </Link>
      </div>
    </Suspense>
  );
}

const Header = ({
  title,
  description,
}: {
  title: string | null;
  description: string | null;
}) => {
  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
