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
import { createClient } from "@/lib/supabase/server";

async function getUtterance() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("utterance_sets")
    .select("title, languages (name)")
    .eq("is_visible", true);

  if (!error) return data;

  return [];
}

async function getLanguages() {
  const supabase = createClient();

  const { data, error } = await supabase.from("languages").select("id, name");

  if (!error) return data;

  return [];
}

export default async function UtteranceLibrary() {
  const data = await getUtterance();
  const languages = await getLanguages();

  console.log(data);
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
              {languages.map((language) => {
                return (
                  <SelectItem key={language.id} value={language.name}>
                    {language.name}
                  </SelectItem>
                );
              })}
              {/* <SelectItem value="ar">Arabic</SelectItem>
              <SelectItem value="uk">English (UK)</SelectItem>
              <SelectItem value="us">English (US)</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
              <SelectItem value="id">Indonesian</SelectItem> */}
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
          {data.map((d) => {
            return (
              <SetCard
                key={d.title}
                title={d.title}
                language={d.languages?.name}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
