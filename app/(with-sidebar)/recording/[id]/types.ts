import { z } from "zod";

export type UtteranceType = {
  id: string;
  text: string;
};

export type ConfigDataType = {
  deviceId?: string;
  sampleRate?: number;
  sampleSize?: number;
  channels?: number;
  features?: string[];
};

export type RecordingDataType = {
  idx: number;
  utterance: UtteranceType;
  audioBlob: Blob;
  utteranceId: string;
};

export interface File {
  id: string;
  name: string;
  format: string;
  type: string; // Corrected to specify type as 'file'
}

export interface Folder {
  id: string;
  name: string;
  format: string;
  type: string; // Corrected to specify type as 'folder'
  children?: FileSystemItem[]; // Recursive type definition
}

export type FileSystemItem = Folder | File;

export interface FileTreeProps {
  formValue: ExportFormType;
  recordedCount: number;
  utterances: UtteranceType[];
}

export const formSchema = z.object({
  preset: z.string().optional(),
  fileFormat: z.string().min(1, { message: "Please select a valid format" }),
  fileName: z.string().min(1, { message: "Please enter a valid name" }),
  audioPath: z.string(),
  audioFormat: z.string().min(1, { message: "Please select a valid format" }),
  audioNamePattern: z
    .string()
    .min(1, { message: "Please enter a valid pattern" }),
  audioPrefix: z.string(),
  audioSuffix: z.string(),
  transcriptionPath: z.string(),
  transcriptionName: z
    .string()
    .min(1, { message: "Please enter a valid name" }),
  transcriptionFormat: z
    .string()
    .min(1, { message: "Please select a valid format" }),
  transcriptionDelimiter: z
    .string()
    .min(1, { message: "Please enter a valid delimiter" }),
  includePath: z.boolean(),
  sampleRate: z.coerce
    .number()
    .refine((v) => v, { message: "Please enter a valid sample rate" }),
  // sampleSize: z.coerce.number().refine((v) => v),
  channels: z.coerce.number().refine((v) => v, {
    message: "Please enter a valid channel number",
  }),
});
// export type ExportFormType = {
//   fileFormat: string;
//   fileName: string;
//   audioPath: string;
//   audioFormat: string;
//   audioNamePattern: string;
//   audioPrefix: string;
//   audioSuffix: string;
//   transcriptionPath: string;
//   transcriptionName: string;
//   transcriptionFormat: string;
//   transcriptionDelimiter: string;
// };

export type ExportFormType = z.infer<typeof formSchema>;
