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
import { Checkbox } from "@/components/ui/checkbox";
import { ConfigDataType } from "./types";

const formSchema = z.object({
  fileFormat: z.string(),
  sampleRate: z.coerce.number(),
  sampleSize: z.coerce.number(),
  channels: z.coerce.number(),
  features: z.array(z.string()),
});

export default function ConfigForm({
  onSubmit,
}: {
  onSubmit: (data: ConfigDataType) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileFormat: ".wav",
      sampleRate: 44100,
      sampleSize: 16,
      channels: 1,
      features: ["echoCancellation", "noiseSuppression", "autoGainControl"],
    },
  });

  const fileFormatOption = [".wav", ".mp3", ".webm"];
  const sampleRateOption = [
    8000, 11025, 16000, 22050, 24000, 32000, 44100, 48000, 88200, 96000,
  ];
  const sampleSizeOption = [8, 16, 24, 32];

  const featureOption = [
    { id: "speechAccuracy", label: "Speech Accuracy Assessment" },
    { id: "echoCancellation", label: "Echo Cancellation" },
    { id: "noiseSuppression", label: "Noise Suppression" },
    { id: "autoGainControl", label: "Auto Gain Control" },
  ];

  function handleSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    onSubmit(values);
  }

  return (
    <div className="p-8 py-12 md:px-10 md:py-12 space-y-4">
      <h1 className="text-2xl font-bold">Audio Configuration Preference</h1>
      <p className="text-muted-foreground">
        Before we start the recording session, please select your preference of
        the audio constraints.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                      <SelectValue placeholder="Select file format" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fileFormatOption.map((format) => {
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
            name="sampleRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sample Rate</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sample rate (Hz)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sampleRateOption.map((rate) => {
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
          />
          <FormField
            control={form.control}
            name="sampleSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sample Size</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sample size (bits)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sampleSizeOption.map((size) => {
                      return (
                        <SelectItem key={size} value={size.toString()}>
                          {size} bits
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
            name="channels"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Channels</FormLabel>
                <Select
                  onValueChange={field.onChange}
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
          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <div className="mb-4 space-y-1">
                  <FormLabel className="text-base">
                    Processing Features
                  </FormLabel>
                  <FormDescription>
                    Select audio processing features to be applied for each
                    audio segment
                  </FormDescription>
                </div>
                {/* <div className="space-y-2"> */}
                {featureOption.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="features"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                {/* </div> */}
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-2 w-full">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
