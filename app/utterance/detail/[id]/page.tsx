import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DetailSet() {
  return (
    <div className="p-12 flex flex-col gap-8">
      <div className="">
        <h1 className="text-2xl font-bold mb-2">
          Percakapan Kota Urban{" "}
          <span className="ml-2 font-normal text-sm ">
            by Hafizha Ulinnuha Ahmad
          </span>
        </h1>
        <p className="text-muted-foreground">
          Conversations in urban settings, covering topics like weather, events,
          opinions, and plans.
        </p>
      </div>
      <div className="flex gap-16">
        <div className="">
          <p className="text-muted-foreground text-xs tracking-wider uppercase">
            Language
          </p>
          <h2 className="font-bold mt-1">Indonesian</h2>
        </div>
        <div className="">
          <p className="text-muted-foreground text-xs tracking-wider uppercase">
            Utterance Count
          </p>
          <h2 className="font-bold mt-1">25</h2>
        </div>
        <div className="">
          <p className="text-muted-foreground text-xs tracking-wider uppercase">
            Word Counts
          </p>
          <h2 className="font-bold mt-1">176</h2>
        </div>
        <div className="">
          <p className="text-muted-foreground text-xs tracking-wider uppercase">
            Recording Duration
          </p>
          <h2 className="font-bold mt-1">15min</h2>
        </div>
      </div>
      <div className="">
        <h2 className="mb-4 font-semibold text-muted-foreground text-lg">
          List of Utterances
        </h2>
        <div className="">
          <div className="flex flex-col gap-2">
            <div className="py-3 px-5 border rounded-md">
              <p className="text-sm">Halo, apa kabar?</p>
            </div>
            <div className="py-3 px-5 border rounded-md">
              <p className="text-sm">Cuaca hari ini sangat cerah, bukan?</p>
            </div>
            <div className="py-3 px-5 border rounded-md">
              <p className="text-sm">
                Ayo kita pergi ke kafe favorit kita untuk minum kopi.
              </p>
            </div>
            <div className="py-3 px-5 border rounded-md">
              <p className="text-sm">
                Bagaimana pendapatmu tentang gedung baru di seberang sana?
              </p>
            </div>
            <div className="py-3 px-5 border rounded-md">
              <p className="text-sm">
                Apakah kamu tahu tentang acara musik di taman kota besok?
              </p>
            </div>
          </div>
          <Pagination className="justify-end mt-2">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle className="font-semibold">Tips!</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          You can input the utterances manually or by using a .txt file
          consisting utterances separated by newline. See the{" "}
          <span className="text-primary">example</span>.
        </AlertDescription>
      </Alert>
      <Button className="w-full">Add to my library</Button>
    </div>
  );
}
