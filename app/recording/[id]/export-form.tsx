"use client";

import React from "react";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { FileTree } from "./file-tree";
import { ExportFormType, UtteranceType } from "./types";
import { TranscriptContent } from "./content-preview";

const formSchema = z.object({
  preset: z.string().optional(),
  fileFormat: z.string(),
  fileName: z.string(),
  audioPath: z.string(),
  audioNamePattern: z.string(),
  audioPrefix: z.string(),
  audioSuffix: z.string(),
  transcriptionPath: z.string(),
  transcriptionName: z.string(),
  transcriptionFormat: z.string(),
  transcriptionDelimiter: z.string(),
});

export default function ExportForm({
  utterances,
}: {
  utterances: UtteranceType[];
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileFormat: "",
      fileName: "",
      audioPath: "",
      audioNamePattern: "",
      audioPrefix: "",
      audioSuffix: "",
      transcriptionPath: "",
      transcriptionName: "",
      transcriptionFormat: "",
      transcriptionDelimiter: "",
    },
  });

  const formValue = form.watch();

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const handlePresetChange = (format: string) => {
    if (format === "ljspeech") {
      form.reset({
        fileFormat: "zip",
        fileName: "ljspeech",
        audioPath: "wavs",
        audioNamePattern: "zeros",
        audioPrefix: "LJ001-",
        audioSuffix: "",
        transcriptionPath: "",
        transcriptionName: "transcripts",
        transcriptionFormat: "csv",
        transcriptionDelimiter: "|",
      });
    }

    if (format === "piper") {
      form.reset({
        fileFormat: "zip",
        fileName: "piper",
        audioPath: "wavs",
        audioNamePattern: "asc",
        audioPrefix: "",
        audioSuffix: "",
        transcriptionPath: "",
        transcriptionName: "metadata",
        transcriptionFormat: "csv",
        transcriptionDelimiter: "|",
      });
    }
  };

  return (
    <div className="p-8 py-12 md:px-10 md:py-12 space-y-4">
      <h1 className="text-2xl font-bold">Export Configuration</h1>
      <p className="text-muted-foreground">
        Congratulations on completing the recording process. Lastly, choose how
        you would like to format the corpus and it will be ready for download!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start mb-2"
                    >
                      Pick by templates
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Standard Format</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handlePresetChange("ljspeech")}
                    >
                      LJSpeech
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handlePresetChange("piper")}
                    >
                      Piper TTS
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground/75 text-xs tracking-widest uppercase">
                    Master Package
                  </span>
                  <div className="flex-1 border"></div>
                </div>
                <FormField
                  control={form.control}
                  name="fileFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Format</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the format of the archived package" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem key="zip" value="zip">
                            .zip
                          </SelectItem>
                          <SelectItem key="rar" value="rar">
                            .rar
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fileName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="The name of the package file"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground/75 text-xs tracking-widest uppercase">
                    Audio
                  </span>
                  <div className="flex-1 border"></div>
                </div>
                <FormField
                  control={form.control}
                  name="audioPath"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Path</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <div className="py-2 px-4 text-center bg-muted rounded-l-md">
                            /
                          </div>
                          <Input
                            placeholder="Directory path for storing the audio files"
                            className="rounded-l-none w-full"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="audioNamePattern"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>File Name</FormLabel>
                      <div className="grid grid-cols-4 gap-2">
                        <FormField
                          control={form.control}
                          name="audioPrefix"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Prefix" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl className="col-span-2">
                            <SelectTrigger>
                              <SelectValue placeholder="Select pattern" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem key="uuid" value="uuid">
                              Random UUID
                            </SelectItem>
                            <SelectItem key="asc" value="asc">
                              Ascending Number
                            </SelectItem>
                            <SelectItem key="zeros" value="zeros">
                              Ascending Number with Leading Zeros
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormField
                          control={form.control}
                          name="audioSuffix"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Suffix" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground/75 text-xs tracking-widest uppercase">
                    Transcription
                  </span>
                  <div className="flex-1 border"></div>
                </div>

                <FormField
                  control={form.control}
                  name="transcriptionPath"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Path</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <div className="py-2 px-4 text-center bg-muted rounded-l-md">
                            /
                          </div>
                          <Input
                            placeholder="Directory path of the transcription file"
                            className="rounded-l-none"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="transcriptionFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Format</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the format of the transcription file" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem key="csv" value="csv">
                            .csv
                          </SelectItem>
                          <SelectItem key="txt" value="txt">
                            .txt
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="transcriptionName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="The name of the transcription file"
                          className=""
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transcriptionDelimiter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Utterance Delimiter</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the delimiter for each column" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem key="vb" value="|">
                            Pipe/Vertical Bar
                          </SelectItem>
                          <SelectItem key="cm" value=",">
                            Comma
                          </SelectItem>
                          <SelectItem key="sp" value=" ">
                            Space
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">
                Download
              </Button>
            </form>
          </Form>
        </div>
        <div className="md:col-span-7 ">
          <div className="md:top-8 md:sticky py-8 px-6 rounded-lg border border-muted space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest">
              Result Preview
            </h2>

            <div className="flex gap-4">
              <div className="space-y-4">
                <h2 className="text-xs text-muted-foreground uppercase tracking-widest">
                  File Structure
                </h2>
                <FileTree formValue={formValue} utterances={utterances} />
              </div>
              <div className="flex-1 space-y-4">
                <h2 className="text-xs text-muted-foreground uppercase tracking-widest">
                  Transcript Content
                </h2>
                <TranscriptContent
                  fileName={`${formValue.transcriptionName}.${formValue.transcriptionFormat}`}
                  utterances={utterances}
                  formValue={formValue}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
