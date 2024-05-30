"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfigDataType } from "./types";
import { useEffect, useRef, useState } from "react";
import { useAudioRecorder } from "react-audio-voice-recorder";
import TestMic from "./test-mic";

const formSchema = z.object({
  features: z.array(z.string()),
  deviceId: z.string(),
});

interface MediaDeviceInfo {
  deviceId: string;
  kind: string;
  label: string;
}

export default function ConfigForm({
  onSubmit,
}: {
  onSubmit: (data: ConfigDataType) => void;
}) {
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>("");

  useEffect(() => {
    async function getMicrophones() {
      try {
        const permission = await navigator.permissions.query({
          name: "microphone" as PermissionName,
        });

        if (permission.state === "granted") setIsMicEnabled(true);

        const devices = await navigator.mediaDevices.enumerateDevices();
        const microphoneList = devices.filter(
          (device) => device.kind === "audioinput"
        );
        setMicrophones(microphoneList);

        // Select the first microphone by default
        if (microphoneList.length > 0) {
          setSelectedMicrophone(microphoneList[0].deviceId);
          form.setValue("deviceId", microphoneList[0].deviceId);
        }
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    }

    getMicrophones();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      features: [
        "speechAccuracy",
        "echoCancellation",
        "noiseSuppression",
        "autoGainControl",
      ],
    },
  });

  const formValue = form.watch();

  const featureOption = [
    { id: "speechAccuracy", label: "Speech Accuracy Assessment" },
    { id: "echoCancellation", label: "Echo Cancellation" },
    { id: "noiseSuppression", label: "Noise Suppression" },
    { id: "autoGainControl", label: "Auto Gain Control" },
  ];

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values);
  }

  const handleEnableMic = async () => {
    try {
      const handleSuccess = async (stream) => {
        stream.getTracks().forEach((track) => track.stop());
        const devices = await navigator.mediaDevices.enumerateDevices();
        const microphoneList = devices.filter(
          (device) => device.kind === "audioinput"
        );
        if (microphoneList.length > 0) {
          navigator.mediaDevices.getUserMedia({
            audio: {
              deviceId: devices[0].deviceId,
            },
          });

          setMicrophones(microphoneList);
          setSelectedMicrophone(devices[0].deviceId);
          setIsMicEnabled(true);
        }
      };

      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then(handleSuccess);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  return (
    <div className="px-6 py-10  md:px-10 md:py-12 space-y-4">
      <h1 className="text-2xl font-bold">Audio Configuration Preference</h1>
      <p className="text-muted-foreground">
        Before we start the recording session, please select your preference of
        the audio constraints.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="deviceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Microphone</FormLabel>
                <div className="flex gap-4">
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl className="flex gap-4">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select microphone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {microphones[0]?.deviceId !== "" ? (
                        microphones?.map((microphone) => {
                          return (
                            <SelectItem
                              value={microphone?.deviceId}
                              key={microphone?.deviceId}
                            >
                              {microphone.label ||
                                `Microphone ${microphone.deviceId}`}
                            </SelectItem>
                          );
                        })
                      ) : (
                        <SelectItem value="notfound">
                          No Microphone Found
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {isMicEnabled ? (
                    <TestMic
                      microphoneId={formValue.deviceId}
                      config={formValue}
                    />
                  ) : (
                    <Button
                      type="button"
                      className=""
                      onClick={handleEnableMic}
                      variant="outline"
                    >
                      Enable Microphone
                    </Button>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <div className="mb-4 space-y-1">
                  <FormLabel className="text-base">
                    Processing Features
                  </FormLabel>
                  <FormDescription>
                    Select audio processing features to be applied for each
                    audio segment
                  </FormDescription>
                </div>
                {/* <div className="space-y-2"> */}
                {featureOption.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="features"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                {/* </div> */}
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-2 w-full">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
