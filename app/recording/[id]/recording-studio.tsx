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
import { ConfigDataType, RecordingDataType, UtteranceType } from "./types";
import { useParams } from "next/navigation";
import { storedRecordingTable } from "@/lib/dexie/db.config";

interface RecordingStudioProps {
  configData: ConfigDataType;
  utterances: UtteranceType[];
  onRecordingComplete: () => void;
  langCode: string;
  lastRecord: {
    idx: number;
    audioBlob: Blob | null;
  } | null;
}

export default function RecordingStudio({
  utterances,
  configData,
  onRecordingComplete,
  langCode,
  lastRecord,
}: RecordingStudioProps) {
  const params = useParams();
  const wavesurferRef = useRef<HTMLDivElement>(null);

  const [currIdx, setCurrIdx] = useState(lastRecord?.idx || 0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [alert, setAlert] = useState("Start recording (R)");
  const [similarityIdx, setSimilarityIdx] = useState<number | null>(null);
  const [showRecording, setShowRecording] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const recordBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  const { wavesurfer } = useWavesurfer({
    container: wavesurferRef,
    waveColor: "#7f1d1d",
    height: 125,
    width: 350,
  });

  const isAssessAccuracy =
    configData?.features?.includes("speechAccuracy") || false;

  const {
    startRecording,
    stopRecording,
    recordingBlob,
    isRecording,
    mediaRecorder,
  } = useAudioRecorder({
    deviceId: configData?.deviceId || "default",
    channelCount: configData?.channels,
    sampleRate: configData?.sampleRate,
    sampleSize: configData?.sampleSize,
    echoCancellation:
      configData?.features?.includes("echoCancellation") || true,
    noiseSuppression:
      configData?.features?.includes("noiseSuppression") || true,
    autoGainControl: configData?.features?.includes("autoGainControl") || true,
  });

  const handleNext = () => {
    if (currIdx + 1 === utterances.length) {
      onRecordingComplete();
    } else {
      setShowRecording(false);
      setShowAssessment(false);
      setIsProcessing(false);
      setCurrIdx((prev) => (prev < utterances.length - 1 ? prev + 1 : prev));
      setAlert("Start recording (R)");
    }
  };

  const handlePrev = () => {
    setShowRecording(false);
    setCurrIdx((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  const handleChange = () => {
    if (!isRecording) {
      setShowRecording(false);
      setShowAssessment(false);
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

      setAlert("Listening... (R)");
    }

    if (isRecording) {
      console.log("Recording stopped");
      stopRecording();

      if (isAssessAccuracy) {
        setAlert("Analyzing...");
        setIsProcessing(true);

        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = langCode || "en";
        recognition.onresult = async (event) => {
          const text = event?.results[0][0].transcript;
          assessSimilarity(text, utterances[currIdx].text);
        };

        recognition.abort();

        if (similarityIdx && similarityIdx > 0) {
          setIsProcessing(false);
          setShowAssessment(true);
          setAlert("Click to re-attempt");
        }

        setTimeout(() => {
          setIsProcessing(false);
          setShowAssessment(true);
          setAlert("Click to re-attempt");
        }, 1500);
        recognition.stop();
      } else {
        setAlert("Click to re-attempt");
      }
    }
  };

  const assessSimilarity = (source: string, target: string) => {
    console.log("Assessing...");
    const similarity = stringSimilarity(
      normalizeSentence(source),
      normalizeSentence(target)
    );

    setSimilarityIdx(similarity);
  };

  // Function to upsert recording data based on idx
  const upsertRecordingData = async (audioBlob: Blob) => {
    const idx = currIdx;
    const utterance = utterances[idx];

    const record = {
      idx: idx,
      utteranceId: utterance.id,
      utterance: utterance.text,
      audioBlob: audioBlob,
      setId: params.id,
    };

    try {
      const existingData = await storedRecordingTable
        .where({ utteranceId: record.utteranceId, setId: record.setId })
        .first();

      if (existingData) {
        await storedRecordingTable.update(existingData.id, record);
        console.info(`Recording updated with id ${existingData.id}`);
        toast.info("Recording updated");
        return;
      } else {
        const id = await storedRecordingTable.add(record);
        console.info(`Recording saved with id ${id}`);
        toast.info("Recording saved");
      }
    } catch (error) {
      toast.error("Failed to save the recording");
    }
  };

  useEffect(() => {
    if (!recordingBlob) return;

    setShowRecording(true);

    wavesurfer?.loadBlob(recordingBlob);
    // downloadBlob(recordingBlob);
    upsertRecordingData(recordingBlob);
    // recordingBlob will be present at this point after 'stopRecording' has been called
  }, [recordingBlob, wavesurfer]);

  useEffect(() => {
    if (lastRecord && lastRecord?.audioBlob) {
      setCurrIdx(lastRecord.idx);
      setAlert("Start recording (R)");
      setShowRecording(true);
      if (wavesurfer) {
        wavesurfer?.loadBlob(lastRecord.audioBlob);
        console.log("Wavesurfer loaded");
      } else console.log("No wavesurfer");
    }
  }, [wavesurfer]);

  useEffect(() => {
    // Attach the event listener on component mount
    document.addEventListener("keydown", handleKeyDown);

    // Clean up the listener on component unmount to prevent memory leaks
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "r") {
      // Replace with your desired function call
      if (recordBtnRef?.current) recordBtnRef.current.click();
    }

    if (event.key === "e") {
      if (nextBtnRef?.current) nextBtnRef.current.click();
    }

    if (event.key === " ") {
      console.log("Play/pause");
      wavesurferRef?.current?.click();
      // onPlayPause();
    }
  };

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
      <div className="relative space-y-4 mb-16 flex flex-col items-center gap-3">
        <p className="text-3xl font-bold text-balance text-center">
          {utterances[currIdx].text}
        </p>
        {/* <div className="relative w-full text-center">
          <TextFade
            text={utterances[currIdx].text}
            className="text-3xl font-bold text-balance text-center"
          />
        </div> */}
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
          {!showRecording && !mediaRecorder && (
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
              showRecording ? "h-fit" : "hidden"
            }`}
            onClick={onPlayPause}
          ></div>
          {/* </div> */}
          <div className="text-center space-y-4">
            <button
              className="group"
              onClick={handleChange}
              disabled={isProcessing}
              ref={recordBtnRef}
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
          {isAssessAccuracy && showAssessment && !isProcessing && (
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
                      : similarityIdx && similarityIdx >= 0.95
                      ? "Perfect speech! Redirecting to the next one.."
                      : "Unable to process your speech"}
                  </p>
                </div>
              </div>
            </>
          )}
          <div className="flex gap-2 items-center">
            {showRecording && !isProcessing && (
              <Button
                className="rounded-full space-x-2"
                variant="outline"
                onClick={handleNext}
                ref={nextBtnRef}
              >
                <ArrowRight className="w-4 h-4 animate-pulse" />
                <span>
                  {" "}
                  {isAssessAccuracy && similarityIdx && similarityIdx < 0.7
                    ? "Proceed anyway (E)"
                    : "Go next (E)"}
                </span>
              </Button>
            )}

            <Button
              onClick={() => {
                onRecordingComplete();
              }}
              variant="link"
            >
              Finish anyway
            </Button>
          </div>
          {/* <Button
            onClick={() => {
              downloadBlob(recordingData[currIdx].audioBlob);
              // handleDownload()
            }}
          >
            Download
          </Button> */}
        </div>
      </div>
    </div>
  );
}
