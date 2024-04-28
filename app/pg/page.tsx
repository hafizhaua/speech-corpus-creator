"use client";
import NoSSRWrapper from "@/components/NoSSRWrapper";
import Home from "./Home";
import MicrophoneList from "./Microphone";

export default function Page() {
  return (
    <NoSSRWrapper>
      <Home />
      <MicrophoneList />
    </NoSSRWrapper>
  );
}
