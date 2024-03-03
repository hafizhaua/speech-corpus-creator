"use client";

import React, { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Lightbulb, Upload } from "lucide-react";
import { Utterance, columns } from "../app/utterance/create/columns";
import { DataTable } from "./data-table";
import { Switch } from "@/components/ui/switch";
import { readFileAsync } from "@/lib/utils";

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  language: z.string(),
  utterances: z.string(),
  is_public: z.boolean(),
});

interface SetFormProps {
  initialValue?: {
    title: string;
    description: string;
    language: string;
    // utterances: UtterancesType[];
    utterances: string;
    is_public: boolean;
  };
}

type UtterancesType = {
  id: string | number;
  text: string;
};

const SetForm: React.FC<SetFormProps> = ({ initialValue }) => {
  const [tableData, setTableData] = useState<UtterancesType[]>([]);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialValue?.title || "",
      description: initialValue?.description || "",
      language: initialValue?.language || "",
      utterances: initialValue?.utterances || "",
      is_public: initialValue?.is_public || false,
    },
  });

  useEffect(() => {
    if (initialValue && initialValue.utterances) {
      const utterancesArray = initialValue.utterances.split("|");

      const parsedData = utterancesArray.map((text, index) => ({
        id: index + 1,
        text: text.trim(), // Trim to remove any leading or trailing spaces
      }));

      setTableData(parsedData);
    }
  }, [initialValue]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      try {
        const content = await readFileAsync(file);
        const sentencesArray = content
          .split("\n")
          .map((sentence, index) => {
            const trimmedSentence = sentence.trim();
            return trimmedSentence !== ""
              ? {
                  id: index + 1,
                  text: trimmedSentence,
                }
              : null;
          })
          .filter((sentence) => sentence !== null) as {
          id: number;
          text: string;
        }[];

        form.setValue(
          "utterances",
          sentencesArray
            .map((sentence) => {
              return sentence?.text;
            })
            .join("|")
        );
        setTableData(sentencesArray);
      } catch (error) {
        console.error("Error reading the file:", error);
      }
    }
  };

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="How should we name your set?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="What is this dataset about?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="What language is used in this set?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="INA">Indonesian</SelectItem>
                  <SelectItem value="IND">Indian</SelectItem>
                  <SelectItem value="ENG">English</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="utterances"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Utterances</FormLabel>
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle className="font-semibold">Tips!</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  You can input the utterances manually or by using a .txt file
                  consisting utterances separated by newline. See the{" "}
                  <Dialog>
                    <DialogTrigger asChild>
                      <span className="text-primary">example</span>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Utterance text file</DialogTitle>
                        <DialogDescription>
                          Each utterance is divided by the new line; hence below
                          example will be rendered as 10 individual utterances.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="">
                        <span className="rounded-md text-xs px-4 py-2 bg-muted text-right text-muted-foreground mb-4">
                          example.txt
                        </span>
                        <div className="bg-muted w-full rounded-md rounded-tl-none py-6 px-6 text-sm">
                          <code>
                            The city lights shimmered in the distance. <br />{" "}
                            Urban life is fast-paced and dynamic. <br />
                            Skyscrapers defined the city skyline. <br />
                            People hurried along the bustling streets. <br />
                            Street vendors added color to the cityscape. <br />
                            Parks provided an oasis in the heart of the city.{" "}
                            <br />
                            Public transportation connected every corner. <br />
                            The city never sleeps; it's alive 24/7. <br />
                            Cultural diversity thrived in every neighborhood.
                          </code>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  .
                </AlertDescription>
              </Alert>
              <Button type="button" variant="outline" className="w-full p-0">
                <label
                  htmlFor="txt"
                  className="w-full h-full cursor-pointer flex gap-2 justify-center items-center text-sm"
                >
                  <Upload className="w-4 h-4" />
                  Upload .txt file
                </label>
                <input
                  id="txt"
                  type="file"
                  accept=".txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </Button>

              <FormControl>
                <Input type="text" className="hidden" {...field} />
              </FormControl>
              <FormMessage />
              <DataTable columns={columns} data={tableData || []} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_public"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Visibility</FormLabel>
                <FormDescription>
                  Let other people see and duplicate this dataset to their
                  library
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-readonly
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default SetForm;
