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
import { Suspense, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import useDebounce from "@/lib/hooks/useDebounce";
import { PackageSearch } from "lucide-react";
import Link from "next/link";

type LanguageType = {
  id: string;
  lang_name: string;
  country_name?: string;
  country_code?: string | null;
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

export const SetList = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [searchName, setSearchName] = useState<string>("");
  const [langOptions, setLangOptions] = useState<LanguageType[]>([]);
  const [data, setData] = useState<SetProps[]>([]);

  const debouncedSearch = useDebounce(searchName, 500);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      if (selectedLanguage === "all") {
        const { data, error } = await supabase
          .from("utterance_sets")
          .select(
            "id, title, languages (lang_name, country_name, country_code), created_by"
          )
          .ilike("title", `%${debouncedSearch}%`)
          .eq("is_visible", true)
          .returns<SetProps[]>();

        if (!error) setData(data);
      } else if (selectedLanguage.length > 0) {
        const { data, error } = await supabase
          .from("utterance_sets")
          .select(
            "id, title, languages (lang_name, country_name, country_code), created_by"
          )
          .ilike("title", `%${debouncedSearch}%`)
          .eq("language_id", selectedLanguage)
          .eq("is_visible", true)
          .returns<SetProps[]>();

        if (!error) setData(data);
      }
    };
    fetchData();
  }, [debouncedSearch, selectedLanguage]);

  useEffect(() => {
    const fetchLang = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("languages")
        .select("id, lang_name, country_name, country_code");

      if (!error) {
        const allOption = [{ id: "all", lang_name: "All" }, ...data];
        setLangOptions(allOption);
      }
    };
    fetchLang();
  }, []);

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
        <Select
          onValueChange={(e) => setSelectedLanguage(e)}
          disabled={langOptions.length === 0}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {langOptions.map((language) => {
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
      <ScrollArea className="w-full h-full">
        {data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex-1">
            {data.map((d) => {
              return (
                <SetCard
                  key={d.id}
                  id={d.id}
                  title={d.title}
                  language={`${d.languages?.lang_name} (${d.languages.country_code})`}
                  countryCode={d.languages.country_code}
                  author={d.created_by}
                />
              );
            })}
          </div>
        ) : (
          <div className="w-full grid place-items-center text-center text-muted-foreground mt-16 space-y-4">
            <div className="px-4 py-4 bg-muted rounded-full">
              <PackageSearch className="w-20 h-20" />
            </div>
            <div className="space-y-1">
              <h2 className="font-bold text-lg">
                There is no public utterance sets available.
              </h2>
              <p className="text-sm">
                Please check again later or{" "}
                <Link
                  className="text-primary/80 hover:text-primary transition"
                  href="/create"
                >
                  create
                </Link>{" "}
                your own instead.
              </p>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
