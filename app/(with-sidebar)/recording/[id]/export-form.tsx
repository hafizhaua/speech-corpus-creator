"use client";

import React, { useState } from "react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FileTree } from "./file-tree";
import {
  ExportFormType,
  RecordingDataType,
  UtteranceType,
  formSchema,
  // formSchema,
} from "./types";
import { TranscriptContent } from "./transcript-content";

import JSZip from "jszip";
import { saveAs } from "file-saver";
import { encodeAudio, generateAudioName, generateBlob } from "./utils";
import {
  AUDIO_FORMATS,
  LJSPEECH,
  PIPER_MEDHIGH,
  PIPER_LOW,
  RESET,
} from "./templates";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { toBlobURL } from "@ffmpeg/util";
import { FFmpeg } from "@ffmpeg/ffmpeg";

export default function ExportForm({
  // utterances,
  audioData,
}: {
  // utterances: UtteranceType[];
  audioData: any;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: RESET,
  });

  const utterances = audioData.map((data, idx) => {
    return { id: data.utteranceId, text: data.utterance };
  });

  const formValue = form.watch();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);
    // return;
    setIsProcessing(true);
    try {
      const csvData: any = [];
      const zip = new JSZip();
      const encodePromises: Promise<void>[] = []; // Array to store promises for encoding audio

      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      const ffmpeg = new FFmpeg();
      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
      });

      // Process files in smaller batches
      const batchSize = 50; // Adjust batch size as needed
      for (let i = 0; i < audioData.length; i += batchSize) {
        const batch = audioData.slice(i, i + batchSize);

        for (const [idx, data] of batch.entries()) {
          const fileName = generateAudioName(
            values.audioPrefix,
            values.audioSuffix,
            values.audioNamePattern,
            data.utteranceId,
            audioData.length,
            i + idx + 1
          );

          if (values.includePath) {
            csvData.push([
              `${values.audioPath}/${fileName}.${values.audioFormat}`,
              data.utterance,
            ]);
          } else {
            csvData.push([fileName, data.utterance]);
          }

          const encodePromise = encodeAudio(
            ffmpeg,
            idx,
            data.audioBlob,
            values.audioFormat,
            values.sampleRate,
            values.channels
          ).then((encodedAudio) => {
            zip.file(
              `${
                values.audioPath !== "" ? values.audioPath + "/" : ""
              }${fileName}.${values.audioFormat}`,
              encodedAudio as Blob
            );
            setProcessedCount((prev) => prev + 1);
          });
          encodePromises.push(encodePromise); // Store the promise
        }

        // Wait for the current batch to complete
        await Promise.all(encodePromises);
        encodePromises.length = 0; // Clear the array for the next batch

        // Terminate and reload ffmpeg to free memory
        await ffmpeg.terminate();
        await ffmpeg.load({
          coreURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.js`,
            "text/javascript"
          ),
          wasmURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.wasm`,
            "application/wasm"
          ),
        });
      }

      const csvBlob = await generateBlob(
        csvData,
        values.transcriptionFormat,
        values.transcriptionDelimiter
      );

      if (csvBlob) {
        zip.file(
          `${
            values.transcriptionPath !== ""
              ? values.transcriptionPath + "/"
              : ""
          }${values.transcriptionName}.${values.transcriptionFormat}`,
          csvBlob
        );
      }
      const content = await zip.generateAsync({ type: "blob" });

      saveAs(content, `${values.fileName}.zip`);
    } catch (error) {
      console.log(error);
      toast.error("Error exporting data");
    }
    setIsProcessing(false);
    setProcessedCount(0);
  }

  const handlePresetChange = (format: z.infer<typeof formSchema>) => {
    form.reset(format);
  };

  const getFilteredSampleRates = () => {
    if (formValue.audioFormat === "webm") {
      return [8000, 16000, 24000, 48000];
    }

    if (formValue.audioFormat === "mp3") {
      return [8000, 11025, 16000, 22050, 24000, 32000, 44100, 48000];
    }

    return [
      8000, 11025, 16000, 22050, 24000, 32000, 44100, 48000, 88200, 96000,
    ];
  };

  return (
    <div className="px-6 py-10  md:px-10 md:py-12 space-y-4">
      <h1 className="text-2xl font-bold">Export Configuration</h1>
      <p className="text-muted-foreground">
        Congratulations on completing the recording process. Lastly, choose how
        you would like to format the corpus and it will be ready for download!
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 space-y-6">
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
                      onClick={() =>
                        handlePresetChange(RESET as z.infer<typeof formSchema>)
                      }
                    >
                      Reset
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handlePresetChange(LJSPEECH)}
                    >
                      LJSpeech
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handlePresetChange(PIPER_LOW)}
                    >
                      Piper TTS Low
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handlePresetChange(PIPER_MEDHIGH)}
                    >
                      Piper TTS Medium/High
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
                            zip
                          </SelectItem>
                          {/* <SelectItem key="rar" value="rar">
                            rar
                          </SelectItem> */}
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
                    Audio File
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
                  name="audioFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Format</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value?.toString()}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select file format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {AUDIO_FORMATS.map((format) => {
                            return (
                              <SelectItem key={format} value={format}>
                                {format}
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
                    Transcription File
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
                            csv
                          </SelectItem>
                          <SelectItem key="txt" value="txt">
                            txt
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
                  name="includePath"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Include path and file format to transcript content
                      </FormLabel>
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
            </div>
            <div className="md:col-span-7">
              <div
                className="
              md:sticky
              md:top-8 
              gap-6
              flex flex-col-reverse md:flex-col
              "
              >
                <div className="md:py-8 md:px-6 rounded-lg md:border border-muted space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest">
                    Result Preview
                  </h2>

                  <div className="flex gap-4">
                    <div className="space-y-4 max-w-[50%]">
                      <h2 className="text-xs text-muted-foreground uppercase tracking-widest">
                        File Structure
                      </h2>
                      <FileTree
                        formValue={formValue}
                        utterances={utterances}
                        recordedCount={audioData.length}
                      />
                    </div>
                    <div className="flex-1 space-y-4">
                      <h2 className="text-xs text-muted-foreground uppercase tracking-widest">
                        Transcript Content
                      </h2>
                      <TranscriptContent
                        fileName={`${formValue.transcriptionName}.${formValue.transcriptionFormat}`}
                        recordedCount={audioData.length}
                        utterances={utterances}
                        formValue={formValue}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground/75 text-xs tracking-widest uppercase">
                      Audio Configuration
                    </span>
                    <div className="flex-1 border"></div>
                  </div>
                  <FormField
                    control={form.control}
                    name="sampleRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sample Rate</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value?.toString()}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sample rate (Hz)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getFilteredSampleRates().map((rate) => {
                              return (
                                <SelectItem key={rate} value={rate.toString()}>
                                  {rate} Hz
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />{" "}
                  <FormField
                    control={form.control}
                    name="channels"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Channels</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value?.toString()}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select number of channels" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem key="1" value="1">
                              Mono
                            </SelectItem>
                            <SelectItem key="2" value="2">
                              Stereo
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="mt-8 w-full transition"
            disabled={isProcessing}
          >
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Download
            {isProcessing && (
              <span className="ml-2">
                ({processedCount}/{audioData.length})
              </span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
