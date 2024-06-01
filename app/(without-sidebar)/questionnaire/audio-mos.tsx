import WavesurferPlayer from "@wavesurfer/react";
import React, { useState } from "react";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import WaveSurfer from "wavesurfer.js";

export default function AudioMOS({
  audioUrl,
  label,
}: {
  audioUrl: string;
  label?: string;
}) {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const onReady = (ws) => {
    setWavesurfer(ws);
    setIsPlaying(false);
  };

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  return (
    <div className="w-full max-w-xl mx-auto py-8">
      <WavesurferPlayer
        height={100}
        waveColor="#7f1d1d"
        url={audioUrl}
        onReady={onReady}
        onClick={() => wavesurfer?.play()}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      {label && (
        <p className="text-center text-sm text-muted-foreground mt-2">
          {label}
        </p>
      )}
    </div>
  );
}
