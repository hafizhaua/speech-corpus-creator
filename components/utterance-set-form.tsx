"use client";

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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Lightbulb, PlusCircle, RotateCcw, Upload } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { readFileAsync } from "@/lib/utils";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/data-table";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useUtteranceSetStore from "@/lib/hooks/useUtteranceSetStore";
import { columns } from "./columns/utterances-column";
import {
  createUtteranceSet,
  updateUtteranceSet,
} from "@/lib/actions/utterance-set";
import { FileTab } from "./file-tab";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  title: z.string().trim().min(1).max(50),
  description: z.string().trim().min(1).max(100),
  language_id: z.string(),
  utterances: z.string(),
  is_visible: z.boolean(),
});

type LanguagesType = {
  id: string;
  lang_name: string;
  country_name: string;
  lang_code: string;
  country_code: string;
};

type UtterancesType = {
  id: string;
  text: string;
};

interface CreateFormProps {
  languages: LanguagesType[];
  initialValue?: {
    id: string;
    title: string;
    description: string;
    language_id: string;
    utterances: string;
    is_visible: boolean;
  } | null;
}

export const UtteranceSetForm: React.FC<CreateFormProps> = ({
  languages,
  initialValue,
}) => {
  const [newUtterance, setNewUtterance] = useState("");

  const { utteranceSets, addUtterance, resetUtteranceSet } =
    useUtteranceSetStore();

  const btnRef = useRef<HTMLButtonElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialValue?.title || "",
      description: initialValue?.description || "",
      language_id: initialValue?.language_id || "",
      utterances: initialValue?.utterances || "",
      is_visible: initialValue?.is_visible || false,
    },
  });
  const isEditMode = !!initialValue;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let response;

    try {
      if (isEditMode && initialValue?.id) {
        response = await updateUtteranceSet(values, initialValue.id);
      } else {
        response = await createUtteranceSet(values);
      }

      if (response?.error) {
        console.log(response.error);
        toast.error(response.error?.message);
      } else {
        toast.success(
          `The set has been ${isEditMode ? "edited" : "created"} successfully`
        );
        const createdOrUpdatedId = response.data[0]?.id;
        if (createdOrUpdatedId) {
          router.push(`/utterance/${createdOrUpdatedId}`);
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  }

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && btnRef.current) {
        btnRef.current.click();
      }
    },
    []
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      try {
        const content = await readFileAsync(file);
        const lines = content.split("\n");

        const texts = lines.map((line, index) => {
          // Check if the line has tab-separated id and text
          const parts = line.split("\t");
          if (parts.length === 2) {
            return parts[1].trim();
          } else {
            // If no tab-separated id and text, assign id based on line number
            return line.trim();
          }
        });

        form.setValue("utterances", texts.join("|"));

        resetUtteranceSet(texts);
      } catch (error) {
        console.error("Error reading the file:", error);
      }
    }
  };

  const handleUploadReset = () => {
    if (uploadRef?.current) {
      uploadRef.current.value = "";
    }
  };

  useEffect(() => {
    form.setValue("utterances", utteranceSets.map((u) => u.text).join("|"));
  }, [form, utteranceSets]);

  useEffect(() => {
    resetUtteranceSet([]);
    if (initialValue && initialValue.utterances) {
      const utterancesArray = initialValue.utterances.split("|");
      utterancesArray.map((u) => addUtterance(u));
    }
  }, [initialValue, addUtterance, resetUtteranceSet]);

  const handleAddRow = () => {
    if (newUtterance.length > 0) {
      const lines = newUtterance.split("\n");
      const texts = lines.map((line, index) => {
        // Check if the line has tab-separated id and text
        const parts = line.split("\t");
        if (parts.length === 2) {
          return parts[1].trim();
        } else {
          // If no tab-separated id and text, assign id based on line number
          return line.trim();
        }
      });

      texts.map((t) => addUtterance(t));
      setNewUtterance("");

      // form.setValue("utterances", texts.join("|"));
    }
  };

  const handleReset = () => {
    resetUtteranceSet([]);
  };

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
          name="language_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="What language is used in this set?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {languages.map((language) => {
                    return (
                      <SelectItem
                        key={language.id}
                        value={language.id.toString()}
                      >
                        {` ${language.lang_name} (${language.country_name})`}
                      </SelectItem>
                    );
                  })}
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
                  You can input the utterances separated by newline manually or
                  by using a .txt file. See the{" "}
                  <Dialog>
                    <DialogTrigger asChild>
                      <span className="text-primary">example</span>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle className="mb-1">
                          Utterance text file
                        </DialogTitle>
                        <DialogDescription>
                          <p>
                            Each utterance is divided by the new line where each
                            line consists either text only or id-text pair
                            divided by tab whitespace; i.e. below file will be
                            rendered as 10 individual utterances.
                          </p>
                        </DialogDescription>
                      </DialogHeader>
                      <FileTab />
                    </DialogContent>
                  </Dialog>
                  .
                </AlertDescription>
              </Alert>
              <div className="flex gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" type="button">
                      <PlusCircle className="font-light mr-2 w-4 h-4 text-muted-foreground" />
                      Add row
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                      <DialogTitle>
                        Insert new utterance(s) to the set
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex flex-col gap-4">
                        {/* <Label htmlFor="utterance" className="text-left">
                        Utterance
                      </Label> */}
                        {/* <Input
                          id="utterance"
                          value={newUtterance}
                          onChange={(e) => setNewUtterance(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="I'm cooking a fried rice."
                          className="col-span-3"
                        /> */}

                        <Textarea
                          id="utterance"
                          value={newUtterance}
                          onChange={(e) => setNewUtterance(e.target.value)}
                          // onKeyDown={handleKeyDown}
                          placeholder="I'm cooking a fried rice."
                          className="col-span-3 h-60"
                        />

                        <DialogClose asChild>
                          <Button onClick={handleAddRow} ref={btnRef}>
                            Add
                          </Button>
                        </DialogClose>
                      </div>
                    </div>
                    <DialogFooter></DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button type="button" variant="outline" className="w-full p-0">
                  <label
                    htmlFor="txt"
                    className="w-full h-full cursor-pointer flex gap-2 justify-center items-center text-sm"
                  >
                    <Upload className="font-light w-4 h-4 text-muted-foreground" />
                    Upload .txt file
                  </label>
                  <input
                    id="txt"
                    type="file"
                    accept=".txt"
                    onChange={handleFileChange}
                    ref={uploadRef}
                    onClick={handleUploadReset}
                    className="hidden"
                  />
                </Button>
                <Button variant="outline" type="button" onClick={handleReset}>
                  <RotateCcw className="font-light mr-2 w-4 h-4 text-muted-foreground" />
                  Reset All
                </Button>
              </div>

              <FormControl>
                <Input type="text" className="hidden" {...field} />
              </FormControl>
              <FormMessage />
              <DataTable columns={columns} data={utteranceSets || []} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_visible"
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
