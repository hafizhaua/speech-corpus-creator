import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { List } from "lucide-react";
import { Button } from "./ui/button";
import { MyUtteranceList } from "./my-utterance-list";
import Link from "next/link";

export const MyUtteranceLibrary = () => {
  const data = [
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
          {data.map((d) => {
            return (
              <MyUtteranceList
                key={d.title}
                title={d.title}
                langCode={d.langcode}
                lang={d.lang}
              />
            );
          })}
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
