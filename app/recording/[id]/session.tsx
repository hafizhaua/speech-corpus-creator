"use client";

import React, { useState } from "react";
import { ConfigDataType, RecordingDataType, UtteranceType } from "./types";
import RecordingStudio from "./recording-studio";
import ConfigForm from "./config-form";
import ExportForm from "./export-form";

export const Session = ({
  utterances,
  langCode,
}: {
  utterances: UtteranceType[];
  langCode: string;
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [configData, setConfigData] = useState<ConfigDataType>({});
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
    setConfigData({});
    setAudioData([]);
  };

  return (
    <div>
      {currentStep === 1 && <ConfigForm onSubmit={handleConfigSubmit} />}
      {currentStep === 2 && (
        <RecordingStudio
          langCode={langCode}
          configData={configData}
          utterances={utterances}
          onRecordingComplete={handleRecordingComplete}
        />
      )}
      {currentStep === 3 && (
        <ExportForm utterances={utterances} audioData={audioData} />
      )}
    </div>
  );
};
