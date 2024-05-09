import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { List, PackageSearch } from "lucide-react";
import { Button } from "./ui/button";
import { MyUtteranceList } from "./my-utterance-list";
import { Link } from "next-view-transitions";
import { createClient } from "@/lib/supabase/server";

interface SetProps {
  id: number;
  title: string;
  languages: {
    lang_name: string;
    country_name: string;
    country_code: string;
  };
}

export const MyUtteranceLibrary = async () => {
  const supabase = createClient();

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  const { data: setData, error } = await supabase
    .from("utterance_sets")
    .select("id, title, languages ( lang_name, country_name, country_code )")
    .eq("user_id", sessionData.session?.user.id || "")
    .order("updated_at")
    .returns<SetProps[]>();

  return (
    <Card className="flex-1 flex flex-col justify-between w-full h-full overflow-hidden">
      <CardHeader className="">
        <CardTitle className="text-sm md:text-base flex items-center gap-2 text-muted-foreground font-bold">
          <List className="w-4 h-4 md:w-6 md:h-6" />
          <p className="truncate">My Utterance Sets</p>
        </CardTitle>
      </CardHeader>

      <ScrollArea className="flex-1">
        <CardContent className="h-full">
          <div className="flex flex-col gap-3">
            {!error && setData?.length > 0 ? (
              setData?.map((d) => {
                return (
                  <MyUtteranceList
                    id={d.id.toString()}
                    key={d.id}
                    title={d.title}
                    countryCode={d.languages.country_code}
                    lang={`${d.languages.lang_name}`}
                  />
                );
              })
            ) : (
              <div className="grid place-items-center text-center text-muted-foreground mt-16 space-y-4">
                <div className="px-4 py-4 bg-muted rounded-full">
                  <PackageSearch className="w-20 h-20" />
                </div>
                <div className="space-y-1">
                  <h2 className="font-bold text-lg">
                    You don&apos;t have any sets
                  </h2>
                  <p className="text-sm">
                    Browse publicly available sets or create your own set.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </ScrollArea>
      <CardFooter className="h-fit flex flex-col gap-2 pt-2">
        <Link href={"/utterance/create"} className="w-full">
          <Button className="w-full" variant="default">
            Create New Set
          </Button>
        </Link>
        <Link href={"/library"} className="w-full">
          <Button className="w-full" variant={"outline"}>
            Browse Library
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
