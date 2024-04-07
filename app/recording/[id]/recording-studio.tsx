"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useAudioRecorder } from "react-audio-voice-recorder";
import { LiveAudioVisualizer } from "react-audio-visualize";
import { useWavesurfer } from "@wavesurfer/react";
import { stringSimilarity } from "string-similarity-js";
import { downloadBlob, normalizeSentence } from "./utils";
import { toast } from "sonner";

import JSZip from "jszip";
import { saveAs } from "file-saver";
import { ConfigDataType, RecordingDataType, UtteranceType } from "./types";

interface RecordingStudioProps {
  configData: ConfigDataType;
  utterances: UtteranceType[];
  onRecordingComplete: (blobs: RecordingDataType[]) => void;
  langCode: string;
}

export default function RecordingStudio({
  utterances,
  configData,
  onRecordingComplete,
  langCode,
}: RecordingStudioProps) {
  const wavesurferRef = useRef<HTMLDivElement>(null);

  const [currIdx, setCurrIdx] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [alert, setAlert] = useState("Start recording");
  const [similarityIdx, setSimilarityIdx] = useState<number | null>(null);
  const [recordingData, setRecordingData] = useState<RecordingDataType[]>([]);
  const [showResult, setShowResult] = useState(false);

  const { wavesurfer } = useWavesurfer({
    container: wavesurferRef,
    waveColor: "#7f1d1d",
    height: 125,
    width: 350,
  });

  const isAssessAccuracy = configData?.features.includes("speechAccuracy");

  const {
    startRecording,
    stopRecording,
    recordingBlob,
    isRecording,
    mediaRecorder,
  } = useAudioRecorder({
    channelCount: configData?.channels,
    sampleRate: configData?.sampleRate,
    sampleSize: configData?.sampleSize,
    echoCancellation: configData?.features.includes("echoCancellation"),
    noiseSuppression: configData?.features.includes("noiseSuppression"),
    autoGainControl: configData?.features.includes("autoGainControl"),
  });

  const handleNext = () => {
    if (currIdx + 1 === utterances.length) {
      onRecordingComplete(recordingData);
    } else {
      setShowResult(false);
      setCurrIdx((prev) => (prev < utterances.length - 1 ? prev + 1 : prev));
    }
  };

  const handlePrev = () => {
    setShowResult(false);
    setCurrIdx((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  const handleChange = () => {
    if (!isRecording) {
      setShowResult(false);
      setSimilarityIdx(0);
      startRecording();

      if (isAssessAccuracy) {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = langCode || "en";
        recognition.onresult = async (event) => {
          const text = event?.results[0][0].transcript;
          assessSimilarity(text, utterances[currIdx].text);
        };
        recognition.abort();
        recognition.start();
      }

      setAlert("Listening...");
    }

    if (isRecording) {
      stopRecording();

      if (isAssessAccuracy) {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = langCode || "en";
        recognition.onresult = async (event) => {
          const text = event?.results[0][0].transcript;
          assessSimilarity(text, utterances[currIdx].text);
        };
        recognition.stop();
      }

      setAlert("Analyzing...");
      setIsProcessing(true);

      setTimeout(() => {
        setIsProcessing(false);
        setAlert("Click to re-attempt");
      }, 1000);
    }
  };

  const handleDownload = () => {
    const zip = new JSZip();

    recordingData.forEach((data) => {
      zip.file(`${data.idx}.webm`, data.audioBlob);
    });

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "recordings.zip");
    });
  };

  const assessSimilarity = (source: string, target: string) => {
    const similarity = stringSimilarity(
      normalizeSentence(source),
      normalizeSentence(target)
    );
    setSimilarityIdx(similarity);
  };

  // Function to upsert recording data based on idx
  const upsertRecordingData = (audioBlob: Blob) => {
    const idx = currIdx;
    const utterance = utterances[idx];
    setRecordingData((prevData) => {
      const existingIndex = prevData.findIndex((data) => data.idx === idx);
      if (existingIndex !== -1) {
        // If data with given idx exists, update it
        return prevData.map((data, index) =>
          index === existingIndex ? { ...data, utterance, audioBlob } : data
        );
      } else {
        // If data with given idx doesn't exist, add it
        return [...prevData, { idx, utterance, audioBlob }];
      }
    });
    toast.info("Recording saved");
  };

  const handleFinish = () => {};

  useEffect(() => {
    if (!recordingBlob) return;

    setShowResult(true);
    wavesurfer?.loadBlob(recordingBlob);
    // downloadBlob(recordingBlob);
    upsertRecordingData(recordingBlob);
    // recordingBlob will be present at this point after 'stopRecording' has been called
  }, [recordingBlob, wavesurfer]);

  return (
    <div className="px-12 py-16 min-h-screen flex flex-col gap-12 items-center">
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
      <div className="space-y-4 mb-16 flex flex-col items-center gap-3">
        <p className="text-3xl font-bold text-balance text-center">
          {utterances[currIdx].text}
        </p>
        <div className="flex flex-col gap-8 items-center">
          {mediaRecorder && (
            <LiveAudioVisualizer
              mediaRecorder={mediaRecorder}
              width={280}
              height={125}
              barWidth={1}
              barColor="#7f1d1d"
            />
          )}
          {!showResult && !mediaRecorder && (
            <div className="w-[280px] h-[125px] flex justify-center items-center">
              <div
                className={`border transition w-full ${
                  isProcessing ? "border-mute" : "border-destructive"
                }`}
              ></div>
            </div>
          )}
          <div
            ref={wavesurferRef}
            className={`transition overflow-hidden ${
              recordingBlob && !isRecording && showResult ? "h-fit" : "hidden"
            }`}
            onClick={onPlayPause}
          ></div>
          {/* </div> */}
          <div className="text-center space-y-4">
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
          {isAssessAccuracy && showResult && (
            <>
              <div className="border border-muted rounded-lg px-6 py-4 flex gap-4">
                <div className="space-y-1">
                  <span className="uppercase text-muted-foreground text-xs">
                    Speech Accuracy
                  </span>
                  <p>{similarityIdx && Math.round(similarityIdx * 100)} %</p>
                </div>
                <div className="border max-h-fit border-muted"></div>
                <div className="space-y-1">
                  <span className="uppercase text-muted-foreground text-xs">
                    Recommendation
                  </span>
                  <p>
                    {similarityIdx && similarityIdx < 0.7
                      ? "Consider re-attempting with clear voice and tempo"
                      : similarityIdx && similarityIdx < 0.95
                      ? "Decent. You may re-attempt or proceed to the next one."
                      : "Perfect speech! Redirecting to the next one.."}
                  </p>
                </div>
              </div>
            </>
          )}
          {showResult && (
            <Button
              className="rounded-full space-x-2"
              variant="outline"
              onClick={handleNext}
            >
              <ArrowRight className="w-4 h-4 animate-pulse" />
              <span>
                {" "}
                {isAssessAccuracy && similarityIdx && similarityIdx < 0.7
                  ? "Proceed anyway"
                  : "Go next"}
              </span>
            </Button>
          )}

          <Button onClick={handleDownload}>Download</Button>
        </div>
      </div>
    </div>
  );
}
