"use client";

import React, { useState } from "react";
import { ConfigDataType, RecordingDataType, UtteranceType } from "./types";
import RecordingStudio from "./recording-studio";
import ConfigForm from "./config-form";
import ExportForm from "./export-form";

export const Session = ({ utterances }: { utterances: UtteranceType[] }) => {
  const [currentStep, setCurrentStep] = useState(3);
  const [configData, setConfigData] = useState<ConfigDataType | null>(null);
  const [audioData, setAudioData] = useState<RecordingDataType[]>([]);

  const handleConfigSubmit = (data: ConfigDataType) => {
    setConfigData(data);
    setCurrentStep(2);
  };

  const handleRecordingComplete = (recordingData: RecordingDataType[]) => {
    setAudioData(recordingData);
    setCurrentStep(3);
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setConfigData(null);
    setAudioData([]);
  };

  return (
    <div>
      {currentStep === 1 && <ConfigForm onSubmit={handleConfigSubmit} />}
      {currentStep === 2 && configData && (
        <RecordingStudio
          configData={configData}
          utterances={utterances}
          onRecordingComplete={handleRecordingComplete}
        />
      )}
      {currentStep === 3 && <ExportForm utterances={utterances} />}
    </div>
  );
};
