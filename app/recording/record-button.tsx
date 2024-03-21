"use client";

import React, { useState } from "react";

export default function RecordButton() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [alert, setAlert] = useState("Click to start recording");
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
      onStart();
    }
    if (isRecording) {
      onStop();
    }
    setIsRecording((prev) => !prev);
  };
  return (
    <div className="space-y-2 text-center">
      <button className="group" onClick={handleChange} disabled={isProcessing}>
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
        className={`text-muted-foreground ${
          (isRecording || isProcessing) && "animate-pulse"
        }`}
      >
        {alert}
      </p>
    </div>
  );
}
