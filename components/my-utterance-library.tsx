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
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

interface SetProps {
  title: string;
  langcode: string;
  lang: string;
  href?: string;
}

export const MyUtteranceLibrary = async () => {
  const supabase = createClient();

  const setData: SetProps[] = [
    {
      title: "Percakapan Kota Urban",
      langcode: "ID",
      lang: "Indonesia",
    },
    {
      title: "Telecom Service Calls",
      langcode: "US",
      lang: "English (US)",
    },
    {
      title: "Esprits Expressifs",
      langcode: "FR",
      lang: "French",
    },
    {
      title: "Gespräche in der Medizin",
      langcode: "DE",
      lang: "German",
    },
  ];
  return (
    <Card className="flex flex-col w-full h-full overflow-x-hidden">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2 text-primary/75 font-bold">
          <List />
          <p className="truncate">My Utterance Sets</p>
        </CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <ScrollArea className="h-full">
        <CardContent className="flex flex-col flex-1 gap-3">
          {setData.length > 0 &&
            setData.map((d) => {
              return (
                <MyUtteranceList
                  key={d.title}
                  title={d.title}
                  langCode={d.langcode}
                  lang={d.lang}
                />
              );
            })}
          {setData.length === 0 && (
            <div className="grid place-items-center text-center text-muted-foreground mt-16 space-y-4">
              <div className="px-4 py-4 bg-muted rounded-full">
                <PackageSearch className="w-20 h-20" />
              </div>
              <div className="space-y-1">
                <h2 className="font-bold text-lg">You don't have any sets</h2>
                <p className="text-sm">
                  Browse publicly available sets or create your own set.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </ScrollArea>
      <CardFooter className="flex flex-col gap-2 pt-2">
        <Link href={"/utterance/create"} className="w-full">
          <Button className="w-full">Create New Set</Button>
        </Link>
        <Link href={"/library"} className="w-full">
          <Button className="w-full" variant={"secondary"}>
            Browse Library
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
