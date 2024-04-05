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

type LanguageType = {
  id: string;
  lang_name: string;
  country_name?: string;
  country_code?: string;
};

interface SetProps {
  id: string;
  title: string;
  languages: {
    lang_name: string;
    country_name: string;
    country_code: string;
  };
  created_by: string;
}

export const SetList = ({ languages }: { languages: LanguageType[] }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [searchName, setSearchName] = useState<string>("");
  const [data, setData] = useState<SetProps[]>([]);

  const debouncedSearch = useDebounce(searchName, 500);

  const fetchData = async () => {
    const supabase = createClient();

    if (selectedLanguage === "all") {
      const { data, error } = await supabase
        .from("utterance_sets")
        .select(
          "id, title, languages (lang_name, country_name, country_code), created_by"
        )
        .ilike("title", `%${searchName}%`)
        .eq("is_visible", true)
        .returns<SetProps[]>();

      if (!error) setData(data);
    } else if (selectedLanguage.length > 0) {
      const { data, error } = await supabase
        .from("utterance_sets")
        .select(
          "id, title, languages (lang_name, country_name, country_code), created_by"
        )
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
                    {language.lang_name}{" "}
                    {language.country_name && `(${language.country_name})`}
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
                language={`${d.languages?.lang_name} (${d.languages.country_code})`}
                countryCode={d.languages.country_code}
                author={d.created_by}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
