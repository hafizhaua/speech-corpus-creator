import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const TestMic = ({
  microphoneId,
  config,
}: {
  microphoneId: string;
  config: any;
}) => {
  const [recording, setRecording] = useState<boolean>(false);

  let mediaRecorder: MediaRecorder | undefined;
  let chunks: Blob[] = [];

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          deviceId: microphoneId,
          noiseSuppression: config.features.includes("noiseSuppression"),
          echoCancellation: config.features.includes("echoCancellation"),
          autoGainControl: config.features.includes("autoGainControl"),
        },
      })
      .then(function (stream) {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        setRecording(true);
        setTimeout(stopRecording, 2000); // Record for 2 seconds

        mediaRecorder.ondataavailable = function (event) {
          chunks.push(event.data);
        };

        mediaRecorder.onstop = function () {
          const blob = new Blob(chunks, { type: "audio/webm" });
          const audioURL = URL.createObjectURL(blob);
          const audio = new Audio(audioURL);
          audio.play();
          chunks = [];
        };
      })
      .catch(function (err) {
        console.error("Error accessing microphone: ", err);
      });
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={startRecording}
        disabled={recording}
      >
        {recording ? "Listening..." : "Test Microphone & Features"}
      </Button>
      <audio id="hiddenAudio" style={{ display: "none" }} />
    </>
  );
};

export default TestMic;
