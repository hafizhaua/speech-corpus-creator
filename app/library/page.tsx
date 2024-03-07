import React from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SetCard } from "./components/set-card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UtteranceLibrary() {
  return (
    <div className="p-8 py-12 md:px-10 md:py-12 flex flex-col gap-8 h-screen">
      <div className="">
        <h1 className="text-2xl font-bold mb-2">Utterance Library</h1>
        <p className="text-muted-foreground">
          Browse some utterance sets made by others that you can also use.
        </p>
      </div>
      <div className="flex gap-4">
        <Input
          type="text"
          placeholder="Search utterance set name..."
          className="flex-1"
        />
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="ar">Arabic</SelectItem>
              <SelectItem value="uk">English (UK)</SelectItem>
              <SelectItem value="us">English (US)</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
              <SelectItem value="id">Indonesian</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Language
              <ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="end">
            <Command>
              <CommandInput placeholder="Select language..." />
              <CommandList>
                <CommandEmpty>No roles found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem className="flex flex-col items-start px-4 py-2">
                    <p>Afghanistan</p>
                  </CommandItem>
                  <CommandItem className="flex flex-col items-start px-4 py-2">
                    <p>Albania</p>
                  </CommandItem>
                  <CommandItem className="flex flex-col items-start px-4 py-2">
                    <p>Algeria</p>
                  </CommandItem>
                  <CommandItem className="flex flex-col items-start px-4 py-2">
                    <p>Andorra</p>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover> */}
      </div>
      <ScrollArea className="h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex-1">
          <SetCard />
          <SetCard />
          <SetCard />
          <SetCard />
          <SetCard />
          <SetCard />
          <SetCard />
          <SetCard />
          <SetCard />
          <SetCard />
          <SetCard />
          <SetCard />
          <SetCard />
          <SetCard />
        </div>
      </ScrollArea>
    </div>
  );
}
