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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const formSchema = z.object({
  text: z.string(),
});

const SpeechPlayground: React.FC = () => {
  const [text, setText] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setAudioBlob(null);
    try {
      const response = await fetch(
        `http://localhost:3000/api?text=${values.text}`
      );

      if (!response.ok) {
        throw new Error("Failed to generate audio");
      }

      const audioBlob = await response.blob();
      setAudioBlob(audioBlob);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="px-6 py-10  md:px-10 md:py-12 space-y-4">
      <h1 className="text-2xl font-bold">Speech Synthesis Playground</h1>
      <p className="text-muted-foreground">
        Currently, a speech synthesis service is running on the server. You can
        input a text and generate a synthetic audio file.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text</FormLabel>
                <FormControl>
                  <Textarea placeholder="Hello, how are you?" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the text that you want to synthesize.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="mt-2 w-full">
            Submit
          </Button>
        </form>
      </Form>

      {audioBlob && (
        <audio controls>
          <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default SpeechPlayground;
