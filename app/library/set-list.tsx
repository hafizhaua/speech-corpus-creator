"use client";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SetCard } from "./set-card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import useDebounce from "@/lib/hooks/useDebounce";

interface SetListProps {
  languages: {
    id: string;
    name: string;
  }[];
}

interface SetProps {
  id: string;
  title: string;
  languages: {
    name: string;
  };
  created_by: string;
}

export const SetList: React.FC<SetListProps> = ({ languages }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [searchName, setSearchName] = useState<string>("");
  const [data, setData] = useState<SetProps[]>([]);

  const debouncedSearch = useDebounce(searchName, 500);

  const fetchData = async () => {
    const supabase = createClient();

    if (selectedLanguage === "all") {
      const { data, error } = await supabase
        .from("utterance_sets")
        .select("id, title, languages (name), created_by")
        .ilike("title", `%${searchName}%`)
        .eq("is_visible", true)
        .returns<SetProps[]>();

      if (!error) setData(data);
    } else if (selectedLanguage.length > 0) {
      const { data, error } = await supabase
        .from("utterance_sets")
        .select("id, title, languages (name), created_by")
        .ilike("title", `%${searchName}%`)
        .eq("language_id", selectedLanguage)
        .eq("is_visible", true)
        .returns<SetProps[]>();

      if (!error) setData(data);
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedSearch, selectedLanguage]);

  useEffect(() => {});

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          type="text"
          placeholder="Search utterance set name..."
          className="flex-1"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <Select onValueChange={(e) => setSelectedLanguage(e)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {languages.map((language) => {
                return (
                  <SelectItem key={language.id} value={language.id}>
                    {language.name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex-1">
          {data.map((d) => {
            return (
              <SetCard
                key={d.title}
                id={d.id}
                title={d.title}
                language={d.languages?.name}
                author={d.created_by}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
