"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAudioRecorder } from "react-audio-voice-recorder";
import { LiveAudioVisualizer } from "react-audio-visualize";
import { useWavesurfer } from "@wavesurfer/react";
import { stringSimilarity } from "string-similarity-js";

export default function RecordingSession({
  utterances,
}: {
  utterances: string[];
}) {
  const wavesurferRef = useRef<HTMLDivElement>(null);

  const [currIdx, setCurrIdx] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [alert, setAlert] = useState("Start recording");
  const [similarityIdx, setSimilarityIdx] = useState(1);

  const { wavesurfer } = useWavesurfer({
    container: wavesurferRef,
    waveColor: "#7f1d1d",
    height: 150,
    width: 350,
  });

  const handleNext = () => {
    setCurrIdx((prev) => (prev < utterances.length - 1 ? prev + 1 : prev));
  };
  const handlePrev = () => {
    setCurrIdx((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleChange = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = async (event) => {
      const text = event?.results[0][0].transcript;
      setTranscript(text);
    };

    if (!isRecording) {
      startRecording();
      recognition.abort();
      recognition.start();
      setAlert("Listening...");
    }

    if (isRecording) {
      stopRecording();
      recognition.stop();
      setAlert("Analyzing...");
      setIsProcessing(true);
      assessSimilarity();

      setTimeout(() => {
        setIsProcessing(false);
        setAlert("Click to re-attempt");
      }, 1000);
    }
  };

  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
    mediaRecorder,
  } = useAudioRecorder();

  function normalizeSentence(sentence: string) {
    // Remove punctuation using regular expression
    let withoutPunctuation = sentence.replace(
      /[.,\/#!?$%\^&\*;:{}=\-_`~()]/g,
      ""
    );

    // Convert to lowercase
    let lowercaseWithoutPunctuation = withoutPunctuation.toLowerCase();

    return lowercaseWithoutPunctuation;
  }

  const assessSimilarity = () => {
    const source = normalizeSentence(transcript);
    const target = normalizeSentence(utterances[currIdx]);

    const similarity = stringSimilarity(source, target);

    console.log("hasil: ", source);
    console.log("target: ", target);
    console.log("idx: ", similarity);
    setSimilarityIdx(similarity);
  };

  const downloadBlob = async (blob: Blob): Promise<void> => {
    const downloadBlob = blob;
    const fileExt = "webm";
    const url = URL.createObjectURL(downloadBlob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `audio.${fileExt}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  useEffect(() => {
    if (!recordingBlob) return;

    wavesurfer?.loadBlob(recordingBlob);

    // downloadBlob(recordingBlob);

    // recordingBlob will be present at this point after 'stopRecording' has been called
  }, [recordingBlob]);

  return (
    <>
      <div className="text-muted-foreground space-y-1">
        <div className="flex gap-2 justify-center items-center">
          <Button variant="ghost" size="icon" onClick={handlePrev}>
            <ChevronLeft />
          </Button>
          <span>
            {currIdx + 1} of {utterances?.length}
          </span>
          <Button variant="ghost" size="icon" onClick={handleNext}>
            <ChevronRight />
          </Button>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Click the record button and verbalize below sentence.
        </p>
      </div>
      <div className="space-y-8 mb-16 flex flex-col items-center gap-3">
        <p className="text-3xl font-bold text-balance text-center">
          {utterances[currIdx]}
        </p>
        <div className="text-center space-y-4">
          <div>
            {mediaRecorder && (
              <LiveAudioVisualizer
                mediaRecorder={mediaRecorder}
                width={280}
                height={150}
                barWidth={1}
                barColor="#7f1d1d"
              />
            )}
            {!mediaRecorder && !recordingBlob && (
              <div className="w-[280px] h-[150px] flex justify-center items-center">
                <div
                  className={`border transition w-full ${
                    isProcessing ? "border-mute" : "border-destructive"
                  }`}
                ></div>
              </div>
            )}
            <div className="flex justify-center">
              <div
                ref={wavesurferRef}
                className={`transition overflow-hidden ${
                  recordingBlob && !isRecording ? "h-fit" : "h-0"
                }`}
                onClick={onPlayPause}
              ></div>
            </div>
          </div>
          <button
            className="group"
            onClick={handleChange}
            disabled={isProcessing}
          >
            <div
              className={`grid place-items-center w-24 h-24 rounded-full border-4 transition ${
                isRecording ? "border-destructive" : "border-muted-foreground"
              } ${
                isProcessing
                  ? "cursor-not-allowed border-muted"
                  : "group-hover:border-destructive"
              }`}
            >
              <div
                className={`w-[72px] h-[72px] bg-destructive transition-all duration-500 ${
                  isRecording ? "rounded-sm scale-50" : "rounded-[36px]"
                } ${isProcessing ? "cursor-not-allowed bg-muted" : ""}`}
              ></div>
            </div>
          </button>
          <p
            className={` text-muted-foreground ${
              (isRecording || isProcessing) && "animate-pulse"
            }`}
          >
            {alert}
          </p>
          <p>Transcripted: {transcript}</p>
          <p>Similarity: {similarityIdx}</p>
        </div>
      </div>
    </>
  );
}
