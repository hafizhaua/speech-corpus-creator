"use client";
import NoSSRWrapper from "@/components/NoSSRWrapper";
import Home from "./Home";
import MicrophoneList from "./Microphone";
import SpeechPlayground from "./SpeechPlayground";

export default function Page() {
  return (
    <NoSSRWrapper>
      <SpeechPlayground />

      {/* <Home />
      <MicrophoneList /> */}
    </NoSSRWrapper>
  );
}
