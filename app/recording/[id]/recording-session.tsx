"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAudioRecorder } from "react-audio-voice-recorder";
import { LiveAudioVisualizer } from "react-audio-visualize";
import { useWavesurfer } from "@wavesurfer/react";

export default function RecordingSession({
  utterances,
}: {
  utterances: string[];
}) {
  const wavesurferRef = useRef<HTMLDivElement>(null);

  const [currIdx, setCurrIdx] = useState(0);

  const { wavesurfer, isReady, isPlaying, currentTime } = useWavesurfer({
    container: wavesurferRef,
    waveColor: "purple",
    height: 100,
  });

  const handleNext = () => {
    setCurrIdx((prev) => (prev < utterances.length - 1 ? prev + 1 : prev));
  };
  const handlePrev = () => {
    setCurrIdx((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const [alert, setAlert] = useState("Start recording");
  const [preview, setPreview] = useState(false);

  const onStop = () => {
    setIsProcessing(true);
    setAlert("Processing...");
    setTimeout(() => {
      setIsProcessing(false);
      setAlert("Click to re-attempt");
    }, 5000);
  };

  const onStart = () => {
    setAlert("Recording...");
  };

  const handleChange = () => {
    if (!isRecording) {
      startRecording();
      setAlert("Listening...");
    }

    if (isRecording) {
      stopRecording();
      setAlert("Analyzing...");
      setIsProcessing(true);

      setTimeout(() => {
        // handleNext();
        setAlert("Finished!");

        setTimeout(() => {
          setIsProcessing(false);
          setAlert("Click to re-attempt");
        }, 1000);
      }, 2000);
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
          {/* <Button variant="ghost" size="icon" onClick={handlePrev}>
            <ChevronLeft />
          </Button> */}
          <span>
            {currIdx + 1} of {utterances?.length}
          </span>
          {/* <Button variant="ghost" size="icon" onClick={handleNext}>
            <ChevronRight />
          </Button> */}
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Click the record button and verbalize below sentence.
        </p>
      </div>
      <div className="space-y-8 mb-16 flex flex-col items-center gap-3">
        <p className="text-3xl font-bold text-balance text-center h-24 md:h-16">
          {utterances[currIdx]}
        </p>
        <div className="text-center space-y-4">
          <div
          // className={`${
          //   isRecording ? "opacity-50 h-32" : "opacity-0 h-0"
          // } transition-all overflow-hidden delay-500 duration-1000`}
          >
            {mediaRecorder ? (
              <LiveAudioVisualizer
                mediaRecorder={mediaRecorder}
                width={280}
                height={150}
                barWidth={40}
                barColor="#7f1d1d"
              />
            ) : (
              <div className="w-[280px] h-[150px] flex justify-center items-center">
                <div
                  className={`border transition w-full ${
                    isProcessing ? "border-mute" : "border-destructive"
                  }`}
                ></div>
              </div>
            )}
            {/* <div className="w-32 h-12 bg-red-500"></div> */}
            <div ref={wavesurferRef}></div>
            <Button onClick={onPlayPause}>
              {isPlaying ? "Pause" : "Play"}
            </Button>
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
        </div>
        {/* {mediaRecorder && (
          <LiveAudioVisualizer
            mediaRecorder={mediaRecorder}
            width={280}
            height={150}
            barWidth={40}
            barColor="#7f1d1d"
          />
        )} */}
      </div>
    </>
  );
}
