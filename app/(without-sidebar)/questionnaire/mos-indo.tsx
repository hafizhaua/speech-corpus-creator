"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useState } from "react";
import WaveSurfer from "wavesurfer.js";
import AudioMOS from "./audio-mos";
import { AudioFormSchema as FormSchema } from "./schema";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function MOSIndo({
  audios,
  onSubmit,
  onBack,
  initVal,
}: {
  audios: { id: number; audio_url: string; transcription: string }[];
  onSubmit: (data: z.infer<typeof FormSchema>) => void;
  onBack: () => void;
  initVal: z.infer<typeof FormSchema> | null;
}) {
  const fullScales = [
    { value: 1, label: "Bad" },
    { value: 2, label: "Poor" },
    { value: 3, label: "Fair" },
    { value: 4, label: "Good" },
    { value: 5, label: "Excellent" },
  ];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: initVal || {
      audioRatings: audios.map((file) => ({
        audioId: file.id,
      })),
    },
  });

  function handleSubmit(data: z.infer<typeof FormSchema>) {
    onSubmit(data);
  }

  return (
    <Form {...form}>
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-3">
          Speech Utterance Questionnaire
        </h1>
        <h3 className="text-lg mb-2 font-semibold">Section II: Indonesian</h3>
        <div className="text-muted-foreground text-sm space-y-2">
          <p className="">
            In this section, you will listen to 30 random audio samples spoken
            in Indonesian language. Please rate each audio sample based on its
            naturalness and overall quality.
          </p>
          <ul className="list-disc ml-4 md:ml-8">
            <li>
              Naturalness refers to how human-like the speech sounds. Consider
              factors such as the intonation, rhythm, and overall sound quality.
              A higher score indicates that the speech sounds more like a
              natural human voice.
            </li>
            <li>
              Overall quality is a general assessment that includes naturalness,
              intelligibility, and any other factors that contribute to the
              perceived quality of the speech. A higher score indicates better
              overall quality.
            </li>
          </ul>
          <p>
            You can listen to the audio sample as many times as you want by
            clicking the waveform before rating it. Once you are satisfied with
            your rating, please proceed to the next audio sample.
          </p>
        </div>
      </div>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full space-y-4"
      >
        <div className="space-y-16">
          {audios.map((audio, index) => {
            return (
              <div className="space-y-4" key={index}>
                <div className="w-full text-muted-foreground flex items-center gap-2">
                  <p className="uppercase tracking-widest text-sm">
                    Audio {index + 1}
                  </p>
                  <div className="border-t border-muted flex-1"></div>
                </div>
                <AudioMOS
                  audioUrl={audio.audio_url}
                  label={audio.transcription}
                />
                <div className="w-fit mx-auto text-center flex flex-col gap-8 md:flex-row md:gap-32">
                  <FormField
                    control={form.control}
                    name={`audioRatings.${index}.naturalness`}
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Naturalness</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString()}
                            className="w-full flex gap-8"
                          >
                            {fullScales.map((scale) => (
                              <FormItem
                                key={scale.value}
                                className="flex flex-col  justify-center items-center gap-1"
                              >
                                <FormControl>
                                  <RadioGroupItem
                                    value={scale.value?.toString()}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {scale.label}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`audioRatings.${index}.quality`}
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Overall Quality</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString()}
                            className="w-full flex gap-8"
                          >
                            {fullScales.map((scale) => (
                              <FormItem
                                key={scale.value}
                                className="flex flex-col  justify-center items-center gap-1"
                              >
                                <FormControl>
                                  <RadioGroupItem
                                    value={scale.value?.toString()}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {scale.label}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="pt-8 w-full flex gap-4 md:flex-row flex-col">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex gap-2 hover:gap-3 transition-all"
          >
            <ArrowLeft strokeWidth={1} size={16} />
            Back to previous section
          </Button>
          <Button
            type="submit"
            className="flex-1 flex gap-2 hover:gap-3 transition-all"
          >
            Save and proceed to next section
            <ArrowRight strokeWidth={1} size={16} />
          </Button>
        </div>
      </form>
    </Form>
  );
}
