"use client";
import NoSSRWrapper from "@/components/NoSSRWrapper";
import Home from "./Home";
import MicrophoneList from "./Microphone";
import SpeechPlayground from "./SpeechPlayground";
import { Framer } from "./Framer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AudioUploadForm from "./AudioUploadForm";

export default function Page() {
  const [text, setText] = useState("Hello, world!");
  return (
    <NoSSRWrapper>
      {/* <Framer text={text} />

      <Button
        className="absolute left-32 top-24"
        onClick={() => setText((2000 * Math.random()).toString())}
      >
        Show
      </Button> */}
      {/* <AudioUploadForm /> */}
      <SpeechPlayground />

      {/* <Home />
      <MicrophoneList /> */}
    </NoSSRWrapper>
  );
}
