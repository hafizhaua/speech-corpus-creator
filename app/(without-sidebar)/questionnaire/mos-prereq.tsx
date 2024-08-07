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
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { PrereqFormSchema as FormSchema } from "./schema";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export function MOSPrereq({
  initVal,
  onSubmit,
}: {
  initVal: z.infer<typeof FormSchema> | null;
  onSubmit: (data: z.infer<typeof FormSchema>) => void;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: initVal || {
      name: "",
      institution: "",
      email: "",
      headset: false,
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data: z.infer<typeof FormSchema>) {
    const supabase = createClient();
    setIsLoading(true);
    const { data: respondentData, error } = await supabase
      .from("respondents")
      .select("email")
      .eq("email", data.email);

    setIsLoading(false);
    if (respondentData?.length === 0) {
      onSubmit(data);
    } else {
      toast.error("You have already submitted the form before.");
    }
  }

  return (
    <Form {...form}>
      <div className="space-y-4 mb-4">
        <h1 className="text-2xl font-bold">Speech Utterance Questionnaire</h1>

        <div className="text-muted-foreground text-sm md:text-base space-y-2">
          <p className="">
            I am Hafizha Ulinnuha Ahmad, an undergraduate Information
            Engineering student at Universitas Gadjah Mada. I am currently
            conducting research on the assessment of speech utterance audio
            samples. Your input is crucial to the success of this study, and I
            would greatly appreciate it if you could take a few minutes to
            complete the following questionnaire.
          </p>
          <p className="">
            Your data will be used for research purposes only and will be kept
            confidential. Any questions are welcomed and can be directed to me
            via{" "}
            <button
              className="text-primary hover:underline"
              onClick={() => {
                navigator.clipboard.writeText("hafizhaua@gmail.com");
                toast.info("Email hafizhaua@gmail.com copied to clipboard");
              }}
            >
              Email
            </button>
            ,{" "}
            <a
              className="text-primary hover:underline"
              href="https://twitter.com/hafizhaua"
              rel="noreferrer noopener"
              target="_blank"
            >
              Twitter
            </a>
            , or{" "}
            <a
              className="text-primary hover:underline"
              href="https://linkedin.com/in/hafizhaua"
              rel="noreferrer noopener"
              target="_blank"
            >
              LinkedIn
            </a>
            . Thank you for your participation!
          </p>
        </div>
      </div>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="johndoe@mail.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="10"
                  max="120"
                  placeholder="21"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="institution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institution</FormLabel>
              <FormControl>
                <Input placeholder="Universitas Gadjah Mada" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            Terms, Conditions, and Requirements
          </label>{" "}
          <FormField
            control={form.control}
            name="participate"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I&apos;m willing to participate in this research
                  </FormLabel>
                  <FormDescription>
                    By checking this box, you are willing to provide appropriate
                    feedback on the audio samples provided voluntarily and
                    truthfully without any coercion or influence from any party.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="impairment"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>I am not having hearing impairment</FormLabel>
                  <FormDescription>
                    By checking this box, you ensure that you are not having any
                    hearing impairment that may affect your ability to listen to
                    the audio samples.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I am able to understand both Indonesian and English language
                  </FormLabel>
                  <FormDescription>
                    By checking this box, you ensure that you are able to assess
                    the audio samples in both Indonesian and English languages.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="headset"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I am wearing an earphone/headset (optional but highly
                    recommended)
                  </FormLabel>
                  <FormDescription>
                    By checking this box, you ensure that you are wearing a
                    wearable hearing device to listen to the audio samples.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full mt-32" disabled={isLoading}>
          {isLoading ? "Checking..." : "Save and proceed to the next section"}
        </Button>
      </form>
    </Form>
  );
}
