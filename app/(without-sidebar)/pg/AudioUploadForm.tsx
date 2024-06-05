"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useRef, useState } from "react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { readFileAsync } from "@/lib/utils";
import { Upload } from "lucide-react";

const AudioUploadForm = () => {
  const [audios, setAudios] = useState<File[]>([]);
  const [lang, setLang] = useState("id-ID");
  const [type, setType] = useState("natural");
  const [isLoading, setIsLoading] = useState(false);
  const [transcriptions, setTranscriptions] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);

  const uploadRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file) => {
    const audioName = getFilenameWithoutExtension(file.name);

    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from("audios")
      .upload(`${lang}/${type}/${audioName}`, file);

    if (error || !data) {
      return console.error("Error uploading image:", error);
    }

    const { data: urlData } = await supabase.storage
      .from("audios")
      .getPublicUrl(data.path);

    if (urlData) return urlData.publicUrl;
    return console.error("Not found");
  };

  function getFilenameWithoutExtension(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf(".");
    if (lastDotIndex === -1) {
      return fileName; // No extension found, return the whole filename
    }
    return fileName.substring(0, lastDotIndex);
  }

  const insertAudio = async (audio, url) => {
    const supabase = createClient();
    const { error } = await supabase.from("audios").insert({
      type: type === "synthesized" || type === "natural" ? type : null,
      transcription: transcriptions
        ? transcriptions[Number(getFilenameWithoutExtension(audio.name)) - 1]
        : null,
      lang_code: lang,
      audio_url: url,
      file_name: audio.name,
    });
    if (error) {
      return console.error("Error inserting audio:", error);
    }

    console.log("Audio inserted successfully");
  };

  const handleFileChange = (e) => {
    setAudios(e.target.files);
  };

  const handleTranscriptFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      try {
        const content = await readFileAsync(file);
        const lines = content.split("\n");

        const texts = lines
          .filter((str) => str.length > 0)
          .map((line, index) => {
            // Check if the line has tab-separated id and text
            const parts = line.split("|");
            return parts[1].trim();
          });
        if (texts) setTranscriptions(texts);
        console.log(texts);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      for (const audio of audios) {
        const url = await uploadFile(audio);

        if (url) {
          setIdx((prev) => prev + 1);
          await insertAudio(audio, url);
        } else console.log("URL not found");
      }

      toast.success("Files uploaded successfully");
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Error uploading files");
    }

    setIsLoading(false);
    setIdx(0);
  };

  return (
    <form onSubmit={handleSubmit} className="py-32 space-y-8">
      <h1 className="text-3xl font-bold">Upload Files</h1>
      <div className="space-y-2">
        <Label htmlFor="audio">Input Multiple Audio</Label>
        <Input type="file" id="audio" multiple onChange={handleFileChange} />
      </div>{" "}
      <div className="space-y-2">
        <Label htmlFor="lang">Language</Label>
        <Select onValueChange={(val) => setLang(val)} value={lang}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select the language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id-ID">Indonesian (Indonesia)</SelectItem>
            <SelectItem value="en-US">English (United States)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Audio Type</Label>

        <Select onValueChange={(val) => setType(val)} value={type}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select the type of audio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="natural">Natural</SelectItem>
            <SelectItem value="synthesized">Synthesized</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Transcription File</Label>
        <Button type="button" variant="outline" className="w-full p-0">
          <label
            htmlFor="txt"
            className="w-full h-full cursor-pointer flex gap-2 justify-center items-center text-sm"
          >
            <Upload className="font-light w-4 h-4 text-muted-foreground" />
            Upload .csv file
          </label>
          <input
            id="txt"
            type="file"
            accept=".csv"
            onChange={handleTranscriptFileChange}
            ref={uploadRef}
            onClick={handleUploadReset}
            className="hidden"
          />
        </Button>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? `Uploading... (${idx}/${audios.length})` : "Upload"}
      </Button>
    </form>
  );
};

export default AudioUploadForm;
