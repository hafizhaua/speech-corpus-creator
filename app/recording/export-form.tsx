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
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  fileFormat: z.string(),
  fileName: z.string(),
  audioPath: z.string(),
  audioName: z.string(),
  audioPrefix: z.string(),
  audioSuffix: z.string(),
  transcriptionPath: z.string(),
  transcriptionName: z.string(),
  transcriptionFormat: z.string(),
  transcriptionDelimiter: z.string(),
});

export function ExportForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileFormat: "",
      fileName: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
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
                    {/* <div className="py-2 px-4 text-center bg-muted rounded-r-md">
                      /
                    </div> */}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="audioName"
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
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the format of the transcription file" />
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
            name="transcriptionFormat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Utterance Delimiter</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the delimiter for each column" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem key="vb" value="vb">
                      Pipe/Vertical Bar
                    </SelectItem>
                    <SelectItem key="cm" value="cm">
                      Comma
                    </SelectItem>
                    <SelectItem key="nl" value="nl">
                      Newline
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
  );
}
