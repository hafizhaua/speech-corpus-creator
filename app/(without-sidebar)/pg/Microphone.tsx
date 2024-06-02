"use client";

import React, { useState, useEffect } from "react";

interface MediaDeviceInfo {
  deviceId: string;
  kind: string;
  label: string;
}

function MicrophoneList(): JSX.Element {
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>("");

  useEffect(() => {
    async function getMicrophones() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const microphoneList = devices.filter(
          (device) => device.kind === "audioinput"
        );
        setMicrophones(microphoneList);

        // Select the first microphone by default
        if (microphoneList.length > 0) {
          setSelectedMicrophone(microphoneList[0].deviceId);
        }
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    }

    getMicrophones();
  }, []);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: selectedMicrophone },
        },
      });

      // Now you can use the 'stream' for recording
      // For example, you can use it with Web Audio API or other recording libraries
      // console.log("Recording started with microphone:", selectedMicrophone);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  }

  return (
    <div>
      <h2>Available Microphones:</h2>
      <select
        value={selectedMicrophone}
        onChange={(e) => setSelectedMicrophone(e.target.value)}
      >
        {microphones.map((microphone) => (
          <option key={microphone.deviceId} value={microphone.deviceId}>
            {microphone.label || `Microphone ${microphone.deviceId}`}
          </option>
        ))}
      </select>
      <button onClick={startRecording}>Start Recording</button>
    </div>
  );
}

export default MicrophoneList;
