"use client";

import React, { useState } from "react";
import { ConfigDataType, RecordingDataType, UtteranceType } from "./types";
import RecordingStudio from "./recording-studio";
import ConfigForm from "./config-form";
import ExportForm from "./export-form";
import { useLiveQuery } from "dexie-react-hooks";
import { storedRecordingTable } from "@/lib/dexie/db.config";
import { useParams } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Cross, X } from "lucide-react";
import { getAllRecordingsBySetId } from "@/lib/dexie/stored-recordings";
import { v4 } from "uuid";

export const Session = ({
  utterances,
  langCode,
}: {
  utterances: UtteranceType[];
  langCode: string;
}) => {
  const params = useParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [configData, setConfigData] = useState<ConfigDataType>({});
  const [audioData, setAudioData] = useState<RecordingDataType[]>([]);
  const [lastRecord, setLastRecord] = useState({ idx: 0, audioBlob: null });
  const lastData = useLiveQuery(() =>
    storedRecordingTable.where({ setId: params.id }).reverse().first()
  );
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleConfigSubmit = (data: ConfigDataType) => {
    setConfigData(data);

    if (lastData?.idx >= 0) {
      setLastRecord({ idx: lastData.idx, audioBlob: lastData.audioBlob });
      setIsAlertOpen(true);
    } else {
      setCurrentStep(2);
    }
  };

  const handleRecordingComplete = async () => {
    const recordingData = await getAllRecordingsBySetId(params.id as string);
    console.log("Recording data: ", recordingData);

    const data = recordingData.map((dt) => {
      return {
        idx: dt.idx,
        utterance: dt.utterance,
        audioBlob: dt.audioBlob,
        utteranceId: v4(),
      };
    });
    setAudioData(data);
    setCurrentStep(3);
  };

  const handleRestart = async () => {
    try {
      await storedRecordingTable.where({ setId: params.id }).delete();
      setLastRecord({ idx: 0, audioBlob: null });
      setCurrentStep(2);
    } catch (error) {
      console.error("Error deleting stored recordings: ", error);
    }
  };

  console.log(utterances);

  return (
    <div>
      {currentStep === 1 && <ConfigForm onSubmit={handleConfigSubmit} />}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Do you want to continue?</AlertDialogTitle>
            <AlertDialogDescription>
              We found your previous recording progress for this set. You can
              continue the recording from where you left off or restart from the
              beginning instead.
            </AlertDialogDescription>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-yellow-600 font-semibold">
                Warning!
              </AlertTitle>
              <AlertDescription className="text-muted-foreground">
                Restarting your progress will permanently delete your previous
                recording progress of this set.
              </AlertDescription>
            </Alert>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAlertOpen(false);
                handleRestart();
              }}
            >
              Restart
            </Button>
            <Button
              onClick={() => {
                setIsAlertOpen(false);

                lastRecord.idx === utterances.length - 1
                  ? handleRecordingComplete()
                  : setCurrentStep(2);
              }}
            >
              Continue
            </Button>
            <Button
              variant="ghost"
              className="absolute top-0 right-0"
              onClick={() => setIsAlertOpen(false)}
            >
              <X width={16} />
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {currentStep === 2 && (
        <RecordingStudio
          lastRecord={lastRecord}
          langCode={langCode}
          configData={configData}
          utterances={utterances}
          onRecordingComplete={handleRecordingComplete}
        />
      )}
      {currentStep === 3 && <ExportForm audioData={audioData} />}
    </div>
  );
};
