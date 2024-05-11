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
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "../ui/button";

export const SkeletonUtteranceLibrary = async () => {
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
            {Array(5)
              .fill(0)
              .map((_, i) => {
                return <Skeleton className="h-10 w-full"></Skeleton>;
              })}
          </div>
        </CardContent>
      </ScrollArea>
      <CardFooter className="h-fit flex flex-col gap-2 pt-2"></CardFooter>

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
