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
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Lightbulb, Upload } from "lucide-react";

import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  language_id: z.string(),
  utterances: z.string(),
  is_visible: z.boolean(),
});

type Languages = {
  id: number;
  name: string;
};

interface CreateFormProps {
  languages: Languages[];
}

export const CreateForm: React.FC<CreateFormProps> = ({ languages }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
                        {language.name}
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
                  You can input the utterances manually or by using a .txt file
                  consisting utterances separated by newline. See the{" "}
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
                          Each utterance is divided by the new line; i.e. below
                          file will be rendered as 10 individual utterances.
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
                <input id="txt" type="file" accept=".txt" className="hidden" />
              </Button>

              <FormControl>
                <Input type="text" className="hidden" {...field} />
              </FormControl>
              <FormMessage />
              {/* <Button onClick={handleAddRow}>Add row</Button> */}
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
